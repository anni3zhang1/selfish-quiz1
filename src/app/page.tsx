import { topicCards } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";
import { supabase } from "@/lib/supabase";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getServerUser();

  let completedTopics: string[] = [];
  if (user) {
    const { data: completedRows } = await supabase
      .from("quiz_sessions")
      .select("topic")
      .eq("email", user.email)
      .eq("status", "complete");

    completedTopics = (completedRows ?? []).map((r: { topic: string }) => r.topic);
  }

  return (
    <HomeClient
      cards={topicCards}
      completedSlugs={completedTopics}
      userName={user?.name ?? null}
    />
  );
}
