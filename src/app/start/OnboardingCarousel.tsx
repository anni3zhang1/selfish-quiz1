"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";
import { SubmitButton } from "./SubmitButton";
import { submitIdentity } from "./actions";

type Slide = {
  gradient: string;
  title?: string;
  heading: string;
  subheading: string;
};

const SLIDES: Slide[] = [
  {
    gradient: "from-amber-200 via-orange-200 to-rose-300",
    title: "Stance",
    heading: "Know where you stand",
    subheading: "On the topics that shape the world.",
  },
  {
    gradient: "from-violet-300 via-indigo-300 to-blue-400",
    heading: "Quizzes that reveal how you actually think",
    subheading:
      "See the real arguments on every side and where you land among them.",
  },
  {
    gradient: "from-emerald-200 via-teal-300 to-cyan-400",
    heading: "Meet thinkers who think like you",
    subheading: "And the ones who challenge everything you believe.",
  },
  {
    gradient: "from-rose-300 via-pink-300 to-fuchsia-400",
    heading: "A personal trainer for your mind",
    subheading: "Don't let the algorithm do your thinking for you.",
  },
];

// Topic tags — first 12 are "above the fold", rest are expandable
const TOPIC_TAGS: { label: string; slug: string }[] = [
  { label: "Taiwan", slug: "taiwan" },
  { label: "Gaza", slug: "gaza_israel" },
  { label: "Democracy", slug: "democracy" },
  { label: "AI", slug: "ai_governance" },
  { label: "Capitalism", slug: "capitalism" },
  { label: "Climate", slug: "climate" },
  { label: "Consciousness", slug: "consciousness" },
  { label: "Bioethics", slug: "bioethics" },
  { label: "Nuclear", slug: "nuclear_deterrence" },
  { label: "Surveillance", slug: "surveillance_privacy" },
  { label: "Immigration", slug: "immigration" },
  { label: "Media", slug: "truth_media" },
  // below the fold
  { label: "Education", slug: "education" },
  { label: "Gentrification", slug: "gentrification" },
  { label: "Space", slug: "space_colonization" },
  { label: "Meaning", slug: "meaning_crisis" },
  { label: "Mortality", slug: "end_of_life" },
  { label: "Longevity", slug: "longevity" },
  { label: "Reparations", slug: "reparations" },
  { label: "Homelessness", slug: "homelessness" },
  { label: "Guns", slug: "gun_rights" },
  { label: "Trans", slug: "trans_rights" },
  { label: "Drugs", slug: "drug_policy" },
  { label: "Diplomacy", slug: "us_foreign_policy" },
  { label: "Disruption", slug: "economic_disruption" },
  { label: "Animals", slug: "animal_rights" },
];

const MAX_TOPICS = 7;

interface OnboardingCarouselProps {
  error: string | undefined;
}

