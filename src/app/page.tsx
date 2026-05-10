import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { topicCards } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const CATEGORIES: { label: string; slugs: Set<string> }[] = [
  {
    label: "Current Events",
    slugs: new Set([
      "us_iran_war", // placeholder — quiz not yet published
      "taiwan",
      "gaza_israel",
      "us_foreign_policy",
      "economic_disruption",
      "immigration",
    ]),
  },
  {
    label: "Society & Ethics",
    slugs: new Set([
      "democracy",
      "trans_rights",
      "drug_policy",
      "reparations",
      "animal_rights",
      "gun_rights",
      "homelessness",
      "gentrification",
      "education",
    ]),
  },
  {
    label: "Big Ideas",
    slugs: new Set([
      "ai_governance",
      "capitalism",
      "nuclear_deterrence",
      "truth_media",
      "surveillance_privacy",
      "space_colonization",
    ]),
  },
  {
    label: "The Self & Existence",
    slugs: new Set([
      "meaning_crisis",
      "consciousness",
      "longevity",
      "bioethics",
      "end_of_life",
      "climate",
    ]),
  },
];

type TopicCard = (typeof topicCards)[number];

function QuizCard({ card, isComplete }: { card: TopicCard; isComplete: boolean }) {
  const inner = (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl border bg-white transition ${
        isComplete
          ? "border-neutral-200 opacity-55"
          : "border-neutral-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
      }`}
    >
      <div
        className={`h-32 w-full bg-gradient-to-br ${card.gradient}`}
        aria-hidden
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold tracking-tight">{card.name}</h2>
          {isComplete ? (
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
              Complete
            </span>
          ) : (
            <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-500">
              New
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-700 mb-3">{card.description}</p>
        <p className="text-xs text-neutral-500 mb-5 italic">{card.intention}</p>
        <div
          className={`text-sm font-medium ${
            isComplete
              ? "text-neutral-400"
              : "text-neutral-900 group-hover:underline"
          }`}
        >
          {isComplete ? "Retake the quiz →" : "Take the quiz →"}
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/quiz/${card.slug}`} className="block h-full">
      {inner}
    </Link>
  );
}

export default async function Home() {
  const user = await getServerUser();
  if (!user) redirect("/start");

  // Fetch completed topics for this user
  const { data: completedRows } = await supabase
    .from("quiz_sessions")
    .select("topic")
    .eq("email", user.email)
    .eq("status", "complete");

  const completedTopics = new Set<string>(
    (completedRows ?? []).map((r: { topic: string }) => r.topic)
  );

  // Build a lookup from slug → card for O(1) access
  const cardBySlug = new Map<string, TopicCard>(topicCards.map((c) => [c.slug, c]));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      {/* Canadian flag banner */}
      <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden mb-12 [mask-image:linear-gradient(to_bottom,black_60%,transparent_100%)]">
        <Image
          src="https://flagcdn.com/w1280/ca.png"
          alt="Canadian flag"
          fill
          className="object-cover"
          priority
        />
      </div>

      <header className="mb-16 max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
          Hello, {user.name.split(" ")[0]}
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug">
          Take a quiz on the ideas that matter. Discover where you stand, who thinks like you, who challenges you, and who you dismiss.
        </h1>
      </header>

      <div className="space-y-16">
        {CATEGORIES.map((cat) => {
          const catCards = [...cat.slugs]
            .map((slug) => cardBySlug.get(slug))
            .filter((c): c is TopicCard => c !== undefined)
            // Incomplete first, complete last
            .sort((a, b) =>
              (completedTopics.has(a.slug) ? 1 : 0) - (completedTopics.has(b.slug) ? 1 : 0)
            );

          if (catCards.length === 0) return null;

          return (
            <section key={cat.label}>
              <h2 className="text-xs uppercase tracking-widest font-normal text-neutral-400 mb-6">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catCards.map((card) => (
                  <QuizCard
                    key={card.slug}
                    card={card}
                    isComplete={completedTopics.has(card.slug)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <footer className="mt-20 text-xs text-neutral-400">
        Selfish — an early experiment in self-knowledge through encounter.
      </footer>
    </main>
  );
}
