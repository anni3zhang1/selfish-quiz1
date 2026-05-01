"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { ConstellationCard, RelationshipType } from "@/lib/types";
import { getRelationship } from "@/lib/relationships";
import { slugify } from "@/lib/thinkers";

type Props = {
  type: RelationshipType;
  card: ConstellationCard;
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

  // Light tint of the type color as the backdrop wash
  const backdropTint = `${meta.hex}1A`; // 10% alpha hex

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center modal-backdrop"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" aria-hidden />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ backgroundColor: backdropTint }}
        className="relative w-full sm:max-w-2xl sm:rounded-2xl bg-white sm:bg-white/95 sm:my-8 sm:max-h-[88vh] flex flex-col modal-panel-mobile sm:modal-panel-desktop"
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-neutral-100">
          <div className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500">
            {meta.label} · <span className="text-neutral-400">{meta.oneLine}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-neutral-500 hover:text-neutral-900 px-2"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6 flex-1">
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight mb-2">
            {card.name}
          </h2>
          <p className="text-base italic text-neutral-600 mb-6">{card.tagline}</p>

          <div className="mb-6">
            <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">
              Why you
            </div>
            <p className="text-sm text-neutral-800 leading-relaxed">
              {card.match_reason}
            </p>
          </div>

          {card.brief_bio && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">
                Who they are
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {card.brief_bio}
              </p>
            </div>
          )}

          {card.what_to_learn && (
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-1">
                What to look for
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {card.what_to_learn}
              </p>
            </div>
          )}

          {card.entry_point && (
            <div
              className="mb-6 p-5 rounded-xl border"
              style={{
                borderColor: `${meta.hex}55`,
                backgroundColor: `${meta.hex}12`,
              }}
            >
              <div className="text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                Start with
              </div>
              <p className="text-sm font-medium text-neutral-900 leading-relaxed">
                {card.entry_point}
              </p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={`/thinker/${slugify(card.name)}?from=${sessionId}&relationship=${type}`}
              className="text-sm font-semibold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
            >
              Open full profile →
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-3 border-t border-neutral-100 text-sm">
          <button
            type="button"
            onClick={onPrev}
            disabled={!hasPrev}
            className="disabled:opacity-30 text-neutral-700 hover:text-neutral-900"
          >
            ← Previous
          </button>
          <span className="text-xs text-neutral-400">← / → to navigate</span>
          <button
            type="button"
            onClick={onNext}
            disabled={!hasNext}
            className="disabled:opacity-30 text-neutral-700 hover:text-neutral-900"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
