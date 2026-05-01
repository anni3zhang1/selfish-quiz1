"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Constellation, ConstellationCard, RelationshipType } from "@/lib/types";
import {
  RELATIONSHIPS,
  REVEAL_ORDER,
  SPATIAL_OFFSETS,
  SPATIAL_ROTATIONS,
  getRelationship,
} from "@/lib/relationships";
import ThinkerModal from "./ThinkerModal";

type Props = {
  sessionId: string;
  topicLabel: string;
  constellation: Constellation;
  userName: string | null;
  userEmail: string | null;
  emailAlreadySent: boolean;
  createdAt: string;
};

const CARD_W = 144;
const CARD_H = 200;
const USER_CARD_W = 168;
const USER_CARD_H = 224;
const SHADOW_RISE_MS = 600;

export default function ResultsView({
  sessionId,
  topicLabel,
  constellation,
  userName,
  userEmail,
  emailAlreadySent,
  createdAt,
}: Props) {
  const [revealed, setRevealed] = useState<Set<RelationshipType>>(new Set());
  const [modalType, setModalType] = useState<RelationshipType | null>(null);
  const [shadowRising, setShadowRising] = useState(false);

  const [emailStatus, setEmailStatus] = useState<"sending" | "sent" | "skipped" | "failed">(
    () => (emailAlreadySent ? "sent" : userEmail ? "sending" : "skipped")
  );
  const triggeredRef = useRef(false);

  // Fire send-results once on mount
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
      .catch(() => setEmailStatus("failed"));
  }, [sessionId, userEmail, emailAlreadySent]);

  const nextToReveal = useMemo(
    () => REVEAL_ORDER.find((t) => !revealed.has(t)) ?? null,
    [revealed]
  );

  const revealedTypesInOrder = useMemo(
    () => REVEAL_ORDER.filter((t) => revealed.has(t)),
    [revealed]
  );

  function reveal(type: RelationshipType) {
    setRevealed((prev) => {
      if (prev.has(type)) return prev;
      const next = new Set(prev);
      next.add(type);
      return next;
    });
  }

  function handleCardClick(type: RelationshipType) {
    if (revealed.has(type)) {
      setModalType(type);
      return;
    }
    if (type === "shadow") {
      // Trigger rise animation, then mark revealed
      setShadowRising(true);
      setTimeout(() => {
        reveal("shadow");
        setShadowRising(false);
      }, SHADOW_RISE_MS);
      return;
    }
    reveal(type);
  }

  // Modal navigation across revealed cards
  const modalIndex =
    modalType !== null ? revealedTypesInOrder.indexOf(modalType) : -1;
  const modalPrev =
    modalIndex > 0 ? () => setModalType(revealedTypesInOrder[modalIndex - 1]) : () => {};
  const modalNext =
    modalIndex >= 0 && modalIndex < revealedTypesInOrder.length - 1
      ? () => setModalType(revealedTypesInOrder[modalIndex + 1])
      : () => {};

  const dateLabel = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">
      <header className="mb-6 sm:mb-10 max-w-3xl">
        <div className="text-xs uppercase tracking-widest text-neutral-500 mb-2">
          Your {topicLabel} Constellation
        </div>
        <p className="text-sm text-neutral-500">
          Tap each card to reveal. Tap a revealed card to read more.
        </p>
      </header>

      {/* DESKTOP — spatial canvas */}
      <div className="hidden lg:block">
        <SpatialCanvas
          userName={userName}
          topicLabel={topicLabel}
          dateLabel={dateLabel}
          constellation={constellation}
          revealed={revealed}
          nextToReveal={nextToReveal}
          shadowRising={shadowRising}
          onCardClick={handleCardClick}
        />
      </div>

      {/* MOBILE — vertical stack in reveal order */}
      <div className="block lg:hidden">
        <StackedLayout
          userName={userName}
          topicLabel={topicLabel}
          dateLabel={dateLabel}
          constellation={constellation}
          revealed={revealed}
          nextToReveal={nextToReveal}
          shadowRising={shadowRising}
          onCardClick={handleCardClick}
        />
      </div>

      {/* Email + profile block */}
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
              We couldn&rsquo;t send the email, but your results are saved.
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

      {modalType && (
        <ThinkerModal
          type={modalType}
          card={constellation[modalType]}
          sessionId={sessionId}
          hasPrev={modalIndex > 0}
          hasNext={
            modalIndex >= 0 && modalIndex < revealedTypesInOrder.length - 1
          }
          onPrev={modalPrev}
          onNext={modalNext}
          onClose={() => setModalType(null)}
        />
      )}
    </main>
  );
}

