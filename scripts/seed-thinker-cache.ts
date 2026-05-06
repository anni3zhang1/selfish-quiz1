/**
 * Seed the thinker_cache table with static profile sections for every unique
 * thinker across all 26 quiz topic pools.
 *
 * Usage:
 *   npx tsx scripts/seed-thinker-cache.ts
 *
 * Requires ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY in .env.local
 * (or already in the environment).
 */

import { readFileSync } from "fs";
import { join } from "path";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

// ─── Load .env.local ──────────────────────────────────────────────────────────

try {
  const raw = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = val;
  }
} catch {
  // .env.local not found — assume env vars are already set
}

// ─── Clients ──────────────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-opus-4-7";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const argumentSchema = {
  type: "object",
  properties: {
    claim: { type: "string" },
    example: { type: "string" },
    why_it_matters: { type: "string" },
  },
  required: ["claim", "example", "why_it_matters"],
  additionalProperties: false,
} as const;

const tensionSchema = {
  type: "object",
  properties: {
    belief_a: { type: "string" },
    belief_b: { type: "string" },
    explanation: { type: "string" },
  },
  required: ["belief_a", "belief_b", "explanation"],
  additionalProperties: false,
} as const;

const impactSchema = {
  type: "object",
  properties: {
    group: { type: "string" },
    emoji: { type: "string" },
    impact: { type: "string" },
  },
  required: ["group", "impact"],
  additionalProperties: false,
} as const;

const staticSchema = {
  type: "object",
  properties: {
    what_they_believe: { type: "string" },
    core_arguments: { type: "array", items: argumentSchema, minItems: 1 },
    where_they_come_from: { type: "string" },
    how_they_think: { type: "string" },
    tension: tensionSchema,
    who_they_impact: { type: "array", items: impactSchema, minItems: 1 },
  },
  required: [
    "what_they_believe",
    "core_arguments",
    "where_they_come_from",
    "how_they_think",
    "tension",
    "who_they_impact",
  ],
  additionalProperties: false,
} as const;

const STATIC_SYSTEM_PROMPT = `You are writing the static, non-personalized sections of a thinker profile. These sections describe the thinker themselves — not any specific user's relationship to them.

SECTION GUIDANCE:

1. what_they_believe
Their thesis in 2-3 sentences — the position, plainly stated. Not hedged, not surveyed. What do they actually believe about the world?

2. core_arguments
3-4 of their most important and distinctive claims. Each argument has:
- claim: one sentence
- example: a concrete case, illustration, or direct quote
- why_it_matters: why this argument is consequential in the real world
Output as a structured array.

3. where_they_come_from
The intellectual tradition they're working in and pushing against. Who shaped them. Who they argue with. The question they entered the field to answer. One paragraph.

4. how_they_think
Epistemic style and signature cognitive moves. NOT biography. What do they trust as evidence? What do they distrust? Where do they start? One dense paragraph — a portrait, not a checklist.

5. tension
The unresolved contradiction that makes them generative. Format strictly as:
- belief_a: one side of the tension
- belief_b: the opposing belief
- explanation: one sentence explaining why these can't be reconciled within their framework
Make it specific and slightly uncomfortable to read.

6. who_they_impact
3-5 stakeholder groups whose lives are meaningfully shaped by this thinker's ideas. Concrete real-world actors, communities, or institutions — not abstract categories. For each:
- group: a short label (e.g. "Tech platforms", "Incarcerated people", "Climate policymakers")
- emoji: a single emoji representing the group
- impact: one sentence describing how this thinker's specific thesis affects them — concrete, not abstract
Do NOT include a "You" entry. That entry is generated dynamically per user.`;

// ─── Load thinker pools ───────────────────────────────────────────────────────

