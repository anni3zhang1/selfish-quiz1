"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AnswerEntry, AnyQuestion, Question } from "@/lib/types";
import type { aiGovernanceQuiz } from "@/lib/quizzes/ai-governance";

type Quiz = typeof aiGovernanceQuiz;
type User = { email: string; name: string };

type Phase = "questions" | "error";

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

  async function submitConstellation(finalAnswers: AnswerEntry[]) {
    setError(null);
    try {
      const res = await fetch("/api/constellation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: quiz.topic,
          answers: finalAnswers,
          name: user.name,
          email: user.email,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as { session_id: string };
      router.push(`/results/${data.session_id}`);
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

    if (nextPending.length === 0 && nextRemaining.length === 0) {
      void submitConstellation(nextAnswers);
    }
  }

  // === Render ===

  if (phase === "error") {
    return (
      <div className="py-20 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-serif mb-3">Something went wrong.</h2>
        <p className="text-sm text-red-600 mb-6">{error}</p>
        <button
          type="button"
          onClick={() => submitConstellation(answers)}
          className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-medium"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!current) return null;

  const freeformOnly = isFreeformOnly(current);
  // The annotation field is shown for freeform-only questions, and for any
  // multiple-choice question once an option has been selected.
  const showAnnotation = freeformOnly || optionId !== null;
  const canSubmit = freeformOnly
    ? freeformText.trim().length > 0
    : optionId !== null;

  // key forces remount of the textarea on option change → autoFocus fires again
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
                    setFreeformText(""); // changing selection clears the annotation
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
