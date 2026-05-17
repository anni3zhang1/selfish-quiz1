import Link from "next/link";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/thinkers";
import type {
  Constellation,
  ConstellationCard,
  RelationshipType,
  ThinkerProfileData,
} from "@/lib/types";
import ThinkerProfileView from "./ThinkerProfileView";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const name = id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} — Stance`,
    description: `Explore how ${name} relates to your intellectual worldview.`,
  };
}

type SearchParams = {
  from?: string;
  relationship?: string;
};

function isRelationshipType(s: string | undefined): s is RelationshipType {
  return (
    !!s &&
    [
      "mirror",
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

  // Without session context we can't generate a personalized profile
  if (!from || !isRelationshipType(relationship)) {
    return (
      <main className="mx-auto max-w-[480px] px-6 py-32 text-center">
        <h1 className="text-2xl font-serif mb-4">Thinker profile</h1>
        <p className="text-neutral-600 mb-6">
          Open a thinker from your intellectual map to see a personalized profile.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2 bg-neutral-900 text-white rounded-lg"
        >
          ← Home
        </Link>
      </main>
    );
  }

  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("id, constellation")
    .eq("id", from)
    .single();

  const constellation = (session?.constellation ?? null) as Constellation | null;
  const card: ConstellationCard | undefined = constellation?.[relationship];

  // Fall back: try to find any card whose slugified name matches the URL slug
  let thinkerName = card && slugify(card.name) === id ? card.name : undefined;
  if (!thinkerName && constellation) {
    for (const c of Object.values(constellation)) {
      if (c && "name" in c && c.name && slugify(c.name) === id) {
        thinkerName = c.name;
        break;
      }
    }
  }
  if (!thinkerName) {
    // No reliable name resolution — make slug presentable
    thinkerName = id.replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }

  // Cached profile lookup
  const { data: cached } = await supabase
    .from("thinker_profiles")
    .select("profile")
    .eq("session_id", from)
    .eq("thinker_slug", id)
    .maybeSingle();

  const initialProfile = (cached?.profile ?? null) as ThinkerProfileData | null;

  return (
    <ThinkerProfileView
      sessionId={from}
      thinkerSlug={id}
      thinkerName={thinkerName}
      relationship={relationship}
      tagline={card?.tagline ?? null}
      thumbnailUrl={card?.thumbnail_url ?? null}
      initialProfile={initialProfile}
    />
  );
}
