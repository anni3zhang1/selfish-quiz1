"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

type TopicCard = {
  slug: string;
  name: string;
  available: boolean;
  description: string;
  intention: string;
  gradient: string;
};

interface HomeClientProps {
  cards: readonly TopicCard[];
  completedSlugs: string[];
  userName: string | null;
}

export default function HomeClient({ cards, completedSlugs, userName }: HomeClientProps) {
  const completedSet = new Set(completedSlugs);

  // Sort: incomplete first, then completed
  const sorted = [...cards].sort(
    (a, b) => (completedSet.has(a.slug) ? 1 : 0) - (completedSet.has(b.slug) ? 1 : 0)
  );

  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = sorted[index];
  const isComplete = completedSet.has(current.slug);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, sorted.length - 1));
    setDragX(0);
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setDragX(0);
  }, []);

  // Pointer-based swipe handling
  function onPointerDown(e: React.PointerEvent) {
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragStartRef.current || !isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    setDragX(dx);
  }

  function onPointerUp() {
    if (!dragStartRef.current) return;
    const threshold = 60;
    const velocity = Math.abs(dragX) / (Date.now() - dragStartRef.current.time + 1);
    const shouldSwipe = Math.abs(dragX) > threshold || velocity > 0.4;

    if (shouldSwipe) {
      if (dragX < 0) goNext();
      else goPrev();
    }

    setDragX(0);
    setIsDragging(false);
    dragStartRef.current = null;
  }

  // Keyboard navigation
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      goPrev();
    }
  }

  // Cards visible: current + next 2 peeking behind
  const visibleCards = sorted.slice(index, index + 3);

  return (
    <main className="mx-auto w-full max-w-[480px] px-6 py-16 sm:py-24 min-h-[calc(100vh-3rem)]  flex flex-col">
      {/* Header */}
      <header className="mb-10">
        {userName && (
          <div className="text-xs uppercase tracking-wider text-neutral-400 mb-3">
            {userName.split(" ")[0]}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug text-neutral-800">
          Discover where you stand on the ideas that matter.
        </h1>
      </header>

      {/* Card stack */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-[400px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Quiz cards"
        aria-roledescription="carousel"
      >
        {visibleCards.map((card, stackIdx) => {
          const isTop = stackIdx === 0;
          const scale = 1 - stackIdx * 0.04;
          const yOffset = stackIdx * 12;
          const opacity = 1 - stackIdx * 0.15;
          const cardComplete = completedSet.has(card.slug);

          const transform = isTop
            ? `translateX(${dragX}px) rotate(${dragX * 0.03}deg)`
            : `translateY(${yOffset}px) scale(${scale})`;

          return (
            <div
              key={card.slug}
              className={`absolute inset-0 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm ${
                isTop ? "" : "pointer-events-none"
              }`}
              style={{
                transform,
                opacity,
                zIndex: 3 - stackIdx,
                transition: isDragging && isTop ? "none" : "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Gradient banner */}
              <div className={`h-36 sm:h-44 w-full bg-gradient-to-br ${card.gradient}`} />

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-3">
                  <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-tight">
                    {card.name}
                  </h2>
                  {cardComplete && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap ml-3 mt-1">
                      Completed
                    </span>
                  )}
                </div>

                <p className="text-[15px] leading-relaxed text-neutral-600 mb-4">
                  {card.description}
                </p>

                <p className="text-xs leading-relaxed text-neutral-400 italic mb-8">
                  {card.intention}
                </p>

                {isTop && (
                  <Link
                    href={`/quiz/${card.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {cardComplete ? "Retake" : "Begin"} →
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation dots + counter */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous quiz"
          >
            ←
          </button>
          <button
            onClick={goNext}
            disabled={index === sorted.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 text-neutral-400 hover:text-neutral-900 hover:border-neutral-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next quiz"
          >
            →
          </button>
        </div>

        <div className="text-xs text-neutral-400 tabular-nums">
          {index + 1} / {sorted.length}
          {completedSlugs.length > 0 && (
            <span className="ml-2 text-neutral-300">
              · {completedSlugs.length} completed
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 pt-6 border-t border-neutral-100">
        <p className="text-xs text-neutral-300 text-center">
          There are no right answers. Only yours.
        </p>
      </footer>
    </main>
  );
}
