"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";

type TopicCard = {
  slug: string;
  name: string;
  available: boolean;
  description: string;
  intention: string;
  gradient: string;
  tags?: readonly string[];
};

const CATEGORIES = [
  { label: "All", slugs: null, special: null },
  {
    label: "Current Events",
    special: null,
    slugs: new Set([
      "taiwan", "gaza_israel", "us_foreign_policy", "economic_disruption", "immigration",
    ]),
  },
  {
    label: "Society & Ethics",
    special: null,
    slugs: new Set([
      "democracy", "trans_rights", "drug_policy", "reparations", "animal_rights",
      "gun_rights", "homelessness", "gentrification", "education",
    ]),
  },
  {
    label: "Big Ideas",
    special: null,
    slugs: new Set([
      "ai_governance", "capitalism", "nuclear_deterrence", "truth_media",
      "surveillance_privacy", "space_colonization",
    ]),
  },
  {
    label: "The Self & Existence",
    special: null,
    slugs: new Set([
      "meaning_crisis", "consciousness", "longevity", "bioethics", "end_of_life", "climate",
    ]),
  },
  { label: "Completed", slugs: null, special: "completed" as const },
] as const;

/** Reverse lookup: slug → category label */
function getCategoryLabel(slug: string): string {
  for (const cat of CATEGORIES) {
    if (cat.slugs && cat.slugs.has(slug)) return cat.label;
  }
  return "";
}

interface HomeClientProps {
  cards: readonly TopicCard[];
  completedSlugs: string[];
  selectedTopics: string[];
  userName: string | null;
  userEmail: string | null;
}

export default function HomeClient({ cards, completedSlugs, selectedTopics, userName, userEmail }: HomeClientProps) {
  const completedSet = new Set(completedSlugs);
  const selectedSet = new Set(selectedTopics);
  const [activeCategory, setActiveCategory] = useState(0); // 0 = "All"
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Filter + sort cards by category
  // Sort priority: selected & incomplete first, then unselected incomplete, then completed
  const isCompletedTab = CATEGORIES[activeCategory].special === "completed";
  const filtered = useMemo(() => {
    const cat = CATEGORIES[activeCategory];
    if (cat.special === "completed") {
      return [...cards].filter((c) => completedSet.has(c.slug));
    }
    const pool = cat.slugs
      ? [...cards].filter((c) => cat.slugs!.has(c.slug))
      : [...cards];
    return pool.sort((a, b) => {
      const aComplete = completedSet.has(a.slug) ? 1 : 0;
      const bComplete = completedSet.has(b.slug) ? 1 : 0;
      if (aComplete !== bComplete) return aComplete - bComplete;
      // Among incomplete, selected topics first
      const aSelected = selectedSet.has(a.slug) ? 0 : 1;
      const bSelected = selectedSet.has(b.slug) ? 0 : 1;
      return aSelected - bSelected;
    });
  }, [activeCategory, cards, completedSet, selectedSet]);

  // Clamp index when filter changes
  const safeIndex = Math.min(index, filtered.length - 1);
  const current = filtered[safeIndex];

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, filtered.length - 1));
    setDragX(0);
  }, [filtered.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setDragX(0);
  }, []);

  function selectCategory(catIdx: number) {
    setActiveCategory(catIdx);
    setIndex(0);
    setDragX(0);
  }

  // Pointer swipe
  function onPointerDown(e: React.PointerEvent) {
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragStartRef.current || !isDragging) return;
    setDragX(e.clientX - dragStartRef.current.x);
  }

  function onPointerUp() {
    if (!dragStartRef.current) return;
    const threshold = 60;
    const velocity = Math.abs(dragX) / (Date.now() - dragStartRef.current.time + 1);
    if (Math.abs(dragX) > threshold || velocity > 0.4) {
      if (dragX < 0) goNext();
      else goPrev();
    }
    setDragX(0);
    setIsDragging(false);
    dragStartRef.current = null;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") { e.preventDefault(); goNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
  }

  const visibleCards = filtered.slice(safeIndex, safeIndex + 3);
  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < filtered.length - 1;

  if (!current) {
    return (
      <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col">
        <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => selectCategory(i)}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
                activeCategory === i
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-400 text-sm">
            {isCompletedTab
              ? "No completed quizzes yet. Go explore!"
              : "No quizzes in this category."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col">
      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.label}
            type="button"
            onClick={() => selectCategory(i)}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeCategory === i
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Card stack */}
      <div
        className="relative flex-1 min-h-[480px] sm:min-h-[520px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Quiz cards"
      >
        {visibleCards.map((card, stackIdx) => {
          const isTop = stackIdx === 0;
          const scale = 1 - stackIdx * 0.04;
          const yOffset = stackIdx * 12;
          const opacity = 1 - stackIdx * 0.15;
          const cardComplete = completedSet.has(card.slug);
          const category = getCategoryLabel(card.slug);

          const transform = isTop
            ? `translateX(${dragX}px) rotate(${dragX * 0.03}deg)`
            : `translateY(${yOffset}px) scale(${scale})`;

          return (
            <div
              key={card.slug}
              className={`absolute inset-0 rounded-2xl border border-neutral-200 bg-white overflow-hidden shadow-sm flex flex-col ${
                isTop ? "" : "pointer-events-none"
              }`}
              style={{
                transform,
                opacity: cardComplete ? Math.min(opacity, 0.5) : opacity,
                zIndex: 3 - stackIdx,
                transition: isDragging && isTop ? "none" : "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {/* Gradient banner */}
              <div className={`h-28 sm:h-36 w-full bg-gradient-to-br ${card.gradient}`} />

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  {/* Topic tags */}
                  {(card.tags && card.tags.length > 0) ? (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {card.tags.map((tag) => (
                        <span key={tag} className="inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-neutral-300 text-neutral-500">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : category ? (
                    <span className="inline-block text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-neutral-300 text-neutral-500 mb-3">
                      {category}
                    </span>
                  ) : null}

                  <div className="flex items-start justify-between mb-2">
                    <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-tight">
                      {card.name}
                    </h2>
                    {cardComplete && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap ml-3 mt-1">
                        Completed
                      </span>
                    )}
                  </div>

                  <p className="text-[15px] leading-relaxed text-neutral-600 mb-3">
                    {card.description}
                  </p>

                  <p className="text-xs leading-relaxed text-neutral-400 italic">
                    {card.intention}
                  </p>
                </div>

                {isTop && (
                  <div className="mt-6 flex items-center gap-3">
                    <Link
                      href={`/quiz/${card.slug}`}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
                        cardComplete
                          ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          : "bg-neutral-900 text-white hover:bg-neutral-800"
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {cardComplete ? "Retake" : "Begin"}
                    </Link>
                    {cardComplete && (
                      <Link
                        href={`/profile${userEmail ? `?email=${encodeURIComponent(userEmail)}` : ""}`}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Results
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side navigation arrows — fixed, outside content column on desktop */}
      <button
        type="button"
        onClick={goPrev}
        disabled={!canGoPrev}
        className="hidden sm:flex fixed left-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-0 disabled:cursor-default z-10"
        aria-label="Previous quiz"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        type="button"
        onClick={goNext}
        disabled={!canGoNext}
        className="hidden sm:flex fixed right-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-neutral-900 hover:text-neutral-700 hover:bg-neutral-100 transition disabled:opacity-0 disabled:cursor-default z-10"
        aria-label="Next quiz"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </main>
  );
}
