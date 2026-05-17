"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AnswerEntry, Constellation, ConstellationCard, PositionMapData, RelationshipType, UserInsight } from "@/lib/types";
import { RELATIONSHIPS, getRelationship } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";
import ThinkerModal from "./ThinkerModal";
import PositionMap from "./PositionMap";


type PartialCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  what_they_believe?: string;
  thumbnail_url?: string;
};

type Cards = Partial<Record<RelationshipType, PartialCard>>;
type LoadPhase = "preview" | "detail" | "complete" | "error";

// Spotlight thinker types (shown as flip cards)
const SPOTLIGHT_TYPES: RelationshipType[] = ["mirror", "shadow", "antagonist"];

// All 7 thinker types in display order
const ALL_THINKER_ORDER: RelationshipType[] = [
  "precursor", "mirror", "complement",
  "antagonist", "shadow", "horizon",
  "integrated_self",
];

function buildInitialCards(constellation: Constellation): Cards {
  const cards: Cards = {};
  for (const r of RELATIONSHIPS) {
    const c = constellation[r.key];
    if (c) {
      cards[r.key] = {
        name: c.name,
        tagline: c.tagline,
        match_reason: c.match_reason,
        what_they_believe: c.what_they_believe,
        thumbnail_url: c.thumbnail_url,
      };
    }
  }
  return cards;
}