export default function OnboardingCarousel({ error }: OnboardingCarouselProps) {
  const [index, setIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<Set<string>>(new Set());
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);

  // Shuffle the first 12 topics once on mount
  const shuffledAboveFold = useMemo(() => {
    const above = TOPIC_TAGS.slice(0, 12);
    for (let i = above.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [above[i], above[j]] = [above[j], above[i]];
    }
    return above;
  }, []);

  const belowFold = TOPIC_TAGS.slice(12);
  const visibleTopics = showAllTopics ? [...shuffledAboveFold, ...belowFold] : shuffledAboveFold;

  function toggleTopic(slug: string) {
    setSelectedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else if (next.size < MAX_TOPICS) {
        next.add(slug);
      }
      return next;
    });
  }

  // Slide indices: 0-3 = content slides, 4 = topic selection, 5 = signup
  const TOPIC_SLIDE_INDEX = SLIDES.length;
  const SIGNUP_SLIDE_INDEX = SLIDES.length + 1;
  const totalSlides = SLIDES.length + 2; // +1 topic selection, +1 signup
  const isTopicSlide = index === TOPIC_SLIDE_INDEX;
  const isSignup = index === SIGNUP_SLIDE_INDEX;

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(i + 1, totalSlides - 1));
    setDragX(0);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(i - 1, 0));
    setDragX(0);
  }, []);

  // Pointer swipe
  function onPointerDown(e: React.PointerEvent) {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON") return;
    dragStartRef.current = { x: e.clientX, time: Date.now() };
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

  const canGoPrev = index > 0;
  const canGoNext = index < totalSlides - 1;

  return (
    <main className="relative mx-auto w-full max-w-[480px] px-6 py-6 sm:py-10 min-h-[calc(100vh-3rem)] flex flex-col justify-center">
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mb-6">
        {Array.from({ length: totalSlides }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => { setIndex(i); setDragX(0); }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === index
                ? "bg-neutral-900 w-6"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="relative min-h-[520px] sm:min-h-[560px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex flex-col min-h-[520px] sm:min-h-[560px]"
          style={{
            transform: `translateX(${isDragging ? dragX : 0}px)`,
            transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* === Content slides (0–3) === */}
          {index < SLIDES.length && (
            <>
              <div
                className={`h-44 sm:h-52 w-full bg-gradient-to-br ${SLIDES[index].gradient} transition-all duration-500`}
              />
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  {SLIDES[index].title && (
                    <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight mb-2">
                      {SLIDES[index].title}
                    </h1>
                  )}
                  <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-3">
                    {SLIDES[index].heading}
                  </h2>
                  {SLIDES[index].subheading && (
                    <p className="text-[15px] leading-relaxed text-neutral-500">
                      {SLIDES[index].subheading}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors self-start"
                >
                  {index === SLIDES.length - 1 ? "Get started" : "Next"} →
                </button>
              </div>
            </>
          )}

          {/* === Topic selection slide === */}
          {isTopicSlide && (
            <div className="p-6 sm:p-8 flex flex-col flex-1 overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-serif tracking-tight leading-snug mb-1">
                Pick the topics you care about
              </h2>
              <p className="text-sm text-neutral-500 mb-5">
                Select up to {MAX_TOPICS}.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {visibleTopics.map((t) => {
                  const selected = selectedTopics.has(t.slug);
                  const disabled = !selected && selectedTopics.size >= MAX_TOPICS;
                  return (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => toggleTopic(t.slug)}
                      disabled={disabled}
                      className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                        selected
                          ? "bg-neutral-900 text-white"
                          : disabled
                          ? "bg-neutral-100 text-neutral-300 cursor-not-allowed"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {!showAllTopics && (
                <button
                  type="button"
                  onClick={() => setShowAllTopics(true)}
                  className="text-sm text-neutral-500 hover:text-neutral-700 underline underline-offset-4 mb-4 self-start"
                >
                  Show more topics
                </button>
              )}

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  onClick={goNext}
                  disabled={selectedTopics.size === 0}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* === Signup slide === */}
          {isSignup && (
            <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug mb-2">
                  Start thinking
                </h2>
              </div>

              <form action={submitIdentity} className="space-y-4">
                <input type="hidden" name="selected_topics" value={JSON.stringify([...selectedTopics])} />
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Phone
                  </label>
                  <PhoneInput
                    value={phone}
                    onChange={(fullNumber, isValid) => {
                      setPhone(isValid ? fullNumber : "");
                    }}
                  />
                  <input type="hidden" name="phone" value={phone} />
                  <p className="text-xs text-neutral-400 mt-1.5">
                    We&rsquo;ll text you personalized content based on your results.
                  </p>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition placeholder:text-neutral-300"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition placeholder:text-neutral-300"
                    placeholder="you@example.com"
                  />
                </div>

                {error === "invalid" && (
                  <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
                    Please enter a valid name (2+ chars) and email.
                  </div>
                )}
                {error === "db" && (
                  <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
                    Couldn&rsquo;t save — try again in a moment.
                  </div>
                )}

                <div className="pt-1">
                  <SubmitButton />
                </div>
              </form>

              <div className="mt-6 text-center text-xs text-neutral-400">
                Already taken a quiz?{" "}
                <Link
                  href="/profile"
                  className="underline underline-offset-4 hover:text-neutral-600 transition-colors"
                >
                  View your profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
