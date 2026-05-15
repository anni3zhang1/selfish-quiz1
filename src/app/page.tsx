import { redirect } from "next/navigation";
import { topicCards } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";
import { supabase } from "@/lib/supabase";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getServerUser();
  if (!user) redirect("/start");

  // Fetch completed topics and selected interests in parallel
  const [completedRes, userRow] = await Promise.all([
    supabase
      .from("quiz_sessions")
      .select("topic")
      .eq("email", user.email)
      .eq("status", "complete"),
    supabase
      .from("users")
      .select("selected_topics")
      .eq("email", user.email)
      .single(),
  ]);

  const completedTopics = (completedRes.data ?? []).map((r: { topic: string }) => r.topic);
  const selectedTopics: string[] = userRow.data?.selected_topics ?? [];

  return (
    <HomeClient
      cards={topicCards}
      completedSlugs={completedTopics}
      selectedTopics={selectedTopics}
      userName={user?.name ?? null}
    />
  );
}
