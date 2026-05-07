import Link from "next/link";
import { redirect } from "next/navigation";
import { topicCards } from "@/lib/quizzes";
import { getServerUser } from "@/lib/user";

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

function QuizCard({ card }: { card: TopicCard }) {
  const inner = (
    <div
      className={`group relative h-full overflow-hidden rounded-2xl border border-neutral-200 bg-white transition ${
        card.available
          ? "hover:-translate-y-1 hover:shadow-xl cursor-pointer"
          : "opacity-60"
      }`}
    >
      <div
        className={`h-32 w-full bg-gradient-to-br ${card.gradient}`}
        aria-hidden
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold tracking-tight">{card.name}</h2>
          <span
            className={`text-xs uppercase tracking-wider px-2 py-0.5 rounded ${
              card.available
                ? "bg-neutral-900 text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {card.available ? "Available" : "Soon"}
          </span>
        </div>
        <p className="text-sm text-neutral-700 mb-3">{card.description}</p>
        <p className="text-xs text-neutral-500 mb-5 italic">{card.intention}</p>
        <div
          className={`text-sm font-medium ${
            card.available
              ? "text-neutral-900 group-hover:underline"
              : "text-neutral-400"
          }`}
        >
          {card.available ? "Take the quiz →" : "Coming soon"}
        </div>
      </div>
    </div>
  );

  return card.available ? (
    <Link href={`/quiz/${card.slug}`} className="block h-full">
      {inner}
    </Link>
  ) : (
    <div className="block h-full">{inner}</div>
  );
}

export default async function Home() {
  const user = await getServerUser();
  if (!user) redirect("/start");

  // Build a lookup from slug → card for O(1) access
  const cardBySlug = new Map<string, TopicCard>(topicCards.map((c) => [c.slug, c]));

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-24">
      <header className="mb-16 max-w-3xl">
        <div className="text-xs uppercase tracking-wider text-neutral-500 mb-4">
          Hello, {user.name.split(" ")[0]}
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-tight">
          Tell us how you think and we&rsquo;ll show you who thinks like you&hellip;and who doesn&rsquo;t.
        </h1>
        <p className="mt-6 text-lg text-neutral-600">
          Take a quiz on any topic. Discover the 7 thinkers who map your mind.
        </p>
      </header>

      <div className="space-y-16">
        {CATEGORIES.map((cat) => {
          const catCards = [...cat.slugs]
            .map((slug) => cardBySlug.get(slug))
            .filter((c): c is TopicCard => c !== undefined);

          if (catCards.length === 0) return null;

          return (
            <section key={cat.label}>
              <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-neutral-800 mb-6">
                {cat.label}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catCards.map((card) => (
                  <QuizCard key={card.slug} card={card} />
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
