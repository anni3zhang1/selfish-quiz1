/**
 * Pre-fetch Wikipedia thumbnail URLs for all thinkers in thinker_cache
 * where wikipedia_image_url IS NULL.
 *
 * Prerequisite (run once in Supabase SQL editor):
 *   ALTER TABLE thinker_cache ADD COLUMN IF NOT EXISTS wikipedia_image_url TEXT;
 *
 * Usage:
 *   npx tsx scripts/seed-wikipedia-images.ts
 *
 * Requires SUPABASE_URL, SUPABASE_SERVICE_KEY in .env.local
 */

import { readFileSync } from "fs";
import { join } from "path";
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

if (!process.env.SUPABASE_URL) throw new Error("SUPABASE_URL not set");
if (!process.env.SUPABASE_SERVICE_KEY) throw new Error("SUPABASE_SERVICE_KEY not set");

// ─── Client ───────────────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { persistSession: false } }
);

// ─── Wikipedia fetch ──────────────────────────────────────────────────────────

async function fetchWikipediaImageUrl(name: string): Promise<string> {
  try {
    const slug = name.replace(/ /g, "_");
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`,
      {
        headers: { "User-Agent": "Selfish-App/1.0 (https://selfish-quiz1.vercel.app)" },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return "";
    const data = (await res.json()) as { thumbnail?: { source: string } };
    return data.thumbnail?.source ?? "";
  } catch {
    return "";
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const BATCH_SIZE = 20;

  // Fetch all rows where wikipedia_image_url hasn't been set yet
  const { data: rows, error } = await supabase
    .from("thinker_cache")
    .select("thinker_slug, thinker_name")
    .is("wikipedia_image_url", null)
    .order("thinker_name");

  if (error) throw new Error(`Failed to fetch rows: ${error.message}`);
  if (!rows?.length) {
    console.log("All thinkers already have image URLs. Done.");
    return;
  }

  console.log(`Found ${rows.length} thinkers without Wikipedia image URLs.`);
  console.log(`Running in batches of ${BATCH_SIZE}...\n`);

  let found = 0;
  let missing = 0;
  let failed = 0;
  const total = rows.length;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);

    await Promise.allSettled(
      batch.map(async (row) => {
        const url = await fetchWikipediaImageUrl(row.thinker_name);

        const { error: updateErr } = await supabase
          .from("thinker_cache")
          .update({ wikipedia_image_url: url })
          .eq("thinker_slug", row.thinker_slug);

        if (updateErr) {
          console.error(`✗ ${row.thinker_name}: DB update failed — ${updateErr.message}`);
          failed++;
        } else if (url) {
          console.log(`✓ ${row.thinker_name}: ${url}`);
          found++;
        } else {
          console.log(`- ${row.thinker_name}: no image`);
          missing++;
        }
      })
    );
  }

  console.log(`\nDone. ${found} with image, ${missing} without, ${failed} failed out of ${total}.`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
