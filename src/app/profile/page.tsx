import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/user";
import { topicCards } from "@/lib/quizzes";
import { RELATIONSHIPS } from "@/lib/relationships";
import type { Constellation } from "@/lib/types";
import { slugify } from "@/lib/thinkers";

export const dynamic = "force-dynamic";

type SessionRow = {
  id: string;
  topic: string;
  profile_summary: string | null;
  constellation: Constellation | null;
  status: string;
  created_at: string;
};

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email: rawEmail } = await searchParams;
  const email = rawEmail?.trim().toLowerCase();

  if (!email || !isValidEmail(email)) {
    return (
      <main className="mx-auto max-w-md px-6 py-20">
        <h1 className="text-3xl font-serif tracking-tight mb-3">
          See your profile
        </h1>
        <p className="text-neutral-600 mb-8">
          Enter the email you used. We&rsquo;ll show every constellation you&rsquo;ve made.
        </p>
        <form method="GET" className="space-y-5">
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium"
          >
            View profile
          </button>
        </form>
        <div className="mt-8 text-center text-xs text-neutral-500">
          New here?{" "}
          <Link href="/start" className="underline underline-offset-4">
            Start a quiz instead
          </Link>
        </div>
      </main>
    );
  }

  const [{ data: user }, { data: rawSessions }] = await Promise.all([
    supabase.from("users").select("name, email").eq("email", email).maybeSingle(),
    supabase
      .from("quiz_sessions")
      .select("id, topic, profile_summary, constellation, status, created_at")
      .eq("email", email)
      .eq("status", "complete")
      .order("created_at", { ascending: false }),
  ]);

  const sessions = (rawSessions ?? []) as SessionRow[];
  const greetingName = user?.name ?? email;

  const takenTopics = new Set(sessions.map((s) => s.topic));
  const unexplored = topicCards.filter(
    (t) => t.available && !takenTopics.has(t.slug)
  );
  const comingSoon = topicCards.filter((t) => !t.available);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-neutral-600 underline underline-offset-4"
        >
          ← Home
        </Link>
      </div>

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight mb-1">
          Your intellectual map, {greetingName}
        </h1>
        <p className="text-sm text-neutral-500">{email}</p>
      </header>

      {sessions.length === 0 ? (
        <section className="rounded-xl border border-neutral-200 bg-white p-8 text-center mb-12">
          <p className="text-neutral-600 mb-4">
            No constellations yet. Pick a topic to begin.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium"
          >
            Browse topics →
          </Link>
        </section>
      ) : (
        <section className="space-y-4 mb-12">
          {sessions.map((s) => {
            const topicMeta = topicCards.find((t) => t.slug === s.topic);
            const topicLabel = topicMeta?.name ?? s.topic;
            const date = new Date(s.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            return (
              <details
                key={s.id}
                className="group rounded-xl border border-neutral-200 bg-white overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <div>
                    <div className="text-lg font-semibold tracking-tight">
                      {topicLabel}
                    </div>
                    <div className="text-xs text-neutral-500">{date}</div>
                  </div>
                  <div className="text-xs text-neutral-400 group-open:hidden">
                    Expand ↓
                  </div>
                  <div className="text-xs text-neutral-400 hidden group-open:block">
                    Collapse ↑
                  </div>
                </summary>

                <div className="px-5 pb-5 border-t border-neutral-100">
                  {s.profile_summary && (
                    <p className="text-sm italic text-neutral-600 my-4">
                      {s.profile_summary}
                    </p>
                  )}
                  {s.constellation && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                      {RELATIONSHIPS.map((r) => {
                        const card = s.constellation?.[r.key];
                        if (!card?.name) return null;
                        return (
                          <Link
                            key={r.key}
                            href={`/thinker/${slugify(card.name)}?from=${s.id}&relationship=${r.key}`}
                            className={`block rounded-lg p-3 text-xs ${r.faceBg} text-white hover:opacity-90 transition`}
                          >
                            <div className="opacity-80 text-[10px] uppercase tracking-wider mb-1">
                              {r.emoji} {r.shortName}
                            </div>
                            <div className="font-semibold leading-tight">
                              {card.name}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                  <Link
                    href={`/results/${s.id}`}
                    className="text-xs underline underline-offset-4 text-neutral-700 hover:text-neutral-900"
                  >
                    Open full constellation →
                  </Link>
                </div>
              </details>
            );
          })}
        </section>
      )}

      {(unexplored.length > 0 || comingSoon.length > 0) && (
        <section>
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-4">
            Unexplored territory
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {unexplored.map((t) => (
              <Link
                key={t.slug}
                href={`/quiz/${t.slug}`}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 hover:bg-white hover:shadow-sm transition"
              >
                <div className="text-sm font-semibold mb-1">{t.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500">
                  Take the quiz →
                </div>
              </Link>
            ))}
            {comingSoon.map((t) => (
              <div
                key={t.slug}
                className="rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 opacity-60"
              >
                <div className="text-sm font-semibold mb-1">{t.name}</div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-400">
                  Coming soon
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