export default function ResultsView({
  sessionId,
  topicLabel,
  topic,
  profileSummary: initialProfileSummary,
  constellation,
  answers,
  userEmail,
  emailAlreadySent,
}: {
  sessionId: string;
  topicLabel: string;
  topic: string;
  profileSummary: string | null;
  constellation: Constellation | null;
  answers: AnswerEntry[] | null;
  userEmail: string | null;
  emailAlreadySent: boolean;
}) {
  const isPreloaded = !!constellation;

  const [phase, setPhase] = useState<LoadPhase>(isPreloaded ? "complete" : "preview");
  const [userInsight, setUserInsight] = useState<UserInsight | null>(
    isPreloaded ? (constellation.user_insight ?? null) : null
  );
  const [cards, setCards] = useState<Cards>(() =>
    isPreloaded ? buildInitialCards(constellation) : {}
  );
  const [detailLoading, setDetailLoading] = useState<Set<RelationshipType>>(new Set());
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [positionMap, setPositionMap] = useState<PositionMapData | null>(
    isPreloaded ? (constellation.position_map ?? null) : null
  );
  const positionMapStartedRef = useRef(false);
  const positionMapDataRef = useRef<PositionMapData | null>(null);
  const pmPollRef = useRef<{ interval: ReturnType<typeof setInterval>; timeout: ReturnType<typeof setTimeout> } | null>(null);

  // Cleanup position map polling on unmount
  useEffect(() => {
    return () => {
      if (pmPollRef.current) {
        clearInterval(pmPollRef.current.interval);
        clearTimeout(pmPollRef.current.timeout);
      }
    };
  }, []);

  const [shareStatus, setShareStatus] = useState<"idle" | "sharing" | "copied" | "downloaded" | "error">("idle");

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/share/${sessionId}`
    : `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://selfish-quiz1.vercel.app"}/share/${sessionId}`;

  const handleShare = async () => {
    setShareStatus("sharing");
    try {
      // Try Web Share API first (mobile)
      if (navigator.share) {
        const shareData: ShareData = {
          title: userInsight?.archetype_label ?? `My stance on ${topicLabel}`,
          text: userInsight?.archetype_description ?? `See where I stand on ${topicLabel}`,
          url: shareUrl,
        };

        // Try to include the OG image as a file
        try {
          const imgRes = await fetch(`/api/og/${sessionId}`);
          if (imgRes.ok) {
            const blob = await imgRes.blob();
            const file = new File([blob], "my-stance.png", { type: "image/png" });
            if (navigator.canShare?.({ files: [file] })) {
              shareData.files = [file];
            }
          }
        } catch {
          // Image fetch failed — share without image
        }

        await navigator.share(shareData);
        setShareStatus("idle");
        return;
      }

      // Desktop fallback: copy link to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch (err) {
      // User cancelled share sheet — not an error
      if (err instanceof Error && err.name === "AbortError") {
        setShareStatus("idle");
        return;
      }
      console.error("Share failed:", err);
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  const handleDownloadImage = async () => {
    try {
      const res = await fetch(`/api/og/${sessionId}`);
      if (!res.ok) throw new Error("Failed to generate image");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-stance.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShareStatus("downloaded");
      setTimeout(() => setShareStatus("idle"), 2000);
    } catch (err) {
      console.error("Download failed:", err);
      setShareStatus("error");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  };

  const [modalType, setModalType] = useState<RelationshipType | null>(null);
  const [pendingModal, setPendingModal] = useState<RelationshipType | null>(null);

  // Flip state for spotlight thinker cards
  const [flippedCards, setFlippedCards] = useState<Set<RelationshipType>>(
    () => isPreloaded ? new Set(SPOTLIGHT_TYPES) : new Set()
  );

  // ── Card carousel state ──
  const [slideIndex, setSlideIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);

  // Total slides: 4 insight cards + spotlight thinkers + 1 remaining thinkers + 1 position map/share
  const TOTAL_SLIDES = 4 + SPOTLIGHT_TYPES.length + 1 + 1;

  // Push browser history entries per slide so back button navigates carousel
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      // Replace the initial entry with slide 0
      window.history.replaceState({ slide: 0 }, "");
      isInitialMount.current = false;
      return;
    }
    // Push a new entry when navigating forward
    window.history.pushState({ slide: slideIndex }, "");
  }, [slideIndex]);

  useEffect(() => {
    function handlePopState(e: PopStateEvent) {
      const state = e.state as { slide?: number } | null;
      if (state && typeof state.slide === "number") {
        setSlideIndex(state.slide);
        setDragX(0);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const goNext = useCallback(() => {
    setSlideIndex((i) => Math.min(i + 1, TOTAL_SLIDES - 1));
    setDragX(0);
  }, []);

  const goPrev = useCallback(() => {
    setSlideIndex((i) => Math.max(i - 1, 0));
    setDragX(0);
  }, []);

  function onPointerDown(e: React.PointerEvent) {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || tag === "A") return;
    dragStartRef.current = { x: e.clientX, time: Date.now() };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragStartRef.current || !isDragging) return;
    setDragX(e.clientX - dragStartRef.current.x);
  }

  function onPointerUp() {
    if (!dragStartRef.current) return;
    const threshold = 60;
    const velocity = Math.abs(dragX) / (Date.now() - dragStartRef.current.time + 1);
    if (Math.abs(dragX) > threshold || velocity > 0.4) {
      if (dragX < 0) goNext();
      else goPrev();
    }
    setDragX(0);
    setIsDragging(false);
    dragStartRef.current = null;
  }

  const STATUS_MESSAGES = [
    "Analyzing your positions...",
    "Mapping your intellectual landscape...",
    "Finding your thinkers...",
    "Your map is almost ready...",
  ];
  const [statusMsgIdx, setStatusMsgIdx] = useState(0);
  useEffect(() => {
    if (phase !== "preview") return;
    const id = setInterval(() => {
      setStatusMsgIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "skipped" | "failed">(
    () => {
      if (emailAlreadySent) return "sent";
      if (!userEmail) return "skipped";
      return "idle";
    }
  );
  const emailTriggeredRef = useRef(false);
  const generationStartedRef = useRef(false);
  const preGenTriggeredRef = useRef(false);

  // Progressive loading — only fires for new (in_progress) sessions
  useEffect(() => {
    if (isPreloaded || generationStartedRef.current || !answers) return;
    generationStartedRef.current = true;

    async function runPreview() {
      try {
        let data: {
          user_insight: UserInsight;
          thinkers: { type: RelationshipType; name: string; tagline: string }[];
        } | null = null;

        try {
          const cached = sessionStorage.getItem(`selfish_preview_${sessionId}`);
          if (cached) {
            data = JSON.parse(cached);
            sessionStorage.removeItem(`selfish_preview_${sessionId}`);
          }
        } catch {
          // sessionStorage not available
        }

        if (!data) {
          const res = await fetch("/api/constellation/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, answers }),
          });
          if (!res.ok) {
            const d = await res.json().catch(() => ({})) as { error?: string };
            throw new Error(d.error ?? `Preview failed (${res.status})`);
          }
          data = await res.json() as {
            user_insight: UserInsight;
            thinkers: { type: RelationshipType; name: string; tagline: string }[];
          };
        }

        setUserInsight(data.user_insight);
        const initial: Cards = {};
        for (const t of data.thinkers) {
          initial[t.type] = { name: t.name, tagline: t.tagline };
        }
        setCards(initial);
        setPhase("detail");

        // Fire position map generation in parallel (non-blocking)
        if (!positionMapStartedRef.current) {
          positionMapStartedRef.current = true;
          fetch("/api/constellation/position-map", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              answers,
              thinkers: data.thinkers.map((t) => t.name),
            }),
          })
            .then(async (res) => {
              if (!res.ok) throw new Error(`Position map failed (${res.status})`);
              const pmData = (await res.json()) as PositionMapData;
              positionMapDataRef.current = pmData;
              setPositionMap(pmData);
            })
            .catch((err) => console.error("Position map generation failed:", err));
        }

        // Fire all 7 detail calls in parallel
        const loadingSet = new Set(data.thinkers.map((t) => t.type));
        setDetailLoading(loadingSet);

        const detailResults: Partial<Record<RelationshipType, { match_reason: string; what_they_believe?: string; thumbnail_url?: string }>> = {};
        let completed = 0;

        await Promise.allSettled(
          data.thinkers.map(async (t) => {
            try {
              const dres = await fetch("/api/constellation/detail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  type: t.type,
                  name: t.name,
                  tagline: t.tagline,
                  topic,
                  answers,
                }),
              });
              const detail = await dres.json() as { type: RelationshipType; match_reason: string; what_they_believe?: string; thumbnail_url?: string };
              detailResults[t.type] = {
                match_reason: detail.match_reason,
                what_they_believe: detail.what_they_believe,
                thumbnail_url: detail.thumbnail_url,
              };
              setCards((prev) => ({
                ...prev,
                [t.type]: {
                  ...prev[t.type]!,
                  match_reason: detail.match_reason,
                  ...(detail.what_they_believe ? { what_they_believe: detail.what_they_believe } : {}),
                  ...(detail.thumbnail_url ? { thumbnail_url: detail.thumbnail_url } : {}),
                },
              }));
              setDetailLoading((prev) => {
                const next = new Set(prev);
                next.delete(t.type);
                return next;
              });
            } catch (err) {
              console.error(`Detail failed for ${t.type}:`, err);
              setDetailLoading((prev) => {
                const next = new Set(prev);
                next.delete(t.type);
                return next;
              });
            } finally {
              completed++;
            }
          })
        );

        setPhase("complete");

        // Build final constellation for saving
        const fullConstellation: Partial<Record<RelationshipType, ConstellationCard>> = {};
        for (const t of data.thinkers) {
          const detail = detailResults[t.type];
          fullConstellation[t.type] = {
            name: t.name,
            tagline: t.tagline,
            match_reason: detail?.match_reason ?? "",
            ...(detail?.thumbnail_url ? { thumbnail_url: detail.thumbnail_url } : {}),
          };
        }

        // Save to DB (include position_map if it arrived before save fires)
        await fetch("/api/constellation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            constellation: {
              ...fullConstellation,
              user_insight: data.user_insight,
              ...(positionMapDataRef.current ? { position_map: positionMapDataRef.current } : {}),
            },
          }),
        }).catch((err) => console.error("Save failed:", err));

        // If position map arrives AFTER the save, patch it in
        if (!positionMapDataRef.current) {
          const check = setInterval(() => {
            if (positionMapDataRef.current) {
              clearInterval(check);
              clearTimeout(stopCheck);
              fetch("/api/constellation/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  session_id: sessionId,
                  patch: { position_map: positionMapDataRef.current },
                }),
              }).catch((err) => console.error("Position map patch save failed:", err));
            }
          }, 500);
          const stopCheck = setTimeout(() => clearInterval(check), 30000);
          // Store refs so cleanup can clear them if component unmounts
          pmPollRef.current = { interval: check, timeout: stopCheck };
        }

        // Trigger email after save
        if (userEmail && !emailAlreadySent && !emailTriggeredRef.current) {
          emailTriggeredRef.current = true;
          setEmailStatus("sending");
          fetch("/api/send-results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          })
            .then(async (r) => {
              const d = await r.json().catch(() => ({})) as { skipped?: boolean; error?: string };
              if (!r.ok) throw new Error(d.error ?? `HTTP ${r.status}`);
              setEmailStatus(d.skipped ? "skipped" : "sent");
            })
            .catch((err) => {
              console.error("Email send failed:", err);
              setEmailStatus("failed");
            });
        }
      } catch (err) {
        console.error("Preview failed:", err);
        setPreviewError(err instanceof Error ? err.message : "Something went wrong.");
        setPhase("error");
      }
    }

    void runPreview();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch position map for preloaded sessions that are missing it
  useEffect(() => {
    if (!isPreloaded || positionMap || positionMapStartedRef.current || !answers) return;
    // Extract thinker names from the constellation
    const thinkerNames = RELATIONSHIPS.map((r) => constellation[r.key]?.name).filter(Boolean) as string[];
    if (thinkerNames.length === 0) return;
    positionMapStartedRef.current = true;
    fetch("/api/constellation/position-map", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, answers, thinkers: thinkerNames }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Position map failed (${res.status})`);
        const pmData = (await res.json()) as PositionMapData;
        positionMapDataRef.current = pmData;
        setPositionMap(pmData);
        // Patch-save to DB
        fetch("/api/constellation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId, patch: { position_map: pmData } }),
        }).catch((err) => console.error("Position map patch save failed:", err));
      })
      .catch((err) => console.error("Position map re-fetch failed:", err));
  }, [isPreloaded, positionMap, answers]); // eslint-disable-line react-hooks/exhaustive-deps

  // Email trigger for preloaded sessions
  useEffect(() => {
    if (!isPreloaded || emailTriggeredRef.current) return;
    if (emailAlreadySent || !userEmail) return;
    emailTriggeredRef.current = true;
    setEmailStatus("sending");
    fetch("/api/send-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const d = await res.json().catch(() => ({})) as { skipped?: boolean; error?: string };
        if (!res.ok) throw new Error(d.error ?? `HTTP ${res.status}`);
        setEmailStatus(d.skipped ? "skipped" : "sent");
      })
      .catch((err) => {
        console.error("Email send failed:", err);
        setEmailStatus("failed");
      });
  }, [isPreloaded, sessionId, userEmail, emailAlreadySent]);

  // Speculative pre-generation
  useEffect(() => {
    if (phase !== "complete") return;
    if (preGenTriggeredRef.current) return;
    preGenTriggeredRef.current = true;

    const controller = new AbortController();

    const thinkers = RELATIONSHIPS.flatMap((r) => {
      const card = cards[r.key];
      return card?.name ? [{ type: r.key, name: card.name }] : [];
    });

    void Promise.allSettled(
      thinkers.map(({ type, name }) =>
        fetch("/api/thinker-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            thinker_slug: slugify(name),
            thinker_name: name,
            relationship_type: type,
          }),
          signal: controller.signal,
        }).catch(() => {})
      )
    );

    return () => controller.abort();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // When detail finishes loading for a pending card, open the modal
  useEffect(() => {
    if (!pendingModal) return;
    if (!detailLoading.has(pendingModal)) {
      setModalType(pendingModal);
      setPendingModal(null);
    }
  }, [pendingModal, detailLoading]);

  const orderedKeys = ALL_THINKER_ORDER;
  const modalIndex = modalType ? orderedKeys.indexOf(modalType) : -1;

  // Remaining thinkers (not spotlighted)
  const remainingThinkerTypes = ALL_THINKER_ORDER.filter((t) => !SPOTLIGHT_TYPES.includes(t));

  // Phase 1 — preview API in flight
  if (phase === "preview") {
    const NODE_COUNT = 7;
    const RADIUS = 52;
    const CENTER = 68;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i * 360) / NODE_COUNT - 90;
      const rad = (angle * Math.PI) / 180;
      return {
        x: CENTER + RADIUS * Math.cos(rad),
        y: CENTER + RADIUS * Math.sin(rad),
        delay: (i * 1.8) / NODE_COUNT,
      };
    });

    return (
      <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col justify-center">
        {/* Dot indicators (single dot for loading) */}
        <div className="flex justify-center gap-2 mb-6">
          <div className="h-2 w-6 rounded-full bg-neutral-900" />
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-neutral-300" />
          ))}
        </div>

        <div
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[520px] sm:min-h-[560px] items-center justify-center text-center p-8"
        >
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
            {topicLabel}
          </div>
          <div
            className="relative mb-8"
            style={{ width: CENTER * 2, height: CENTER * 2 }}
          >
            {nodes.map((n, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-neutral-400"
                style={{
                  width: 10,
                  height: 10,
                  left: n.x - 5,
                  top: n.y - 5,
                  animation: `node-pulse 1.8s ease-in-out ${n.delay.toFixed(2)}s infinite`,
                }}
              />
            ))}
          </div>
          <p key={statusMsgIdx} className="text-sm text-neutral-500 fade-in">
            {STATUS_MESSAGES[statusMsgIdx]}
          </p>
        </div>
      </main>
    );
  }

  // Phase 1 failed
  if (phase === "error") {
    return (
      <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col justify-center">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[520px] sm:min-h-[560px] items-center justify-center text-center p-8">
          <h2 className="text-2xl font-serif mb-3">Something went wrong.</h2>
          <p className="text-sm text-red-600 mb-6 max-w-sm">{previewError ?? "Please try again."}</p>
          <Link href="/" className="text-sm text-neutral-600 underline underline-offset-4">
            ← Back to topics
          </Link>
        </div>
      </main>
    );
  }

  // Phase 2+ — card carousel
  return (
    <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col justify-center">
      {/* Back nav */}
      <div className="flex items-center justify-between mb-3">
        <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 transition">
          ← Home
        </Link>
        <Link href="/profile" className="text-xs text-neutral-400 hover:text-neutral-600 transition">
          All results
        </Link>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-0 mb-6">
        {Array.from({ length: TOTAL_SLIDES }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setSlideIndex(i); setDragX(0); }}
            className="flex items-center justify-center w-7 h-7"
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`block h-2 rounded-full transition-all duration-300 ${
              i === slideIndex
                ? "bg-neutral-900 w-5"
                : "bg-neutral-300 w-2"
            }`} />
          </button>
        ))}
      </div>

      {/* Card container */}
      <div
        className="relative min-h-[520px] sm:min-h-[560px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[520px] sm:min-h-[560px]"
          style={{
            transform: `translateX(${isDragging ? dragX : 0}px)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* ═══ CARD 0: Your Position + What Shaped It ═══ */}
          {slideIndex === 0 && (
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                Your position on {topicLabel}
              </div>
              {userInsight ? (
                <>
                  <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-2">
                    {userInsight.archetype_label}
                  </h2>
                  <p className="text-[15px] leading-relaxed text-neutral-500 mb-4">
                    {userInsight.archetype_description}
                  </p>

                  {/* How you think */}
                  <div className="border-t border-neutral-100 pt-4 mt-auto">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">
                      How you think
                    </div>
                    {userInsight.reasons.map((r, i) => (
                      <div key={i} className={`py-2.5 ${i < userInsight.reasons.length - 1 ? "border-b border-neutral-100" : ""}`}>
                        <p className="text-[13px] text-neutral-500 leading-relaxed">{r.what_it_means}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : initialProfileSummary ? (
                <p className="text-[15px] leading-relaxed text-neutral-500">{initialProfileSummary}</p>
              ) : null}
            </div>
          )}

          {/* ═══ CARD 1: In Practice ═══ */}
          {slideIndex === 1 && userInsight && (
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                {topicLabel}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-2">
                In practice
              </h2>
              <p className="text-[15px] leading-relaxed text-neutral-500 mb-5">
                What your position actually looks like in the real world.
              </p>

              {userInsight.real_world_examples.map((ex, i) => (
                <div key={i} className={`py-3 ${i < userInsight.real_world_examples.length - 1 ? "border-b border-neutral-100" : ""}`}>
                  <p className="text-[13px] font-medium text-neutral-900 leading-snug mb-1">{ex.title}</p>
                  <p className="text-xs text-neutral-400 leading-relaxed">{ex.description}</p>
                </div>
              ))}

              <div className="mt-auto" />
            </div>
          )}

          {/* ═══ CARD 2: Core Tension ═══ */}
          {slideIndex === 2 && userInsight && (
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                {topicLabel}
              </div>
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-2">
                Your core tension
              </h2>
              <p className="text-[15px] leading-relaxed text-neutral-500 mb-6">
                The contradiction at the heart of your position.
              </p>

              <div className="rounded-xl bg-neutral-100 p-5">
                <div className="flex items-stretch gap-3 mb-4">
                  <div className="flex-1 rounded-lg bg-red-50 border border-red-100 p-4 flex items-center justify-center text-center">
                    <p className="text-[13px] font-medium text-neutral-800 leading-snug">
                      {userInsight.tension.claim_a}
                    </p>
                  </div>
                  <div className="flex items-center text-[10px] uppercase tracking-widest text-neutral-400 shrink-0">vs</div>
                  <div className="flex-1 rounded-lg bg-blue-50 border border-blue-100 p-4 flex items-center justify-center text-center">
                    <p className="text-[13px] font-medium text-neutral-800 leading-snug">
                      {userInsight.tension.claim_b}
                    </p>
                  </div>
                </div>
                {userInsight.tension.explanation && (
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    {userInsight.tension.explanation}
                  </p>
                )}
              </div>

              <div className="mt-auto" />
            </div>
          )}

          {/* ═══ CARDS 3-5: Spotlight Thinker Flip Cards ═══ */}
          {slideIndex >= 3 && slideIndex <= 5 && (() => {
            const spotlightIdx = slideIndex - 3;
            const thinkerType = SPOTLIGHT_TYPES[spotlightIdx];
            const meta = getRelationship(thinkerType);
            const card = cards[thinkerType];
            const isFlipped = flippedCards.has(thinkerType);

            if (!meta) return null;

            return isFlipped && card ? (
              /* Face up — revealed */
              <div className={`p-6 sm:p-8 flex flex-col flex-1 ${meta.faceUpBg}`}>
                <div className="mb-4">
                  <span className={`inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border font-medium ${meta.faceUpTag}`}>
                    {meta.label}
                  </span>
                </div>
                <div className="flex flex-col items-center text-center mb-5">
                  {card.thumbnail_url ? (
                    <Image
                      src={card.thumbnail_url}
                      alt={card.name}
                      width={88}
                      height={88}
                      className="rounded-full object-cover w-[88px] h-[88px] mb-3 shadow-md"
                    />
                  ) : (
                    <div className="w-[88px] h-[88px] rounded-full bg-neutral-200 flex items-center justify-center text-2xl font-medium text-neutral-500 mb-3 shadow-md">
                      {card.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug">
                    {card.name}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5 italic">{card.tagline}</p>
                </div>
                {(() => {
                  // Split match_reason into user belief vs thinker belief
                  const reason = card.match_reason?.trim();

                  // If no real match_reason, show the oneLine as a centered description
                  if (!reason) {
                    return (
                      <div className="flex-1 flex items-center justify-center">
                        <p className="text-[15px] leading-relaxed text-neutral-500 text-center">
                          {meta.oneLine}
                        </p>
                      </div>
                    );
                  }

                  // Split on sentence boundaries: .!? (optionally followed by quote) + space + capital
                  const sentenceBreak = /(?<=[.!?]['"'""']?\s)(?=[A-Z])/g;
                  const sentences = reason.split(sentenceBreak).filter(Boolean);

                  // Thinker name parts for matching (e.g. "Wacquant", "DJ Jaffe" → "Jaffe")
                  const nameParts = card.name.split(/\s+/);
                  const lastName = nameParts[nameParts.length - 1];

                  // Separate: sentences about the user vs sentences about the thinker
                  const userSentences: string[] = [];
                  const thinkerSentences: string[] = [];
                  for (const s of sentences) {
                    const isUserSentence = /^(You |You'|Your )/i.test(s);
                    const mentionsThinker = s.includes(card.name) || s.includes(lastName);
                    // If it starts with "You" BUT also mentions the thinker, it's a bridge — put in thinker
                    if (isUserSentence && !mentionsThinker) {
                      userSentences.push(s.trim());
                    } else {
                      thinkerSentences.push(s.trim());
                    }
                  }

                  // If all sentences landed in one bucket (e.g. one long paragraph),
                  // try splitting on the thinker's name as a pivot
                  if (sentences.length <= 1 || (userSentences.length > 0 && thinkerSentences.length === 0)) {
                    const nameIdx = reason.indexOf(lastName + "'s");
                    const altIdx = nameIdx === -1 ? reason.indexOf(lastName) : nameIdx;
                    if (altIdx > 20) {
                      // Find the nearest sentence-like break before the name
                      const beforeName = reason.slice(0, altIdx);
                      // Look for last comma, em-dash, or period before the name
                      const breakMatch = beforeName.match(/^([\s\S]*[,;—–])\s*/);
                      if (breakMatch) {
                        return (
                          <div className="space-y-3">
                            <p className="text-[14px] leading-relaxed text-neutral-400">
                              {breakMatch[1].replace(/[,;—–]\s*$/, ".")}
                            </p>
                            <p className="text-[14px] leading-relaxed text-neutral-900">
                              {reason.slice(breakMatch[0].length).replace(/^\s*/, "").replace(/^which is /i, "That's ").replace(/^that is /i, "That's ")}
                            </p>
                          </div>
                        );
                      }
                    }
                  }

                  const userPart = userSentences.join(" ");
                  const thinkerPart = thinkerSentences.join(" ");

                  return (
                    <div className="space-y-3">
                      {userPart && (
                        <p className="text-[14px] leading-relaxed text-neutral-400">
                          {userPart}
                        </p>
                      )}
                      {thinkerPart && (
                        <p className="text-[14px] leading-relaxed text-neutral-900">
                          {thinkerPart}
                        </p>
                      )}
                      {!userPart && !thinkerPart && (
                        <p className="text-[14px] leading-relaxed text-neutral-900">
                          {reason}
                        </p>
                      )}
                    </div>
                  );
                })()}
                <div className="mt-auto pt-5">
                  <Link
                    href={`/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${thinkerType}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-white/60 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    See full profile →
                  </Link>
                </div>
              </div>
            ) : (
              /* Face down — tap to flip */
              <button
                type="button"
                onClick={() => {
                  setFlippedCards((prev) => {
                    const next = new Set(prev);
                    next.add(thinkerType);
                    return next;
                  });
                }}
                className={`flex-1 flex flex-col items-center justify-center text-center p-8 cursor-pointer ${meta.faceGradient} ${meta.textOnFace}`}
              >
                <div className="text-7xl sm:text-8xl mb-6 opacity-80">{meta.emoji}</div>
                <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug mb-3 opacity-90">
                  {meta.label}
                </h2>
                <p className="text-base sm:text-lg opacity-60 leading-snug mb-8">
                  {meta.oneLine}
                </p>
                <p className="text-sm opacity-50">Tap to reveal</p>
              </button>
            );
          })()}

          {/* ═══ CARD 7: Remaining Thinkers ═══ */}
          {slideIndex === 7 && (
            <div className="p-6 sm:p-8 flex flex-col flex-1">
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-1">
                Your full constellation
              </h2>
              <p className="text-[15px] leading-relaxed text-neutral-500 mb-5">
                {remainingThinkerTypes.length} more thinkers in your intellectual map.
              </p>

              {remainingThinkerTypes.map((key, i) => {
                const meta = getRelationship(key);
                const card = cards[key];
                if (!meta || !card) return null;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      if (detailLoading.has(key)) {
                        setPendingModal(key);
                      } else {
                        setModalType(key);
                      }
                    }}
                    className={`flex items-center gap-3 py-3 text-left w-full ${i < remainingThinkerTypes.length - 1 ? "border-b border-neutral-100" : ""}`}
                  >
                    {card.thumbnail_url ? (
                      <Image
                        src={card.thumbnail_url}
                        alt={card.name}
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-9 h-9 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500 shrink-0">
                        {card.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-neutral-900 leading-snug">{card.name}</p>
                      <p className="text-xs text-neutral-400 truncate">{meta.label} — {meta.oneLine}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-neutral-300">
                      <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                );
              })}

              <div className="mt-auto" />
            </div>
          )}

          {/* ═══ CARD 8: Position Map + Share ═══ */}
          {slideIndex === 8 && (
            <div className="px-3 pt-5 pb-4 sm:px-4 flex flex-col flex-1">
              <div className="px-3 sm:px-4">
                <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
                  Where you stand
                </div>
                <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-2">
                  Your position map
                </h2>
              </div>

              {positionMap ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 min-h-[200px]">
                    <PositionMap
                      data={positionMap}
                      topicLabel={topicLabel}
                      thumbnails={
                        Object.fromEntries(
                          Object.values(cards)
                            .filter((c): c is PartialCard => !!c?.thumbnail_url && !!c?.name)
                            .map((c) => [c.name, c.thumbnail_url!])
                        )
                      }
                      compact
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
                  <p className="text-sm text-neutral-500">Building your position map...</p>
                </div>
              )}

              <div className="flex flex-col items-center gap-2 pt-4 mt-auto">
                <button
                  type="button"
                  onClick={handleShare}
                  disabled={shareStatus === "sharing"}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60"
                >
                  {shareStatus === "sharing" && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {shareStatus === "copied" ? "Link copied!" :
                   shareStatus === "error" ? "Try again" :
                   shareStatus === "sharing" ? "Preparing..." :
                   "Share your stance"}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  {shareStatus === "downloaded" ? "Saved!" : "Save as image"}
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
                >
                  Take another quiz
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Side navigation arrows */}
      <button
        type="button"
        onClick={goPrev}
        disabled={slideIndex === 0}
        className="hidden sm:flex fixed left-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-0 disabled:cursor-default z-10"
        aria-label="Previous card"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        disabled={slideIndex === TOTAL_SLIDES - 1}
        className="hidden sm:flex fixed right-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-0 disabled:cursor-default z-10"
        aria-label="Next card"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {modalType && (
        <ThinkerModal
          type={modalType}
          card={cards[modalType] ?? { name: "", tagline: "" }}
          sessionId={sessionId}
          hasPrev={modalIndex > 0}
          hasNext={modalIndex < orderedKeys.length - 1}
          onPrev={() => {
            if (modalIndex > 0) setModalType(orderedKeys[modalIndex - 1]);
          }}
          onNext={() => {
            if (modalIndex < orderedKeys.length - 1) setModalType(orderedKeys[modalIndex + 1]);
          }}
          onClose={() => setModalType(null)}
        />
      )}
    </main>
  );
}
