import { notFound, redirect } from "next/navigation";
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

  const user = await getServerUser();
  if (!user) redirect("/start");

  return (
    <main className="mx-auto w-full max-w-[480px] px-6 py-12 min-h-[calc(100vh-3rem)]">
      <QuizRunner quiz={quiz} user={user} />
    </main>
  );
}
