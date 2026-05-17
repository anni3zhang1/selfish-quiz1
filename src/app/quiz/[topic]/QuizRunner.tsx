"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AnswerEntry, AnyQuestion, Question } from "@/lib/types";
import type { aiGovernanceQuiz } from "@/lib/quizzes/ai-governance";

type Quiz = typeof aiGovernanceQuiz;
type User = { email: string; name: string } | null;

type Phase = "questions" | "submitting" | "error";

function isFreeformOnly(q: AnyQuestion): q is Extract<AnyQuestion, { freeformOnly: true }> {
  return "freeformOnly" in q && q.freeformOnly === true;
}

/** Split a long question string into context paragraph(s) + final question line.
 *  If the text contains \n\n, those become paragraph breaks in the context.
 *  The last sentence (after splitting) is always the clickable question. */
function splitQuestionText(text: string): { contextParagraphs: string[]; question: string } {
  // Split on sentence endings followed by a space
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length <= 2) {
    return { contextParagraphs: [], question: text };
  }
  // Last sentence is the actual question
  const question = sentences[sentences.length - 1].trim();
  const contextRaw = sentences.slice(0, -1).join("").trim();
  // Split context on double-newlines into paragraphs
  const contextParagraphs = contextRaw
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { contextParagraphs, question };
}

