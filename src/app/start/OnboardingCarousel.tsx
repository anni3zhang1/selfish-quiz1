"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import PhoneInput from "@/components/PhoneInput";
import { SubmitButton } from "./SubmitButton";
import { submitIdentity } from "./actions";

type Slide = {
  gradient: string;
  heading: string;
  subheading: string;
};

const SLIDES: Slide[] = [
  {
    gradient: "from-amber-200 via-orange-200 to-rose-300",
    heading: "Be the most interesting person you'll meet",
    subheading: "",
  },
  {
    gradient: "from-violet-300 via-indigo-300 to-blue-400",
    heading: "A thinking partner in your DMs",
    subheading:
      "Feynman helps you find the ideas that were always yours — you just haven't met them yet.",
  },
  {
    gradient: "from-emerald-200 via-teal-300 to-cyan-400",
    heading: "Content that makes you feel smarter",
    subheading: "Your mind deserves better than the algorithm.",
  },
];

interface OnboardingCarouselProps {
  error: string | undefined;
}

export default function OnboardingCarousel({ error }: OnboardingCarouselProps) {
  const [index, setIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; time: number } | null>(null);

  const totalSlides = SLIDES.length + 1; // +1 for signup slide
  const isSignup = index === SLIDES.length;

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
          {!isSignup ? (
            <>
              {/* Gradient banner */}
              <div
                className={`h-44 sm:h-52 w-full bg-gradient-to-br ${SLIDES[index].gradient} transition-all duration-500`}
              />

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  {index === 0 && (
                    <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight mb-2">
                      Self<em>ish</em>
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
          ) : (
            /* Signup slide */
            <div className="p-6 sm:p-8 flex flex-col justify-center flex-1">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug mb-2">
                  Start thinking
                </h2>
                <p className="text-sm text-neutral-500">
                  Create your account to begin.
                </p>
              </div>

              <form action={submitIdentity} className="space-y-4">
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
