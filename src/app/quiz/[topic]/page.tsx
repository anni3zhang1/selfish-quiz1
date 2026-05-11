import { notFound } from "next/navigation";
import { getQuiz } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";
import QuizRunner from "./QuizRunner";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const quiz = getQuiz(topic);
  if (!quiz) notFound();

  // User may or may not be registered — QuizRunner handles both cases.
  // If registered, we pass their info so we can skip the post-quiz form.
  const user = await getServerUser();

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-12">
      <QuizRunner quiz={quiz} user={user} />
    </main>
  );
}
