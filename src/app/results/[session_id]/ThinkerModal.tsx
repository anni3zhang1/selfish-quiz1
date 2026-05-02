"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { RelationshipType } from "@/lib/types";
import { getRelationship } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";

type PartialCard = {
  name: string;
  tagline: string;
  match_reason?: string;
  entry_point?: string;
};

type Props = {
  type: RelationshipType;
  card: PartialCard;
  isDetailLoading: boolean;
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
  isDetailLoading,
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

  const accentColor = meta.hex;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" aria-hidden />

      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-panel relative w-full sm:w-[75vw] sm:max-w-3xl sm:rounded-2xl bg-white sm:max-h-[80vh] max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-100 shrink-0">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${accentColor}22`, color: accentColor }}
          >
            <span>{meta.emoji}</span>
            <span>{meta.label}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-neutral-400 hover:text-neutral-800 px-2 transition"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-6 flex-1 [scrollbar-width:thin]">
          <h2 className="text-2xl font-bold leading-tight mb-1">
            {card.name}
          </h2>
          <p className="text-lg italic text-neutral-500 mb-5">{card.tagline}</p>

          <hr className="border-neutral-100 mb-5" />

          {/* Why you're matched */}
          <div className="mb-5">
            <div className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              Why you&rsquo;re matched
            </div>
            {isDetailLoading || !card.match_reason ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
                <div className="animate-pulse bg-gray-200 rounded h-4 w-4/5" />
              </div>
            ) : (
              <p
                className="text-sm text-neutral-800 leading-relaxed fade-in"
              >
                {card.match_reason}
              </p>
            )}
          </div>

          <hr className="border-neutral-100 mb-5" />

          {/* Start here */}
          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-neutral-400 mb-2">
              Start here
            </div>
            {isDetailLoading || !card.entry_point ? (
              <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 rounded h-4 w-full" />
                <div className="animate-pulse bg-gray-200 rounded h-4 w-3/5" />
              </div>
            ) : (
              <p
                className="text-sm font-semibold text-neutral-900 leading-relaxed fade-in"
              >
                {card.entry_point}
              </p>
            )}
          </div>

          {/* Full profile link */}
          <Link
            href={`/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${type}`}
            className="text-sm font-semibold underline underline-offset-4 hover:opacity-70 transition"
            style={{ color: accentColor }}
          >
            Explore full profile →
          </Link>
        </div>

        {/* Navigation footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-100 shrink-0 text-sm">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="disabled:opacity-30 text-neutral-600 hover:text-neutral-900 transition"
          >
            ← Previous
          </button>
          <span className="text-xs text-neutral-400 hidden sm:block">← / → to navigate</span>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="disabled:opacity-30 text-neutral-600 hover:text-neutral-900 transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
