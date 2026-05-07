"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { RELATIONSHIPS } from "@/lib/relationships";
import type { RelationshipType } from "@/lib/types";
import { slugify } from "@/lib/thinkers";

type PartialCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  what_they_believe?: string;
  thumbnail_url?: string;
};

type Cards = Partial<Record<RelationshipType, PartialCard>>;

// ── helpers ───────────────────────────────────────────────────────────────────

function nameToInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function nameToColor(name: string): string {
  const palette = [
    "#7C3AED", "#0D9488", "#B45309", "#B91C1C",
    "#1D4ED8", "#047857", "#9D174D", "#C2410C",
    "#5B21B6", "#0369A1",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (Math.imul(h, 31) + name.charCodeAt(i)) | 0;
  return palette[Math.abs(h) % palette.length];
}

function firstSentence(text: string, maxLen = 150): string {
  const m = text.match(/^[^.!?]*[.!?]/);
  const s = m ? m[0].trim() : text;
  return s.length > maxLen ? s.slice(0, maxLen).trimEnd() + "…" : s;
}

function stripThisIs(text: string): string {
  const stripped = text.replace(/^This is /, "");
  return stripped.charAt(0).toUpperCase() + stripped.slice(1);
}

// ── component ─────────────────────────────────────────────────────────────────

type Props = {
  topicLabel: string;
  profileSummary: string;
  cards: Cards;
  sessionId: string;
};

const DARK_BG = "linear-gradient(160deg, #0f172a 0%, #1e1b4b 60%, #0f172a 100%)";

export default function MobileCardView({
  topicLabel,
  profileSummary,
  cards,
  sessionId,
}: Props) {
  const [screen, setScreen] = useState<"insight" | "cards">("insight");
  const [cardIndex, setCardIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitDir, setExitDir] = useState<"left" | "right">("left");
  const touchStartX = useRef<number | null>(null);

  const orderedKeys = RELATIONSHIPS.map((r) => r.key);
  const total = orderedKeys.length;
  const isLastCard = cardIndex === total - 1;

  function advance() {
    if (isLastCard || isExiting) return;
    setExitDir("left");
    setIsExiting(true);
    setTimeout(() => {
      setCardIndex((i) => i + 1);
      setIsExiting(false);
    }, 290);
  }

  function goBack() {
    if (cardIndex === 0 || isExiting) return;
    setExitDir("right");
    setIsExiting(true);
    setTimeout(() => {
      setCardIndex((i) => i - 1);
      setIsExiting(false);
    }, 290);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 8) return; // ignore micro-movements
    if (delta < -50) advance();
    else if (delta > 50) goBack();
  }

  // ── Insight screen ──────────────────────────────────────────────────────────

  if (screen === "insight") {
    return (
      <div
        className="min-h-[100dvh] flex flex-col items-center justify-center px-8 text-center cursor-pointer select-none"
        style={{ background: DARK_BG }}
        onClick={() => setScreen("cards")}
      >
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-6">
          Your {topicLabel} Intellectual Map
        </p>

        {profileSummary ? (
          <p className="text-white text-[1.4rem] font-serif leading-relaxed max-w-xs">
            {profileSummary}
          </p>
        ) : (
          <p className="text-white/50 text-xl font-serif">
            Your intellectual map is ready.
          </p>
        )}

        <p className="text-indigo-300/60 text-sm mt-12 tracking-wide animate-pulse">
          Tap to meet your thinkers →
        </p>
      </div>
    );
  }

  // ── Card stack ──────────────────────────────────────────────────────────────

  // Render up to 3 cards — front + 2 peeking behind
  const stackKeys = orderedKeys.slice(cardIndex, Math.min(cardIndex + 3, total));

  return (
    <div
      className="flex flex-col select-none"
      style={{ background: DARK_BG, minHeight: "100dvh" }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6 pb-3 shrink-0">
        <button
          type="button"
          onClick={goBack}
          disabled={cardIndex === 0}
          className="text-white/40 text-sm disabled:opacity-0 transition-opacity"
        >
          ← Back
        </button>
        <span className="text-white/30 text-xs tracking-widest tabular-nums">
          {cardIndex + 1} of {total}
        </span>
        {/* spacer mirrors the back button */}
        <div className="w-14" />
      </div>

      {/* Stack container — cards are absolutely positioned inside */}
      <div
        className="relative flex-1 mx-4 mb-6"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={advance}
        style={{ cursor: isLastCard ? "default" : "pointer" }}
      >
        {stackKeys.map((key, stackPos) => {
          const r = RELATIONSHIPS.find((rel) => rel.key === key)!;
          const card = cards[key];
          const isExitingCard = isExiting && stackPos === 0;

          // While the front card is exiting, the cards behind animate one step forward
          const effectivePos = isExiting && !isExitingCard
            ? stackPos - 1
            : stackPos;

          // Build transform
          let transform: string;
          if (isExitingCard) {
            transform =
              exitDir === "left"
                ? "translateX(-115%) rotate(-5deg)"
                : "translateX(115%) rotate(5deg)";
          } else {
            const yPx = Math.max(effectivePos, 0) * 11;
            const scale = 1 - Math.max(effectivePos, 0) * 0.03;
            transform = `translateY(${yPx}px) scale(${scale})`;
          }

          return (
            <div
              key={key}
              className={`absolute inset-0 rounded-2xl shadow-2xl overflow-hidden ${r.faceGradient} ${r.textOnFace}`}
              style={{
                transform,
                opacity: isExitingCard ? 0 : 1,
                zIndex: 30 - stackPos * 10,
                transition:
                  "transform 290ms cubic-bezier(.4,0,.2,1), opacity 220ms ease-in",
              }}
            >
              <div className="flex flex-col h-full px-6 pt-7 pb-6">

                {/* Relationship label + descriptor */}
                <div className="shrink-0 mb-5">
                  <div className="text-xs font-bold uppercase tracking-[0.16em] opacity-80 mb-1">
                    {r.label}
                  </div>
                  <p className="text-sm opacity-55 leading-snug">
                    {stripThisIs(r.oneLine)}
                  </p>
                </div>

                {/* Photo / initials */}
                <div className="flex justify-center mb-4 shrink-0">
                  {card?.thumbnail_url ? (
                    <Image
                      src={card.thumbnail_url}
                      alt={card.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover w-20 h-20 ring-2 ring-white/25 shadow-lg"
                    />
                  ) : card?.name ? (
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-semibold ring-2 ring-white/20 shadow-lg shrink-0"
                      style={{ backgroundColor: nameToColor(card.name) }}
                      aria-hidden
                    >
                      {nameToInitials(card.name)}
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/10" />
                  )}
                </div>

                {/* Thinker name */}
                <h2 className="text-center text-2xl font-serif font-bold leading-tight mb-3 shrink-0">
                  {card?.name ?? "—"}
                </h2>

                {/* What they believe (or tagline fallback) */}
                <div className="flex-1 flex items-start justify-center overflow-hidden">
                  {card?.what_they_believe ? (
                    <p className="text-sm text-center opacity-80 leading-relaxed line-clamp-4">
                      {firstSentence(card.what_they_believe, 150)}
                    </p>
                  ) : card?.tagline ? (
                    <p className="text-sm text-center opacity-55 italic leading-relaxed line-clamp-3">
                      {card.tagline}
                    </p>
                  ) : null}
                </div>

                {/* CTA — stop propagation so tapping it doesn't also advance */}
                <div
                  className="shrink-0 mt-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {card?.name && (
                    <Link
                      href={`/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${key}`}
                      className="block w-full text-center py-3 px-4 rounded-xl text-sm font-semibold bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-sm"
                    >
                      See full profile →
                    </Link>
                  )}
                  {!isLastCard && (
                    <p className="text-center text-[11px] opacity-25 mt-2 tracking-wide">
                      tap to continue
                    </p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