// Dynamic import after env is loaded
async function loadPools(): Promise<{ slug: string; name: string; domain: string; corePosition: string }[]> {
  const { thinkerPools } = await import("../src/lib/thinker-pools/index");
  const seen = new Set<string>();
  const thinkers: { slug: string; name: string; domain: string; corePosition: string }[] = [];
  for (const pool of Object.values(thinkerPools)) {
    for (const t of pool) {
      if (!seen.has(t.slug)) {
        seen.add(t.slug);
        thinkers.push({ slug: t.slug, name: t.name, domain: t.domain, corePosition: t.corePosition });
      }
    }
  }
  return thinkers;
}

// ─── Check which slugs are already cached ────────────────────────────────────

async function fetchCachedSlugs(): Promise<Set<string>> {
  const { data, error } = await supabase.from("thinker_cache").select("thinker_slug");
  if (error) {
    console.error("Failed to fetch existing cache:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((r: { thinker_slug: string }) => r.thinker_slug));
}

// ─── Generate + upsert one thinker ───────────────────────────────────────────

type StaticProfile = {
  what_they_believe: string;
  core_arguments: { claim: string; example: string; why_it_matters: string }[];
  where_they_come_from: string;
  how_they_think: string;
  tension: { belief_a: string; belief_b: string; explanation: string };
  who_they_impact: { group: string; emoji?: string; impact: string }[];
};

async function seedOneThinker(
  t: { slug: string; name: string; domain: string; corePosition: string },
  num: number,
  total: number
): Promise<"ok" | "skip" | "fail"> {
  const userContent = `Generate the static profile sections for ${t.name}.

Domain: ${t.domain}
Core position: ${t.corePosition}`;

  try {
    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: staticSchema },
      },
      system: STATIC_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("No text content returned");

    const parsed = JSON.parse(textBlock.text) as StaticProfile;

    const { error } = await supabase.from("thinker_cache").upsert(
      {
        thinker_slug: t.slug,
        thinker_name: t.name,
        what_they_believe: parsed.what_they_believe,
        core_arguments: parsed.core_arguments,
        where_they_come_from: parsed.where_they_come_from,
        how_they_think: parsed.how_they_think,
        tension: parsed.tension,
        who_they_impact: parsed.who_they_impact,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "thinker_slug" }
    );

    if (error) throw new Error(`Supabase upsert failed: ${error.message}`);

    console.log(`[${num}/${total}] ✓  ${t.name}`);
    return "ok";
  } catch (err) {
    console.error(`[${num}/${total}] ✗  ${t.name}:`, err instanceof Error ? err.message : String(err));
    return "fail";
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const BATCH_SIZE = 5;
  const SKIP_EXISTING = !process.argv.includes("--force");

  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not set");
  if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL not set");
  if (!process.env.SUPABASE_SERVICE_KEY) throw new Error("SUPABASE_SERVICE_KEY not set");

  console.log("Loading thinker pools...");
  const allThinkers = await loadPools();
  console.log(`Found ${allThinkers.length} unique thinkers across all pools.`);

  let thinkers = allThinkers;
  if (SKIP_EXISTING) {
    console.log("Checking existing cache (pass --force to re-seed all)...");
    const cached = await fetchCachedSlugs();
    thinkers = allThinkers.filter((t) => !cached.has(t.slug));
    const skipped = allThinkers.length - thinkers.length;
    if (skipped > 0) console.log(`Skipping ${skipped} already-cached thinkers.`);
  }

  if (thinkers.length === 0) {
    console.log("All thinkers already cached. Done.");
    return;
  }

  console.log(`Seeding ${thinkers.length} thinkers in batches of ${BATCH_SIZE}...\n`);

  let ok = 0;
  let fail = 0;
  const total = thinkers.length;

  for (let i = 0; i < thinkers.length; i += BATCH_SIZE) {
    const batch = thinkers.slice(i, i + BATCH_SIZE);
    const results = await Promise.allSettled(
      batch.map((t, j) => seedOneThinker(t, i + j + 1, total))
    );
    for (const r of results) {
      const status = r.status === "fulfilled" ? r.value : "fail";
      if (status === "ok") ok++;
      else if (status === "fail") fail++;
    }
  }

  console.log(`\nDone. ${ok} succeeded, ${fail} failed out of ${total}.`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
