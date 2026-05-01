"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Constellation } from "@/lib/types";
import { RELATIONSHIPS } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";

export default function ResultsView({
  sessionId,
  topicLabel,
  profileSummary,
  constellation,
  userEmail,
  emailAlreadySent,
}: {
  sessionId: string;
  topicLabel: string;
  profileSummary: string;
  constellation: Constellation;
  userEmail: string | null;
  emailAlreadySent: boolean;
}) {
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [showGuide, setShowGuide] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "skipped" | "failed">(
    () => (emailAlreadySent ? "sent" : userEmail ? "sending" : "skipped")
  );
  const triggeredRef = useRef(false);

  const toggle = (key: string) =>
    setFlipped((prev) => ({ ...prev, [key]: !prev[key] }));

  useEffect(() => {
    if (triggeredRef.current) return;
    if (emailAlreadySent || !userEmail) return;
    triggeredRef.current = true;
    fetch("/api/send-results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
        setEmailStatus(data.skipped ? "skipped" : "sent");
      })
      .catch((err) => {
        console.error("send-results trigger failed:", err);
        setEmailStatus("failed");
      });
  }, [sessionId, userEmail, emailAlreadySent]);

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">
      <header className="mb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-3">
          Your {topicLabel} Constellation
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif leading-snug mb-6">
          {profileSummary}
        </h1>

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

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RELATIONSHIPS.map((r) => {
          const card = constellation[r.key];
          const isFlipped = !!flipped[r.key];
          return (
            <div
              key={r.key}
              className={`flip-card aspect-[3/4] block w-full ${
                isFlipped ? "flipped" : ""
              }`}
            >
              <div className="flip-card-inner">
                {/* FRONT (face down) — click anywhere to reveal */}
                <button
                  type="button"
                  onClick={() => toggle(r.key)}
                  aria-label={`Reveal ${r.label}`}
                  className={`flip-face ${r.faceGradient} ${r.textOnFace} flex flex-col items-center justify-center p-6 cursor-pointer ${
                    isFlipped ? "" : "pulse-soft"
                  }`}
                >
                  <div className="text-4xl mb-3">{r.emoji}</div>
                  <div className="text-xl font-semibold mb-2 tracking-tight">
                    {r.label}
                  </div>
                  <div className="text-xs text-center opacity-80 mb-6 max-w-[14ch]">
                    {r.oneLine}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest opacity-60">
                    Click to reveal
                  </div>
                </button>

                {/* BACK (revealed) — scrollable, with explicit close button */}
                <div className="flip-face flip-face-back bg-white border border-neutral-200 overflow-y-auto p-5 [scrollbar-width:thin]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] uppercase tracking-widest text-neutral-400">
                      {r.emoji} {r.label}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(r.key)}
                      aria-label="Close"
                      className="text-neutral-400 hover:text-neutral-700 text-lg leading-none px-1"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-lg font-semibold leading-tight mb-1">
                    {card?.name}
                  </div>
                  <div className="text-xs italic text-neutral-600 mb-3">
                    {card?.tagline}
                  </div>
                  <div className="text-xs text-neutral-700 mb-2 leading-relaxed">
                    <span className="font-semibold">Why you: </span>
                    {card?.match_reason}
                  </div>
                  <div className="text-xs text-neutral-700 leading-relaxed mb-4">
                    <span className="font-semibold">What to look for: </span>
                    {card?.what_to_learn}
                  </div>
                  {card?.name && (
                    <Link
                      href={`/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${r.key}`}
                      className="inline-block text-xs font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
                    >
                      Read full profile →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {userEmail && (
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
    </main>
  );
}
