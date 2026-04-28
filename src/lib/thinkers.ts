import profilesJson from "../../data/thinker-profiles.json";

export type ThinkerProfile = {
  id: string;
  name: string;
  tagline: string;
  bio: string;
  their_world: { person: string; relationship: string; about: string }[];
  major_works: { title: string; year: number | string; description: string }[];
  positions: { domain: string; text: string }[];
  intellectual_fingerprint: {
    stands_for: string[];
    stands_against: string[];
  };
  contentions: { vs: string; type: string; text: string }[];
  entry_point?: string;
};

const profiles: ThinkerProfile[] = (profilesJson as { thinkers: ThinkerProfile[] }).thinkers;

const COMBINING_MARKS = /[̀-ͯ]/g;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function getThinker(id: string): ThinkerProfile | null {
  // Exact match first; fall back to slugified-name match for resilience
  const direct = profiles.find((p) => p.id === id);
  if (direct) return direct;
  const slugMatch = profiles.find((p) => slugify(p.name) === id);
  return slugMatch ?? null;
}

export function listThinkers(): ThinkerProfile[] {
  return profiles;
}
