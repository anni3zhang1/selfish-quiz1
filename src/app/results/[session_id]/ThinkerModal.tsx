"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RelationshipType } from "@/lib/types";
import { getRelationship } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";

type PreviewCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  what_they_believe?: string;
  thumbnail_url?: string;
};

function truncateToSentences(text: string, maxSentences: number): string {
  const trimmed = text.trim();
  // Match sentence endings followed by whitespace
  const matches = [...trimmed.matchAll(/[.!?]+(?=\s|$)/g)];
  if (matches.length <= maxSentences) return trimmed;
  const cutoff = matches[maxSentences - 1];
  if (cutoff.index === undefined) return trimmed;
  const endIndex = cutoff.index + cutoff[0].length;
  return trimmed.slice(0, endIndex).trimEnd() + "…";
}

type Props = {
  type: RelationshipType;
  card: PreviewCard;
  sessionId: string;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
};

export default function ThinkerModal({
  type,
  card,
  sessionId,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
  onClose,
}: Props) {
  const meta = getRelationship(type);
  const panelRef = useRef<HTMLDivElement>(null);
  const prevOverflow = useRef("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && hasNext) onNext();
      else if (e.key === "Tab" && panelRef.current) {
        // Focus trap: keep Tab cycling within the modal
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    prevOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Auto-focus the close button on open
    panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow.current;
    };
  }, [hasPrev, hasNext, onPrev, onNext, onClose]);

  if (!meta) return null;

  const profileHref = card.name
    ? `/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${type}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${meta.label}: ${card.name}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />

      {/* Panel — card-style */}
      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className={`modal-panel relative w-[95vw] sm:w-[90vw] sm:max-w-[680px] max-h-[85vh] overflow-y-auto rounded-2xl flex flex-col shadow-2xl ${meta.faceGradient} ${meta.textOnFace}`}
      >
        {/* Header — type label + close */}
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 pb-2 shrink-0">
          <div className="text-2xl font-semibold tracking-tight opacity-90">
            {meta.label}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-3xl leading-none opacity-70 hover:opacity-100 w-11 h-11 flex items-center justify-center -mr-2 transition rounded-full"
          >
            ×
          </button>
        </div>

        {/* Body — photo/emoji, name, tagline, CTA */}
        <div className="px-6 sm:px-8 pt-4 pb-7 flex-1 flex flex-col">
          {card.thumbnail_url ? (
            <div className="flex items-center gap-5 mb-6">
              <Image
                src={card.thumbnail_url}
                alt={card.name}
                width={120}
                height={120}
                className="rounded-full object-cover w-[120px] h-[120px] ring-2 ring-white/40 shadow-md shrink-0"
              />
              <div className="text-4xl opacity-90">{meta.emoji}</div>
            </div>
          ) : (
            <div className="text-6xl mb-6 opacity-90">{meta.emoji}</div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
            {card.name}
          </h2>
          <p className="text-base sm:text-lg italic opacity-75 mb-6 leading-relaxed">
            {card.tagline}
          </p>

          {(card.what_they_believe || card.match_reason) && (
            <div className="mb-8 rounded-xl bg-white/10 px-5 py-4 sm:px-6 sm:py-5">
              <div className="text-[10px] uppercase tracking-widest font-semibold opacity-70 mb-2">
                {card.what_they_believe ? "What they believe" : "Why you’re matched"}
              </div>
              <p
                className="text-sm sm:text-base opacity-95"
                style={{ lineHeight: 1.6 }}
              >
                {card.what_they_believe ?? truncateToSentences(card.match_reason!, 3)}
              </p>
            </div>
          )}

          <div className="mt-auto">
            {profileHref && (
              <Link
                href={profileHref}
                className="block w-full text-center py-3.5 px-5 rounded-xl text-base font-semibold bg-white/20 hover:bg-white/30 text-white transition backdrop-blur-sm"
              >
                See full profile →
              </Link>
            )}
          </div>
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-3 shrink-0 text-sm border-t border-white/15">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="disabled:opacity-30 opacity-80 hover:opacity-100 transition"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="disabled:opacity-30 opacity-80 hover:opacity-100 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
