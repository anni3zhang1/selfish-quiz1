import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/quizzes";
import QuizRunner from "./QuizRunner";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const quiz = getQuiz(topic);
  if (!quiz) notFound();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <QuizRunner quiz={quiz} />
    </main>
  );
}
