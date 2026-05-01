import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Constellation } from "@/lib/types";
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
    .select(
      "id, topic, profile_summary, constellation, status, email, name, email_sent, created_at"
    )
    .eq("id", session_id)
    .single();

  if (error || !data) notFound();

  if (data.status !== "complete" || !data.constellation) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h1 className="text-2xl font-serif mb-4">
          {data.status === "failed"
            ? "Something went wrong generating your constellation."
            : "Your constellation is still being built…"}
        </h1>
        {data.status === "failed" && (
          <Link
            href="/"
            className="inline-block mt-6 px-5 py-2 bg-neutral-900 text-white rounded-lg"
          >
            Try again
          </Link>
        )}
      </main>
    );
  }

  const quiz = getQuiz(data.topic);
  const topicLabel = quiz?.topicLabel ?? data.topic;

  return (
    <ResultsView
      sessionId={data.id}
      topicLabel={topicLabel}
      constellation={data.constellation as Constellation}
      userName={data.name ?? null}
      userEmail={data.email ?? null}
      emailAlreadySent={!!data.email_sent}
      createdAt={data.created_at}
    />
  );
}
