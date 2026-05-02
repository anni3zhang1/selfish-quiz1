"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { AnswerEntry, Constellation, ConstellationCard, RelationshipType } from "@/lib/types";
import { RELATIONSHIPS } from "@/lib/relationships";
import ThinkerModal from "./ThinkerModal";

type PartialCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  entry_point?: string;
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
        entry_point: c.entry_point ?? c.what_to_learn,
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
  const [profileSummary, setProfileSummary] = useState<string>(initialProfileSummary ?? "");
  const [cards, setCards] = useState<Cards>(() =>
    isPreloaded ? buildInitialCards(constellation) : {}
  );
  const [detailLoading, setDetailLoading] = useState<Set<RelationshipType>>(new Set());
  const [previewError, setPreviewError] = useState<string | null>(null);

  const [modalType, setModalType] = useState<RelationshipType | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "skipped" | "failed">(
    () => {
      if (emailAlreadySent) return "sent";
      if (!userEmail) return "skipped";
      return "idle";
    }
  );
  const emailTriggeredRef = useRef(false);
  const generationStartedRef = useRef(false);

  // Progressive loading — only fires for new (in_progress) sessions
  useEffect(() => {
    if (isPreloaded || generationStartedRef.current || !answers) return;
    generationStartedRef.current = true;

    async function runPreview() {
      try {
        const res = await fetch("/api/constellation/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic, answers }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({})) as { error?: string };
          throw new Error(d.error ?? `Preview failed (${res.status})`);
        }
        const data = await res.json() as {
          profile_summary: string;
          thinkers: { type: RelationshipType; name: string; tagline: string }[];
        };

        setProfileSummary(data.profile_summary);
        const initial: Cards = {};
        for (const t of data.thinkers) {
          initial[t.type] = { name: t.name, tagline: t.tagline };
        }
        setCards(initial);
        setPhase("detail");

        // Fire all 7 detail calls in parallel
        const loadingSet = new Set(data.thinkers.map((t) => t.type));
        setDetailLoading(loadingSet);

        const detailResults: Partial<Record<RelationshipType, { match_reason: string; entry_point: string }>> = {};
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
              const detail = await dres.json() as { type: RelationshipType; match_reason: string; entry_point: string };
              detailResults[t.type] = {
                match_reason: detail.match_reason,
                entry_point: detail.entry_point,
              };
              setCards((prev) => ({
                ...prev,
                [t.type]: {
                  ...prev[t.type]!,
                  match_reason: detail.match_reason,
                  entry_point: detail.entry_point,
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
            entry_point: detail?.entry_point,
          };
        }

        // Save to DB
        await fetch("/api/constellation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            profile_summary: data.profile_summary,
            constellation: fullConstellation,
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

  // Modal keyboard close
  useEffect(() => {
    if (!modalType) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalType(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalType]);

  const orderedKeys = RELATIONSHIPS.map((r) => r.key);
  const modalIndex = modalType ? orderedKeys.indexOf(modalType) : -1;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
          Your {topicLabel} Constellation
        </div>

        {profileSummary ? (
          <h1 className="text-3xl sm:text-4xl font-serif leading-snug mb-6">
            {profileSummary}
          </h1>
        ) : phase === "preview" ? (
          <div className="mb-6 flex items-center gap-3 text-neutral-500">
            <span className="inline-block w-4 h-4 border-2 border-neutral-400 border-t-neutral-700 rounded-full animate-spin" />
            <span className="text-base">Mapping your constellation...</span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setShowGuide((v) => !v)}
          className="text-sm text-neutral-600 underline underline-offset-4"
        >
          {showGuide ? "Hide" : "How to read"} your constellation
        </button>

        {showGuide && (
          <ul className="mt-5 space-y-2 text-sm text-neutral-700">
            {RELATIONSHIPS.map((r) => (
              <li key={r.key}>
                <span className="mr-2">{r.emoji}</span>
                <span className="font-semibold">{r.label}</span>
                <span className="text-neutral-500"> — {r.oneLine}</span>
              </li>
            ))}
          </ul>
        )}
      </header>

      {phase === "error" && (
        <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Could not generate your constellation.</strong>{" "}
          {previewError ?? "Please try again."}
        </div>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RELATIONSHIPS.map((r) => {
          const card = cards[r.key];
          const isDetailLoading = detailLoading.has(r.key);
          const hasName = !!card?.name;

          return (
            <button
              key={r.key}
              type="button"
              onClick={() => {
                if (hasName) setModalType(r.key);
              }}
              aria-label={hasName ? `View ${card.name}` : r.label}
              className={`aspect-[3/4] w-full rounded-2xl relative overflow-hidden text-left transition-all ${
                hasName
                  ? "cursor-pointer hover:scale-[1.02] hover:shadow-lg"
                  : "cursor-default"
              } ${r.faceGradient} ${r.textOnFace}`}
            >
              {/* Type label */}
              <div className="absolute top-5 left-5 right-5">
                <div className="text-[10px] uppercase tracking-widest opacity-70 font-semibold mb-1">
                  {r.label}
                </div>
              </div>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
                {!hasName ? (
                  <>
                    <div className="text-3xl mb-3 opacity-60">{r.emoji}</div>
                    <div className="text-xs opacity-60 max-w-[16ch] leading-relaxed">
                      {r.oneLine}
                    </div>
                    {phase === "preview" && (
                      <div className="mt-4 w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-xl font-semibold leading-tight mb-2 tracking-tight">
                      {card.name}
                    </div>
                    <div className="text-xs opacity-75 italic leading-relaxed line-clamp-3">
                      {card.tagline}
                    </div>
                    {isDetailLoading && (
                      <div className="mt-3 w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin opacity-40" />
                    )}
                  </>
                )}
              </div>

              {/* Bottom hint */}
              {hasName && (
                <div className="absolute bottom-5 left-0 right-0 text-center text-[10px] uppercase tracking-widest opacity-50">
                  Click to explore →
                </div>
              )}
            </button>
          );
        })}
      </section>

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
            View all your constellations →
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
          Bookmark this page — your constellation lives at this URL.
        </div>
      </footer>

      {/* Thinker modal */}
      {modalType && cards[modalType] && (
        <ThinkerModal
          type={modalType}
          card={cards[modalType]!}
          isDetailLoading={detailLoading.has(modalType)}
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
