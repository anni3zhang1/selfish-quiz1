import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AnswerEntry, Constellation, RelationshipType } from "@/lib/types";
import { getQuiz } from "@/lib/quizzes";
import { fetchWikipediaThumbnail } from "@/lib/wikipedia";
import ResultsView from "./ResultsView";

async function hydrateThumbnails(constellation: Constellation): Promise<Constellation> {
  const entries = Object.entries(constellation) as [RelationshipType, Constellation[RelationshipType]][];
  const missing = entries.filter(([, card]) => !card.thumbnail_url && card.name);
  if (missing.length === 0) return constellation;

  const fetched = await Promise.all(
    missing.map(async ([key, card]) => {
      const url = await fetchWikipediaThumbnail(card.name);
      return [key, url] as const;
    })
  );

  const updated = { ...constellation };
  for (const [key, url] of fetched) {
    if (url) updated[key] = { ...updated[key], thumbnail_url: url };
  }
  return updated;
}

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
  const rawConstellation = isComplete ? (data.constellation as Constellation) : null;
  const constellation = rawConstellation
    ? await hydrateThumbnails(rawConstellation)
    : null;

  return (
    <ResultsView
      sessionId={data.id}
      topicLabel={topicLabel}
      topic={data.topic}
      profileSummary={data.profile_summary ?? null}
      constellation={constellation}
      answers={!isComplete ? (data.answers as AnswerEntry[]) : null}
      userEmail={data.email ?? null}
      emailAlreadySent={!!data.email_sent}
    />
  );
}
