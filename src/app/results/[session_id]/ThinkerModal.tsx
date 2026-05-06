"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { RelationshipType } from "@/lib/types";
import { getRelationship } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";

type PreviewCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  thumbnail_url?: string;
  what_they_believe?: string;
};

function beliefSnippet(whatTheyBelieve: string | undefined, tagline: string, maxChars = 180): string {
  const source = whatTheyBelieve ?? tagline;
  const m = source.match(/[^.!?]*[.!?]/);
  const sentence = m ? m[0].trim() : source.trim();
  if (sentence.length <= maxChars) return sentence;
  return sentence.slice(0, maxChars).trimEnd() + "…";
}

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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onPrev();
      else if (e.key === "ArrowRight" && hasNext) onNext();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
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
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" aria-hidden />

      {/* Panel — card-style */}
      <div
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
            className="text-3xl leading-none opacity-70 hover:opacity-100 px-1 -mr-1 transition"
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
          <p className="text-sm sm:text-base opacity-95 mb-8 leading-relaxed">
            {beliefSnippet(card.what_they_believe, card.tagline)}
          </p>

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