// ============================================================================
// Spatial canvas (desktop)
// ============================================================================

type LayoutProps = {
  userName: string | null;
  topicLabel: string;
  dateLabel: string;
  constellation: Constellation;
  revealed: Set<RelationshipType>;
  nextToReveal: RelationshipType | null;
  shadowRising: boolean;
  onCardClick: (type: RelationshipType) => void;
};

function SpatialCanvas({
  userName,
  topicLabel,
  dateLabel,
  constellation,
  revealed,
  nextToReveal,
  shadowRising,
  onCardClick,
}: LayoutProps) {
  // Canvas dimensions to fit all offsets + card halves with padding
  const canvasW = 720;
  const canvasH = 920;
  const cx = canvasW / 2;
  const cy = canvasH / 2 + 80; // shift center down so integrated_self (-360) fits

  return (
    <div
      className="relative mx-auto"
      style={{ width: canvasW, height: canvasH }}
    >
      {/* Shadow card sits BENEATH user card (lower z-index until revealed) */}
      {(() => {
        const offset = SPATIAL_OFFSETS.shadow;
        const isRevealed = revealed.has("shadow");
        const card = constellation.shadow;
        return (
          <CardSlot
            key="shadow"
            type="shadow"
            x={cx + offset.x}
            y={cy + offset.y}
            rotation={SPATIAL_ROTATIONS.shadow}
            staggerIndex={REVEAL_ORDER.indexOf("shadow")}
            zIndex={isRevealed ? 5 : 1}
            isRevealed={isRevealed}
            isPulsing={nextToReveal === "shadow"}
            isShadowRising={shadowRising}
            card={card}
            onClick={() => onCardClick("shadow")}
          />
        );
      })()}

      {/* User card — center anchor */}
      <UserCard
        x={cx}
        y={cy}
        userName={userName}
        topicLabel={topicLabel}
        dateLabel={dateLabel}
      />

      {/* All other thinker cards */}
      {RELATIONSHIPS.filter((r) => r.key !== "shadow").map((r) => {
        const offset = SPATIAL_OFFSETS[r.key];
        const isRevealed = revealed.has(r.key);
        const card = constellation[r.key];
        return (
          <CardSlot
            key={r.key}
            type={r.key}
            x={cx + offset.x}
            y={cy + offset.y}
            rotation={SPATIAL_ROTATIONS[r.key]}
            staggerIndex={REVEAL_ORDER.indexOf(r.key)}
            zIndex={3}
            isRevealed={isRevealed}
            isPulsing={nextToReveal === r.key}
            isShadowRising={false}
            card={card}
            onClick={() => onCardClick(r.key)}
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// Stacked layout (mobile)
// ============================================================================

function StackedLayout({
  userName,
  topicLabel,
  dateLabel,
  constellation,
  revealed,
  nextToReveal,
  shadowRising,
  onCardClick,
}: LayoutProps) {
  return (
    <div className="flex flex-col items-center gap-5">
      <UserCard
        x={0}
        y={0}
        userName={userName}
        topicLabel={topicLabel}
        dateLabel={dateLabel}
        relativeStack
      />
      {REVEAL_ORDER.map((key, i) => {
        const isRevealed = revealed.has(key);
        const card = constellation[key];
        return (
          <CardSlot
            key={key}
            type={key}
            x={0}
            y={0}
            rotation={0}
            staggerIndex={i}
            zIndex={1}
            isRevealed={isRevealed}
            isPulsing={nextToReveal === key}
            isShadowRising={shadowRising}
            card={card}
            onClick={() => onCardClick(key)}
            relativeStack
          />
        );
      })}
    </div>
  );
}

// ============================================================================
// User card
// ============================================================================

function UserCard({
  x,
  y,
  userName,
  topicLabel,
  dateLabel,
  relativeStack,
}: {
  x: number;
  y: number;
  userName: string | null;
  topicLabel: string;
  dateLabel: string;
  relativeStack?: boolean;
}) {
  const positionStyle: React.CSSProperties = relativeStack
    ? { width: USER_CARD_W, height: USER_CARD_H }
    : {
        position: "absolute",
        left: x,
        top: y,
        width: USER_CARD_W,
        height: USER_CARD_H,
        transform: "translate(-50%, -50%)",
        zIndex: 4,
      };

  return (
    <div
      className="card-enter rounded-2xl bg-neutral-900 text-neutral-50 p-5 flex flex-col justify-between shadow-[0_8px_32px_rgba(0,0,0,0.18)] ring-1 ring-white/10"
      style={positionStyle}
    >
      <div>
        <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
          You
        </div>
        <div className="text-xl font-serif leading-tight">
          {userName ?? "Anonymous"}
        </div>
      </div>
      <div className="text-[10px] uppercase tracking-widest text-neutral-500 leading-tight">
        <div>{topicLabel}</div>
        <div className="opacity-70 mt-1">{dateLabel}</div>
      </div>
    </div>
  );
}

// ============================================================================
// Card slot — handles face-down, revealed, and shadow special states
// ============================================================================

type CardSlotProps = {
  type: RelationshipType;
  x: number;
  y: number;
  rotation: number;
  staggerIndex: number;
  zIndex: number;
  isRevealed: boolean;
  isPulsing: boolean;
  isShadowRising: boolean;
  card: ConstellationCard | undefined;
  onClick: () => void;
  relativeStack?: boolean;
};

function CardSlot({
  type,
  x,
  y,
  rotation,
  staggerIndex,
  zIndex,
  isRevealed,
  isPulsing,
  isShadowRising,
  card,
  onClick,
  relativeStack,
}: CardSlotProps) {
  const meta = getRelationship(type);
  if (!meta) return null;

  const positionStyle: React.CSSProperties = relativeStack
    ? { width: CARD_W, height: CARD_H }
    : {
        position: "absolute",
        left: x,
        top: y,
        width: CARD_W,
        height: CARD_H,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        zIndex,
      };

  // Shadow special — face-down state is a blurred silhouette, not a card.
  if (type === "shadow" && !isRevealed) {
    const stageClass = isShadowRising ? "shadow-shape rising" : "shadow-shape";
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Reveal Shadow"
        className="card-enter group block focus:outline-none"
        style={{
          ...positionStyle,
          animationDelay: `${staggerIndex * 150}ms`,
        }}
      >
        <div
          className={`relative w-full h-full rounded-2xl ${stageClass} ${
            isPulsing && !isShadowRising ? "pulse-reveal" : ""
          }`}
        />
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] uppercase tracking-widest text-neutral-500 italic">
          something in the shadow
        </div>
      </button>
    );
  }

  // Otherwise a normal flip card
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isRevealed ? `Open ${card?.name ?? meta.shortName}` : `Reveal ${meta.shortName}`}
      className={`flip-card card-enter block focus:outline-none ${isRevealed ? "flipped" : ""} ${
        isPulsing && !isRevealed ? "pulse-reveal rounded-2xl" : ""
      }`}
      style={{
        ...positionStyle,
        animationDelay: `${staggerIndex * 150}ms`,
      }}
    >
      <div className="flip-card-inner">
        {/* FRONT — face-down */}
        <div
          className={`flip-face ${meta.faceBg} text-white flex flex-col items-center justify-center text-center p-3 ${
            isRevealed ? "opacity-80" : ""
          }`}
        >
          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold leading-tight mb-2 opacity-90">
            {meta.label}
          </div>
          <div className="text-[11px] leading-snug px-1 italic opacity-90 max-w-[15ch]">
            {meta.oneLine}
          </div>
        </div>

        {/* BACK — revealed */}
        <div className="flip-face flip-face-back bg-white border border-neutral-200 p-3 flex flex-col">
          <div className="text-[9px] uppercase tracking-widest font-semibold mb-1" style={{ color: meta.hex }}>
            {meta.label}
          </div>
          <div className="text-sm font-serif font-semibold leading-tight mb-1">
            {card?.name ?? "—"}
          </div>
          {card?.tagline && (
            <div className="text-[10px] italic text-neutral-600 leading-snug mb-2">
              {card.tagline}
            </div>
          )}
          {card?.entry_point && (
            <div className="text-[10px] text-neutral-700 leading-snug mb-1">
              <span className="font-semibold">Start with: </span>
              {card.entry_point}
            </div>
          )}
          <div className="mt-auto pt-1 text-[9px] uppercase tracking-widest text-neutral-400">
            Tap for full
          </div>
        </div>
      </div>
    </button>
  );
}