export default function QuizRunner({ quiz, user }: { quiz: Quiz; user: User }) {
  const router = useRouter();

  const [remainingMain, setRemainingMain] = useState<AnyQuestion[]>(
    () => [...quiz.questions]
  );
  const [pendingFollowups, setPendingFollowups] = useState<AnyQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [freeformText, setFreeformText] = useState("");
  const [phase, setPhase] = useState<Phase>("questions");
  const [error, setError] = useState<string | null>(null);

  // Preview generation state
  const previewStartedRef = useRef(false);
  const [previewDone, setPreviewDone] = useState(false);
  const previewDataRef = useRef<unknown>(null);

  // Loading animation messages
  const STATUS_MESSAGES = [
    "Analyzing your positions...",
    "Mapping your intellectual landscape...",
    "Finding your thinkers...",
    "Your map is almost ready...",
  ];
  const [statusMsgIdx, setStatusMsgIdx] = useState(0);
  useEffect(() => {
    if (phase !== "submitting") return;
    const id = setInterval(() => {
      setStatusMsgIdx((i) => (i + 1) % STATUS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const current: AnyQuestion | null = useMemo(() => {
    if (pendingFollowups.length > 0) return pendingFollowups[0];
    if (remainingMain.length > 0) return remainingMain[0];
    return null;
  }, [pendingFollowups, remainingMain]);

  // Shuffle options once per question; stable across re-renders for the same question
  const shuffledOptions = useMemo(() => {
    if (!current || isFreeformOnly(current)) return [];
    const all = (current as Question).options;
    const pinned = all.filter((o) => o.freeform);
    const substantive = all.filter((o) => !o.freeform);
    for (let i = substantive.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [substantive[i], substantive[j]] = [substantive[j], substantive[i]];
    }
    return [...substantive, ...pinned];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  const totalMain = quiz.questions.length;
  const answeredMain = totalMain - remainingMain.length;
  const progressLabel = current
    ? isFreeformOnly(current) || !pendingFollowups.length
      ? `Question ${Math.min(answeredMain + 1, totalMain)} of ${totalMain}`
      : `Follow-up to question ${answeredMain}`
    : "";

  function resetDraft() {
    setOptionId(null);
    setFreeformText("");
  }

  // Preview generation — returns a promise so callers can await it
  const previewPromiseRef = useRef<Promise<void> | null>(null);

  function startPreviewGeneration(finalAnswers: AnswerEntry[]) {
    if (previewStartedRef.current) return;
    previewStartedRef.current = true;

    previewPromiseRef.current = fetch("/api/constellation/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: quiz.topic, answers: finalAnswers }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Preview failed (${res.status})`);
        const data = await res.json();
        previewDataRef.current = data;
        setPreviewDone(true);
      })
      .catch((err) => {
        console.error("Background preview failed:", err);
        // Not fatal — ResultsView will retry if needed
        setPreviewDone(true);
      });
  }

  // Shared: create session + cache preview + navigate to results
  async function createSessionAndNavigate(finalAnswers: AnswerEntry[], name: string, email: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000); // 90s timeout
    const sessionRes = await fetch("/api/constellation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: quiz.topic,
        answers: finalAnswers,
        name,
        email,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
    if (!sessionRes.ok) {
      const d = await sessionRes.json().catch(() => ({}));
      throw new Error(d.error ?? `Session creation failed (${sessionRes.status})`);
    }
    const { session_id } = (await sessionRes.json()) as { session_id: string };

    // If preview finished, cache it so ResultsView can pick it up
    if (previewDataRef.current) {
      try {
        sessionStorage.setItem(
          `selfish_preview_${session_id}`,
          JSON.stringify(previewDataRef.current)
        );
      } catch {
        // sessionStorage not available — ResultsView will regenerate
      }
    }

    router.push(`/results/${session_id}`);
  }

  // Returning user — wait for preview, then navigate (no form shown)
  async function submitForReturningUser(finalAnswers: AnswerEntry[]) {
    setPhase("submitting");
    try {
      // Wait for preview to finish so we can cache it for ResultsView
      if (previewPromiseRef.current) {
        await previewPromiseRef.current;
      }
      await createSessionAndNavigate(finalAnswers, user!.name, user!.email);
    } catch (err) {
      const msg = err instanceof DOMException && err.name === "AbortError"
        ? "Request timed out. Please try again."
        : err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
      setPhase("error");
    }
  }



  function handleNext() {
    if (!current) return;

    let entry: AnswerEntry;
    let followupToInsert: AnyQuestion | null = null;

    if (isFreeformOnly(current)) {
      if (!freeformText.trim()) return;
      entry = {
        question_id: current.id,
        question_text: current.text,
        freeform: freeformText.trim(),
      };
    } else {
      const q = current as Question;
      if (!optionId) return;
      const chosen = q.options.find((o) => o.id === optionId);
      if (!chosen) return;

      const annotation = freeformText.trim();
      entry = {
        question_id: q.id,
        question_text: q.text,
        option_id: chosen.id,
        option_text: chosen.text,
        freeform: annotation.length > 0 ? annotation : undefined,
      };

      const followup = q.followups?.[chosen.id];
      if (followup) {
        if (followup.type === "mc") {
          const next = quiz.followupQuestions[followup.question_id];
          if (next) followupToInsert = next;
        } else {
          followupToInsert = {
            id: `${q.id}_freeform`,
            topic: q.topic,
            text: followup.prompt,
            freeformOnly: true,
          };
        }
      }
    }

    const nextAnswers = [...answers, entry];

    let nextPending = pendingFollowups;
    let nextRemaining = remainingMain;
    if (pendingFollowups.length > 0) {
      nextPending = pendingFollowups.slice(1);
    } else {
      nextRemaining = remainingMain.slice(1);
    }
    if (followupToInsert) {
      nextPending = [followupToInsert, ...nextPending];
    }

    setAnswers(nextAnswers);
    setPendingFollowups(nextPending);
    setRemainingMain(nextRemaining);
    resetDraft();

    // All questions answered — user is always registered (signup gates access)
    if (nextPending.length === 0 && nextRemaining.length === 0) {
      startPreviewGeneration(nextAnswers);
      void submitForReturningUser(nextAnswers);
    }
  }

  // === Two-step view: "reading" (question text) → "answering" (options) ===
  const [viewStep, setViewStep] = useState<"reading" | "answering">("reading");

  // Reset to "reading" whenever the current question changes
  const prevQuestionId = useRef(current?.id);
  useEffect(() => {
    if (current && current.id !== prevQuestionId.current) {
      setViewStep("reading");
      prevQuestionId.current = current.id;
    }
  }, [current]);

  // For freeform-only questions, skip straight to answering
  useEffect(() => {
    if (current && isFreeformOnly(current)) {
      setViewStep("answering");
    }
  }, [current]);

  // Slide animation state
  const [slideDir, setSlideDir] = useState<"none" | "left" | "right">("none");

  function animateToAnswers() {
    setSlideDir("left");
    setTimeout(() => {
      setViewStep("answering");
      setSlideDir("right");
      setTimeout(() => setSlideDir("none"), 50);
    }, 200);
  }

  function animateToNextQuestion() {
    setSlideDir("left");
    setTimeout(() => {
      handleNext();
      // handleNext updates state → useEffect resets viewStep to "reading"
      setSlideDir("right");
      setTimeout(() => setSlideDir("none"), 50);
    }, 200);
  }

  // Swipe handler for both steps
  const swipeDragX = useRef(0);
  const swipeStartRef = useRef<{ x: number; time: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  function onSwipePointerDown(e: React.PointerEvent) {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA" || tag === "INPUT") return;
    swipeStartRef.current = { x: e.clientX, time: Date.now() };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function animateBackToQuestion() {
    setSlideDir("right");
    setTimeout(() => {
      setViewStep("reading");
      setSlideDir("left");
      setTimeout(() => setSlideDir("none"), 50);
    }, 200);
  }

  function onSwipePointerMove(e: React.PointerEvent) {
    if (!swipeStartRef.current || !isDragging) return;
    const dx = e.clientX - swipeStartRef.current.x;
    swipeDragX.current = dx;
    setDragX(dx);
  }

  function onSwipePointerUp() {
    if (!swipeStartRef.current) return;
    const threshold = 60;
    const dx = swipeDragX.current;

    if (dx < -threshold) {
      // Swipe left → forward
      if (viewStep === "reading" && current && !isFreeformOnly(current)) {
        animateToAnswers();
      } else if (viewStep === "answering" && canSubmit) {
        animateToNextQuestion();
      }
    } else if (dx > threshold) {
      // Swipe right → back to question
      if (viewStep === "answering") {
        animateBackToQuestion();
      }
    }

    swipeDragX.current = 0;
    setDragX(0);
    setIsDragging(false);
    swipeStartRef.current = null;
  }

  // === Render ===

  // Registration phase — form + loading animation
  if (phase === "submitting") {
    const NODE_COUNT = 7;
    const RADIUS = 42;
    const CENTER = 54;
    const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
      const angle = (i * 360) / NODE_COUNT - 90;
      const rad = (angle * Math.PI) / 180;
      return {
        x: CENTER + RADIUS * Math.cos(rad),
        y: CENTER + RADIUS * Math.sin(rad),
        delay: (i * 1.8) / NODE_COUNT,
      };
    });

    return (
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex-1 flex flex-col items-center justify-center text-center p-8">
        <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-4">
          {quiz.topicLabel}
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-center mb-2">
          Building Your Intellectual Map
        </h1>
        <p key={statusMsgIdx} className="text-sm text-neutral-500 mb-8 fade-in text-center">
          {STATUS_MESSAGES[statusMsgIdx]}
        </p>

        <div
          className="relative mb-10"
          style={{ width: CENTER * 2, height: CENTER * 2 }}
        >
          {nodes.map((n, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-neutral-400"
              style={{
                width: 8,
                height: 8,
                left: n.x - 4,
                top: n.y - 4,
                animation: `node-pulse 1.8s ease-in-out ${n.delay.toFixed(2)}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-serif mb-3">Something went wrong.</h2>
        <p className="text-sm text-red-600 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => {
            setPhase("submitting");
            setError(null);
            void submitForReturningUser(answers);
          }}
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!current) return null;

  const freeformOnly = isFreeformOnly(current);
  const showAnnotation = freeformOnly || optionId !== null;
  const canSubmit = freeformOnly
    ? freeformText.trim().length > 0
    : optionId !== null;
  const isLastQuestion = pendingFollowups.length === 0 && remainingMain.length === 1;

  const textareaKey = freeformOnly
    ? `freeform-${current.id}`
    : `annotation-${current.id}-${optionId ?? "none"}`;

  // Slide transform
  const slideTransform =
    slideDir === "left"
      ? "translateX(-110%)"
      : slideDir === "right"
      ? "translateX(110%)"
      : `translateX(${dragX}px)`;

  const slideTransition =
    isDragging || slideDir === "right"
      ? "none"
      : "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.2s ease";

  const slideOpacity = slideDir === "left" ? 0 : 1;

  // Arrow logic
  const canGoBack = viewStep === "answering";
  const canGoForward =
    viewStep === "reading"
      ? !freeformOnly
      : canSubmit;

  function handleForward() {
    if (viewStep === "reading") animateToAnswers();
    else if (canSubmit) animateToNextQuestion();
  }

  function handleBack() {
    if (canGoBack) animateBackToQuestion();
  }

  // Show stacking hint on mobile when there are more questions ahead
  const showStackHint = !isLastQuestion && viewStep === "reading";

  return (
    <div
      className="relative touch-pan-y select-none flex-1 flex flex-col"
      onPointerDown={onSwipePointerDown}
      onPointerMove={onSwipePointerMove}
      onPointerUp={onSwipePointerUp}
      onPointerCancel={onSwipePointerUp}
    >
      {/* Stacking ghost cards (mobile only) */}
      <div
        className={`sm:hidden absolute inset-x-0 top-0 bottom-0 rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm transition-all duration-300 ${
          showStackHint ? "opacity-60 translate-y-3 scale-[0.96]" : "opacity-0 translate-y-0 scale-100"
        }`}
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />
      <div
        className={`sm:hidden absolute inset-x-0 top-0 bottom-0 rounded-2xl border border-neutral-200 bg-neutral-100/50 shadow-sm transition-all duration-300 ${
          showStackHint ? "opacity-40 translate-y-[22px] scale-[0.92]" : "opacity-0 translate-y-0 scale-100"
        }`}
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Outer card */}
      <div className="relative z-10 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Progress header */}
        <div className="px-6 pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs uppercase tracking-wider text-neutral-400">
              {quiz.topicLabel}
            </div>
            <div className="text-xs tabular-nums text-neutral-400" aria-live="polite" aria-atomic="true">
              {progressLabel}
            </div>
          </div>
          <div className="h-0.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-neutral-900 transition-all duration-500"
              style={{
                width: `${Math.min(100, (answeredMain / totalMain) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Inner well */}
        <div className="mx-3 mb-3 rounded-xl bg-neutral-50 border border-neutral-100 flex-1 flex flex-col">
          {/* Side arrows — positioned outside the content column */}
          <button
            type="button"
            onClick={handleBack}
            disabled={!canGoBack}
            className="hidden sm:flex fixed left-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full text-neutral-300 hover:text-neutral-600 hover:bg-neutral-100 transition disabled:opacity-0 disabled:cursor-default z-10"
            aria-label="Go back"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            type="button"
            onClick={canGoForward ? handleForward : undefined}
            disabled={!canGoForward}
            className={`hidden sm:flex fixed right-[max(1rem,calc(50%-300px))] top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full hover:bg-neutral-100 transition z-10 ${
              canGoForward
                ? "text-neutral-900 hover:text-neutral-700"
                : "text-neutral-200 cursor-default"
            } ${isLastQuestion && viewStep === "answering" ? "!hidden" : ""}`}
            aria-label="Go forward"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Content area */}
          <div
            className="px-6 py-8 sm:py-10 flex-1 flex flex-col"
            style={{
              transform: slideTransform,
              transition: slideTransition,
              opacity: slideOpacity,
            }}
          >
            {/* === STEP 1: Read the question === */}
            {viewStep === "reading" && (() => {
              const { contextParagraphs, question } = splitQuestionText(current.text);
              return (
              <div className="flex flex-col justify-center min-h-[45vh]">
                {contextParagraphs.length > 0 ? (
                  <>
                    <div className="mb-8 space-y-4">
                      {contextParagraphs.map((para, i) => (
                        <p key={i} className="text-base sm:text-lg text-neutral-500 leading-relaxed">
                          {para}
                        </p>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={animateToAnswers}
                      className="group text-left"
                    >
                      <span className="text-lg sm:text-xl font-serif leading-snug text-neutral-900 underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-900 transition-colors">
                        {question}
                      </span>
                      <span className="inline-block ml-2 text-neutral-400 group-hover:text-neutral-900 transition-colors">→</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={animateToAnswers}
                    className="group text-left"
                  >
                    <span className="text-lg sm:text-xl font-serif leading-snug text-neutral-900 underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-900 transition-colors">
                      {current.text}
                    </span>
                    <span className="inline-block ml-2 text-neutral-400 group-hover:text-neutral-900 transition-colors">→</span>
                  </button>
                )}
              </div>
              );
            })()}

            {/* === STEP 2: Answer options === */}
            {viewStep === "answering" && (
              <div className={`w-full ${freeformOnly ? "flex-1 flex flex-col" : ""}`}>
                {/* Freeform-only question prompt */}
                {freeformOnly && (
                  <p className="text-base sm:text-lg font-serif leading-relaxed text-neutral-900 mb-4">
                    {current.text}
                  </p>
                )}

                {/* Answer options — centered */}
                {!freeformOnly && (
                  <div className="space-y-2.5 mb-4">
                    {shuffledOptions.map((opt, idx) => {
                      const selected = optionId === opt.id;
                      const displayLabel = String.fromCharCode(65 + idx);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            if (optionId !== opt.id) {
                              setOptionId(opt.id);
                              setFreeformText("");
                            }
                          }}
                          className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 ${
                            selected
                              ? "border-neutral-900 bg-neutral-900 text-white shadow-lg scale-[1.02]"
                              : "border-neutral-200 bg-white hover:border-neutral-400 active:scale-[0.98]"
                          }`}
                        >
                          <span className={`font-mono text-xs mr-3 ${selected ? "text-neutral-400" : "text-neutral-300"}`}>
                            {displayLabel}
                          </span>
                          <span className="text-[15px] leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Freeform / annotation textarea */}
                {showAnnotation && (
                  <div className={`annotation-slide-in mb-4 ${freeformOnly ? "flex-1 flex flex-col" : ""}`}>
                    <textarea
                      key={textareaKey}
                      value={freeformText}
                      onChange={(e) => setFreeformText(e.target.value)}
                      rows={freeformOnly ? undefined : 3}
                      placeholder={freeformOnly ? "Take your time…" : "Add context (optional)"}
                      className={`w-full px-4 py-3.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 transition placeholder:text-neutral-300 resize-none ${freeformOnly ? "flex-1" : ""}`}
                    />
                  </div>
                )}

                {/* Mobile "Next" CTA (non-last questions) */}
                {!isLastQuestion && canSubmit && (
                  <button
                    type="button"
                    onClick={animateToNextQuestion}
                    className="sm:hidden w-full px-6 py-3.5 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors annotation-slide-in"
                  >
                    Next →
                  </button>
                )}

                {/* "See where you stand" CTA on last question */}
                {isLastQuestion && (
                  <button
                    type="button"
                    onClick={canSubmit ? animateToNextQuestion : undefined}
                    disabled={!canSubmit}
                    className={`w-full px-6 py-3.5 rounded-xl text-sm font-medium transition-colors annotation-slide-in ${
                      canSubmit
                        ? "bg-neutral-900 text-white hover:bg-neutral-800"
                        : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                    }`}
                  >
                    See where you stand →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
