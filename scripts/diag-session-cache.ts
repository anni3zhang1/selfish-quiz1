import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

// Load .env.local
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
} catch {}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  // 1. Get most recent session with constellation data
  const { data: sessions, error: sessErr } = await supabase
    .from("quiz_sessions")
    .select("id, topic, constellation, created_at")
    .not("constellation", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  if (sessErr || !sessions?.length) {
    console.error("No sessions found:", sessErr?.message);
    return;
  }

  const session = sessions[0];
  console.log(`\nLatest session: ${session.id}`);
  console.log(`Topic: ${session.topic}`);
  console.log(`Created: ${session.created_at}`);

  const constellation = session.constellation as Record<string, { thinker_slug?: string; thinker_name?: string }>;
  const entries = Object.entries(constellation);
  console.log(`\nConstellation (${entries.length} thinkers):`);
  const slugs: string[] = [];
  for (const [role, card] of entries) {
    const slug = card?.thinker_slug ?? "(no slug)";
    slugs.push(slug);
    console.log(`  ${role}: ${card?.thinker_name} (${slug})`);
  }

  // 2. Check which are in thinker_cache
  const { data: cached, error: cacheErr } = await supabase
    .from("thinker_cache")
    .select("thinker_slug")
    .in("thinker_slug", slugs);

  if (cacheErr) {
    console.error("Cache check error:", cacheErr.message);
  } else {
    const cachedSlugs = new Set((cached ?? []).map((r: { thinker_slug: string }) => r.thinker_slug));
    console.log(`\nthinker_cache hits (${cachedSlugs.size}/${slugs.length}):`);
    for (const slug of slugs) {
      console.log(`  ${cachedSlugs.has(slug) ? "✓" : "✗"} ${slug}`);
    }
  }

  // 3. Pick the first thinker with a real slug and relationship type to test session cache
  const testEntry = entries.find(([, card]) => card?.thinker_slug && card?.thinker_name);
  if (!testEntry) {
    console.log("\nNo valid thinker found to test session cache.");
    return;
  }
  const [testRole, testCard] = testEntry;

  console.log(`\nTesting session cache with: ${testCard.thinker_name} (${testRole})`);
  console.log(`Session: ${session.id}`);

  const BASE_URL = "http://localhost:3000";
  const payload = {
    session_id: session.id,
    thinker_slug: testCard.thinker_slug,
    thinker_name: testCard.thinker_name,
    relationship_type: testRole,
  };

  // Request 1
  console.log("\nRequest 1 (cold)...");
  const t1 = Date.now();
  const r1 = await fetch(`${BASE_URL}/api/thinker-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const d1 = await r1.json() as { cached?: boolean; error?: string };
  const ms1 = Date.now() - t1;
  console.log(`  ${ms1}ms | status=${r1.status} | cached=${d1.cached} | error=${d1.error ?? "none"}`);

  // Request 2
  console.log("\nRequest 2 (should hit session cache)...");
  const t2 = Date.now();
  const r2 = await fetch(`${BASE_URL}/api/thinker-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const d2 = await r2.json() as { cached?: boolean; error?: string };
  const ms2 = Date.now() - t2;
  console.log(`  ${ms2}ms | status=${r2.status} | cached=${d2.cached} | error=${d2.error ?? "none"}`);

  console.log(`\nSession cache working: ${ms2 < 1000 && d2.cached === true ? "YES ✓" : "NO ✗ (ms2=" + ms2 + ", cached=" + d2.cached + ")"}`);
}

main().catch(console.error);
