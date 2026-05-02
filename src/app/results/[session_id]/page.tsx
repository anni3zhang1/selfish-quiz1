import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AnswerEntry, Constellation } from "@/lib/types";
import { getQuiz } from "@/lib/quizzes";
import ResultsView from "./ResultsView";

export const dynamic = "force-dynamic";

export default async function ResultsPage({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  const { session_id } = await params;

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, topic, profile_summary, constellation, status, email, email_sent, answers")
    .eq("id", session_id)
    .single();

  if (error || !data) notFound();

  const quiz = getQuiz(data.topic);
  const topicLabel = quiz?.topicLabel ?? data.topic;

  const isComplete = data.status === "complete" && !!data.constellation;

  return (
    <ResultsView
      sessionId={data.id}
      topicLabel={topicLabel}
      topic={data.topic}
      profileSummary={data.profile_summary ?? null}
      constellation={isComplete ? (data.constellation as Constellation) : null}
      answers={!isComplete ? (data.answers as AnswerEntry[]) : null}
      userEmail={data.email ?? null}
      emailAlreadySent={!!data.email_sent}
    />
  );
}
