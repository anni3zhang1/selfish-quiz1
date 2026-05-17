import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getQuiz } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";
import QuizRunner from "./QuizRunner";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic } = await params;
  const quiz = getQuiz(topic);
  if (!quiz) return { title: "Quiz — Stance" };
  return {
    title: `${quiz.topicLabel} — Stance`,
    description: `Discover where you stand on ${quiz.topicLabel} and which thinkers align with your worldview.`,
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const quiz = getQuiz(topic);
  if (!quiz) notFound();

  const user = await getServerUser();
  if (!user) redirect("/start");

  return (
    <main className="relative mx-auto w-full max-w-[480px] px-6 pt-4 pb-6 sm:py-10 min-h-[calc(100dvh-3rem)] flex flex-col">
      <QuizRunner quiz={quiz} user={user} />
    </main>
  );
}
