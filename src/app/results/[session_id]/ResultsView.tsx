"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AnswerEntry, Constellation, ConstellationCard, RelationshipType, UserInsight } from "@/lib/types";
import { RELATIONSHIPS } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";
import ThinkerModal from "./ThinkerModal";


type PartialCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  what_they_believe?: string;
  thumbnail_url?: string;
};

type Cards = Partial<Record<RelationshipType, PartialCard>>;
type LoadPhase = "preview" | "detail" | "complete" | "error";

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
  // userInsight: populated from preview API (new sessions) or constellation.user_insight (returning sessions)
  const [userInsight, setUserInsight] = useState<UserInsight | null>(
    isPreloaded ? (constellation.user_insight ?? null) : null
  );
  const [cards, setCards] = useState<Cards>(() =>
    isPreloaded ? buildInitialCards(constellation) : {}
  );
  const [detailLoading, setDetailLoading] = useState<Set<RelationshipType>>(new Set());
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<RelationshipType | null>(null);
  // Card clicked while its detail was still in-flight — open modal once detail arrives
  const [pendingModal, setPendingModal] = useState<RelationshipType | null>(null);

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
  const cardsRef = useRef<HTMLDivElement>(null);

  // Progressive loading — only fires for new (in_progress) sessions
  useEffect(() => {
    if (isPreloaded || generationStartedRef.current || !answers) return;
    generationStartedRef.current = true;

    async function runPreview() {
      try {
        // Check if QuizRunner cached the preview data in sessionStorage
        let data: {
          user_insight: UserInsight;
          thinkers: { type: RelationshipType; name: string; tagline: string; match_reason?: string }[];
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

        // If no cached data, fetch from API as before
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
          initial[t.type] = {
            name: t.name,
            tagline: t.tagline,
            ...(t.match_reason ? { match_reason: t.match_reason } : {}),
          };
        }
        setCards(initial);
        setPhase("detail");

        // Fire all 7 enrichment calls in parallel (pass match_reason to skip AI)
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
                  ...(t.match_reason ? { match_reason: t.match_reason } : {}),
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

        // Save to DB — embed user_insight inside the constellation JSONB
        await fetch("/api/constellation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            constellation: { ...fullConstellation, user_insight: data.user_insight },
          }),
        }).catch((err) => console.error("Save failed:", err));

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

  // Email trigger for preloaded (already complete) sessions
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

  // Speculative pre-generation: once all 7 cards are ready, silently pre-fetch
  // thinker profiles so the session cache is warm before the user clicks.
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

  // When detail finishes loading for a pending card, open the modal fully populated
  useEffect(() => {
    if (!pendingModal) return;
    if (!detailLoading.has(pendingModal)) {
      setModalType(pendingModal);
      setPendingModal(null);
    }
  }, [pendingModal, detailLoading]);

  function handleCardClick(key: RelationshipType) {
    if (detailLoading.has(key)) {
      // Detail still in-flight — show spinner on card, open modal when ready
      setPendingModal(key);
    } else {
      setModalType(key);
    }
  }

  // Enable full-page scroll-snap while this view is mounted
  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollSnapType = "y mandatory";
    return () => {
      html.style.scrollSnapType = "";
    };
  }, []);

  const orderedKeys = RELATIONSHIPS.map((r) => r.key);
  const modalIndex = modalType ? orderedKeys.indexOf(modalType) : -1;

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
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight mb-10">
          Building Your {topicLabel} Intellectual Map
        </h1>
        <div
          className="relative mb-10"
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
      </main>
    );
  }

  // Phase 1 failed — preview call errored out
  if (phase === "error") {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-serif mb-3">Something went wrong.</h2>
        <p className="text-sm text-red-600 mb-6 max-w-sm">{previewError ?? "Please try again."}</p>
        <Link href="/" className="text-sm text-neutral-600 underline underline-offset-4">
          ← Back to topics
        </Link>
      </main>
    );
  }

  // Phase 2+ — insight section visible, thinker cards below
  return (
    <main className="w-full">

      {/* ── Snap section 1: Insight ─────────────────────────────────── */}
      <section
        className="min-h-screen [scroll-snap-align:start] relative flex flex-col px-6 pt-12 sm:pt-16"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="mx-auto w-full max-w-3xl flex-1">
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-tight mb-8">
          Your Position On {topicLabel}
        </h1>

        {userInsight ? (
          <div className="space-y-8">
            {/* Archetype */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-tight mb-2">
                {userInsight.archetype_label}
              </h2>
              <p className="text-base italic text-neutral-500">
                {userInsight.archetype_description}
              </p>
            </div>

            {/* Position */}
            <p className="text-base text-neutral-700 leading-relaxed">
              {userInsight.position}
            </p>

            {/* Why this matters — claim only, no secondary text */}
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-400 mb-4">
                Why this matters
              </div>
              <ul className="space-y-3">
                {userInsight.reasons.map((r, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-neutral-300 select-none shrink-0 mt-0.5">—</span>
                    <p className="text-sm font-medium text-neutral-800 leading-snug">
                      {r.claim}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tension — two-sided arrow layout matching thinker profile */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: "#fde68a" }}
            >
              <div className="px-5 pt-4 pb-1" style={{ backgroundColor: "#fef3c7" }}>
                <div
                  className="text-xs uppercase tracking-wider font-semibold mb-3"
                  style={{ color: "#92400e" }}
                >
                  Tension
                </div>
              </div>
              <div className="px-5 py-4" style={{ backgroundColor: "#fef3c7" }}>
                <div className="flex items-stretch gap-0 min-h-[6rem]">
                  {/* Left claim */}
                  <div
                    className="flex-1 flex items-center px-4 py-3 rounded-l-xl"
                    style={{ backgroundColor: "rgba(251,191,36,0.15)" }}
                  >
                    <p className="text-sm font-medium text-neutral-900 leading-snug text-left">
                      {userInsight.tension.claim_a}
                    </p>
                  </div>

                  {/* Center — double-headed arrow */}
                  <div className="flex flex-col items-center justify-center px-3 shrink-0 gap-1">
                    <div className="w-px flex-1 bg-amber-300" />
                    <svg width="36" height="20" viewBox="0 0 36 20" fill="none" aria-hidden className="shrink-0">
                      <line x1="6" y1="10" x2="30" y2="10" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                      <polyline points="12,4 6,10 12,16" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <polyline points="24,4 30,10 24,16" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                    <div className="w-px flex-1 bg-amber-300" />
                  </div>

                  {/* Right claim */}
                  <div
                    className="flex-1 flex items-center px-4 py-3 rounded-r-xl"
                    style={{ backgroundColor: "rgba(99,102,241,0.07)" }}
                  >
                    <p className="text-sm font-medium text-neutral-900 leading-snug text-right w-full">
                      {userInsight.tension.claim_b}
                    </p>
                  </div>
                </div>

                {userInsight.tension.explanation && (
                  <p className="mt-4 text-sm text-neutral-500 leading-relaxed italic">
                    {userInsight.tension.explanation}
                  </p>
                )}
              </div>
            </div>

            {/* In practice — horizontal scrollable card row */}
            <div>
              <div className="text-xs uppercase tracking-widest text-neutral-400 mb-3">
                In practice
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {userInsight.real_world_examples.map((ex, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-52 rounded-xl border border-neutral-200 bg-white p-4 flex flex-col"
                  >
                    <span className="text-sm font-semibold text-neutral-900 leading-snug mb-2">
                      {ex.title}
                    </span>
                    <p className="text-xs text-neutral-600 leading-relaxed">{ex.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : initialProfileSummary ? (
          /* Fallback for sessions predating the insight update */
          <p className="text-base text-neutral-700 leading-relaxed">{initialProfileSummary}</p>
        ) : null}

        </div>{/* end max-w-3xl flex-1 */}

        {/* Bounce chevron — clickable scroll cue */}
        <button
          type="button"
          aria-label="Scroll to your intellectual map"
          onClick={() => cardsRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="flex justify-center items-center w-full pt-4 pb-3 opacity-40 hover:opacity-70 cursor-pointer transition-opacity"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="animate-bounce text-neutral-500"
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </section>

      {/* ── Snap section 2: Thinker cards ───────────────────────────── */}
      <div
        ref={cardsRef}
        className="min-h-screen [scroll-snap-align:start] px-6 pt-12 sm:pt-16 pb-16"
        style={{ scrollSnapAlign: "start" }}
      >
        <div className="mx-auto w-full max-w-6xl">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-tight mb-2">
            Your Intellectual Map
          </h2>
          <p className="text-base text-neutral-600 leading-relaxed">
            The thinkers who share your logic, challenge your assumptions, and push where you&rsquo;re headed.
          </p>
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RELATIONSHIPS.map((r) => {
            const isPending = pendingModal === r.key;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => handleCardClick(r.key)}
                aria-label={r.label}
                className={`card-fade-in aspect-[3/4] w-full rounded-2xl relative overflow-hidden text-left cursor-pointer hover:shadow-lg transition-shadow ${r.faceGradient} ${r.textOnFace}`}
              >
                <div className="absolute top-5 left-5 right-5">
                  <div className="text-3xl font-semibold tracking-tight opacity-90 mb-1">
                    {r.label}
                  </div>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                  <div className="text-6xl mb-5 opacity-80">{r.emoji}</div>
                  <div className="text-lg opacity-80 max-w-[18ch] leading-relaxed">
                    {r.oneLine}
                  </div>
                </div>
                {isPending && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[2px] rounded-2xl">
                    <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </button>
            );
          })}
        </section>
        </div>{/* end max-w-6xl */}
      </div>{/* end snap section 2 */}

      {/* ── Non-snap: email status + footer ─────────────────────────── */}
      <div className="px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl">

      {userEmail && emailStatus !== "idle" && (
        <div className="mt-12 text-center text-sm text-neutral-500">
          {(emailStatus === "sent" || emailStatus === "sending") && (
            <div>
              ✓ Your results {emailStatus === "sending" ? "are being sent" : "were sent"} to{" "}
              <span className="font-medium text-neutral-700">{userEmail}</span>
            </div>
          )}
          {emailStatus === "skipped" && (
            <div className="text-neutral-400">
              (Email delivery isn&rsquo;t configured — results saved to your profile.)
            </div>
          )}
          {emailStatus === "failed" && (
            <div className="text-amber-600">
              We couldn&rsquo;t send the email, but your results are saved to your profile.
            </div>
          )}
          <Link
            href={`/profile?email=${encodeURIComponent(userEmail)}`}
            className="inline-block mt-3 underline underline-offset-4 text-neutral-700 hover:text-neutral-900"
          >
            View all your intellectual maps →
          </Link>
        </div>
      )}

      <footer className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Link
          href="/"
          className="text-sm text-neutral-600 underline underline-offset-4"
        >
          ← Explore another topic
        </Link>
        <div className="text-xs text-neutral-400">
          Bookmark this page — your intellectual map lives at this URL.
        </div>
      </footer>

      </div>{/* end max-w-6xl */}
      </div>{/* end non-snap wrapper */}

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
