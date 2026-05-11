"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { AnswerEntry, AnyQuestion, Question } from "@/lib/types";
import type { aiGovernanceQuiz } from "@/lib/quizzes/ai-governance";
import PhoneInput from "@/components/PhoneInput";

type Quiz = typeof aiGovernanceQuiz;
type User = { email: string; name: string } | null;

type Phase = "questions" | "registering" | "submitting" | "error";

function isFreeformOnly(q: AnyQuestion): q is Extract<AnyQuestion, { freeformOnly: true }> {
  return "freeformOnly" in q && q.freeformOnly === true;
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

  // Registration form fields
  const [formName, setFormName] = useState(user?.name ?? "");
  const [formEmail, setFormEmail] = useState(user?.email ?? "");
  const [formPhone, setFormPhone] = useState("");
  const [phoneValid, setPhoneValid] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Preview generation state (runs in parallel with registration form)
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
    if (phase !== "registering" && phase !== "submitting") return;
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

    const t0 = Date.now();
    console.log("[QuizRunner] preview fetch started");
    previewPromiseRef.current = fetch("/api/constellation/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: quiz.topic, answers: finalAnswers }),
    })
      .then(async (res) => {
        console.log(`[QuizRunner] preview fetch returned in ${Date.now() - t0}ms, status=${res.status}`);
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
    const sessionRes = await fetch("/api/constellation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: quiz.topic,
        answers: finalAnswers,
        name,
        email,
      }),
    });
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
    console.log("[QuizRunner] submitForReturningUser called, user:", user?.email);
    console.log("[QuizRunner] previewPromiseRef exists:", !!previewPromiseRef.current);
    setPhase("submitting");
    try {
      // Wait for preview to finish so we can cache it for ResultsView
      const t0 = Date.now();
      if (previewPromiseRef.current) {
        console.log("[QuizRunner] awaiting preview promise...");
        await previewPromiseRef.current;
        console.log(`[QuizRunner] preview promise resolved in ${Date.now() - t0}ms, cached data:`, !!previewDataRef.current);
      } else {
        console.log("[QuizRunner] no preview promise to await!");
      }
      console.log("[QuizRunner] creating session...");
      await createSessionAndNavigate(finalAnswers, user!.name, user!.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setPhase("error");
    }
  }

  // New user — validate form, register, then create session
  async function submitWithRegistration(finalAnswers: AnswerEntry[]) {
    setFormError(null);
    setPhase("submitting");

    const name = formName.trim();
    const email = formEmail.trim().toLowerCase();
    const phone = formPhone;

    if (name.length < 2) {
      setFormError("Please enter your name (2+ characters).");
      setPhase("registering");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFormError("Please enter a valid email address.");
      setPhase("registering");
      return;
    }
    if (!phoneValid) {
      setFormError("Please enter a complete phone number.");
      setPhase("registering");
      return;
    }

    try {
      // 1. Register user (upsert + set cookies)
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      if (!regRes.ok) {
        const d = await regRes.json().catch(() => ({}));
        throw new Error(d.error ?? "Registration failed");
      }

      // 2. Create session + navigate
      await createSessionAndNavigate(finalAnswers, name, email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
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

    // All questions answered
    if (nextPending.length === 0 && nextRemaining.length === 0) {
      console.log("[QuizRunner] all questions done. user:", user ? user.email : "null (new user)");
      if (user) {
        // Already registered — skip form, go straight to results
        startPreviewGeneration(nextAnswers);
        void submitForReturningUser(nextAnswers);
      } else {
        // Show registration form, start generation in parallel
        startPreviewGeneration(nextAnswers);
        setPhase("registering");
      }
    }
  }

  // === Render ===

  // Registration phase — form + loading animation
  if (phase === "registering" || phase === "submitting") {
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

    const isSubmitting = phase === "submitting";

    return (
      <div className="py-12 sm:py-16 min-h-[70vh] flex flex-col items-center">
        {/* Loading animation */}
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight text-center mb-2">
          Building Your {quiz.topicLabel} Intellectual Map
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

        {/* Registration form — only for new users */}
        {!user && (
          <div className="w-full max-w-sm">
            <p className="text-sm text-neutral-600 text-center mb-6">
              While we map your thinkers, tell us where to save your results.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void submitWithRegistration(answers);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
                  placeholder="Your name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 disabled:opacity-50"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone
                </label>
                <PhoneInput
                  value={formPhone}
                  onChange={(full, valid) => {
                    setFormPhone(full);
                    setPhoneValid(valid);
                  }}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-neutral-400 mt-1.5">
                  We&rsquo;ll text you personalized reading recommendations.
                </p>
              </div>

              {formError && (
                <div className="text-sm text-red-600">{formError}</div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "See My Results"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-serif mb-3">Something went wrong.</h2>
        <p className="text-sm text-red-600 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => {
            setPhase("registering");
            setError(null);
          }}
          className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium"
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

  const textareaKey = freeformOnly
    ? `freeform-${current.id}`
    : `annotation-${current.id}-${optionId ?? "none"}`;

  return (
    <div>
      <div className="mb-8">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">
          {quiz.topicLabel} · {progressLabel}
        </div>
        <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all"
            style={{
              width: `${Math.min(100, (answeredMain / totalMain) * 100)}%`,
            }}
          />
        </div>
      </div>

      <h2 className="text-lg sm:text-xl font-serif leading-snug mb-8">
        {current.text}
      </h2>

      {!freeformOnly && (
        <div className="space-y-2 mb-6">
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
                className={`w-full text-left px-5 py-4 rounded-lg border transition ${
                  selected
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : "border-neutral-300 bg-white hover:border-neutral-500"
                }`}
              >
                <span className="font-mono text-xs mr-3 opacity-70">
                  {displayLabel}
                </span>
                {opt.text}
              </button>
            );
          })}
        </div>
      )}

      {showAnnotation && (
        <div className="annotation-slide-in mb-6">
          <textarea
            key={textareaKey}
            value={freeformText}
            onChange={(e) => setFreeformText(e.target.value)}
            rows={freeformOnly ? 4 : 3}
            placeholder={freeformOnly ? "Take your time…" : "add context (optional)"}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
        </div>
      )}

      {showAnnotation && (
        <button
          type="button"
          onClick={handleNext}
          disabled={!canSubmit}
          className="annotation-slide-in px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      )}
    </div>
  );
}
