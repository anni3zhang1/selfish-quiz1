import Link from "next/link";
import { notFound } from "next/navigation";
import { getThinker } from "@/lib/thinkers";
import { RELATIONSHIPS } from "@/lib/relationships";
import { supabase } from "@/lib/supabase";
import type { Constellation, RelationshipType } from "@/lib/types";

export const dynamic = "force-dynamic";

type SearchParams = {
  from?: string;
  relationship?: string;
};

function isRelationshipType(s: string | undefined): s is RelationshipType {
  return (
    !!s &&
    [
      "mirror",
      "twin",
      "complement",
      "precursor",
      "antagonist",
      "horizon",
      "shadow",
      "integrated_self",
    ].includes(s)
  );
}

export default async function ThinkerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const { from, relationship } = await searchParams;

  const profile = getThinker(id);
  if (!profile) notFound();

  // Optional personalization — only if from + relationship + valid session
  let matchReason: string | undefined;
  let whatToLearn: string | undefined;
  const relMeta = isRelationshipType(relationship)
    ? RELATIONSHIPS.find((r) => r.key === relationship)
    : undefined;

  if (from && isRelationshipType(relationship)) {
    const { data } = await supabase
      .from("quiz_sessions")
      .select("constellation, status")
      .eq("id", from)
      .single();
    if (data?.status === "complete" && data.constellation) {
      const constellation = data.constellation as Constellation;
      const card = constellation[relationship];
      if (card) {
        matchReason = card.match_reason;
        whatToLearn = card.what_to_learn;
      }
    }
  }

  const backHref = from ? `/results/${from}` : "/";

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href={backHref}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
        >
          ← {from ? "Back to your constellation" : "Back to home"}
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        {relMeta && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 ${relMeta.faceGradient} ${relMeta.textOnFace}`}
          >
            <span>{relMeta.emoji}</span>
            <span>{relMeta.label}</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-tight mb-3">
          {profile.name}
        </h1>
        <p className="text-lg italic text-neutral-600">{profile.tagline}</p>
      </header>

      {/* Why You — only if we have a personalized read */}
      {(matchReason || whatToLearn || profile.entry_point) && (matchReason || whatToLearn) && (
        <section className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="text-xs uppercase tracking-wider font-semibold text-amber-800 mb-3">
            Why You
          </div>
          {matchReason && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-neutral-700 mb-1">
                Why this thinker matches you
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {matchReason}
              </p>
            </div>
          )}
          {whatToLearn && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-neutral-700 mb-1">
                What to look for
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {whatToLearn}
              </p>
            </div>
          )}
          {profile.entry_point && (
            <div>
              <div className="text-xs font-semibold text-neutral-700 mb-1">
                Where to start
              </div>
              <p className="text-sm text-neutral-800 leading-relaxed">
                {profile.entry_point}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Who They Are */}
      <section className="mb-10">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">
          Who they are
        </h2>
        <p className="text-base text-neutral-800 leading-relaxed">
          {profile.bio}
        </p>
      </section>

      {/* Their World */}
      {profile.their_world?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">
            Their world
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wider text-neutral-500">
                  <th className="py-2 pr-4 font-medium">Person</th>
                  <th className="py-2 pr-4 font-medium">Relationship</th>
                  <th className="py-2 font-medium">What it was about</th>
                </tr>
              </thead>
              <tbody>
                {profile.their_world.map((row, i) => (
                  <tr key={i} className="border-b border-neutral-100 align-top">
                    <td className="py-3 pr-4 font-semibold text-neutral-900 whitespace-nowrap">
                      {row.person}
                    </td>
                    <td className="py-3 pr-4 text-neutral-600 italic">
                      {row.relationship}
                    </td>
                    <td className="py-3 text-neutral-700 leading-relaxed">
                      {row.about}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Major Works */}
      {profile.major_works?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3">
            Major works
          </h2>
          <ol className="space-y-4">
            {profile.major_works.map((work, i) => (
              <li key={i} className="border-l-2 border-neutral-200 pl-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <h3 className="text-base font-semibold">{work.title}</h3>
                  <span className="text-xs text-neutral-500">{work.year}</span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {work.description}
                </p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Positions */}
      {profile.positions?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-4">
            Positions
          </h2>
          <div className="space-y-6">
            {profile.positions.map((pos, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold mb-2">{pos.domain}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {pos.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Intellectual Fingerprint */}
      {profile.intellectual_fingerprint && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-4">
            Intellectual fingerprint
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-semibold text-emerald-700 mb-2">
                Stands for
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.intellectual_fingerprint.stands_for?.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-red-700 mb-2">
                Stands against
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.intellectual_fingerprint.stands_against?.map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-red-50 border border-red-200 text-red-900 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contentions */}
      {profile.contentions?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-4">
            Contentions
          </h2>
          <div className="space-y-4">
            {profile.contentions.map((c, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 bg-white p-5"
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <div className="text-sm font-semibold">vs. {c.vs}</div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 px-2 py-0.5 bg-neutral-100 rounded">
                    {c.type}
                  </span>
                </div>
                <p className="text-sm text-neutral-700 leading-relaxed">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className="mt-16">
        <Link
          href={backHref}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
        >
          ← {from ? "Back to your constellation" : "Back to home"}
        </Link>
      </footer>
    </main>
  );
}
