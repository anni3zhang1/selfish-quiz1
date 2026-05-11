import { readFileSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";

async function main() {
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

  function slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  // Get latest session with constellation
  const { data: sessions } = await supabase
    .from("quiz_sessions")
    .select("id, topic, constellation, created_at")
    .not("constellation", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  const session = sessions?.[0];
  if (!session) { console.log("No sessions found"); return; }
  console.log(`Session: ${session.id}  topic: ${session.topic}\n`);

  const constellation = session.constellation as Record<string, { name?: string }>;
  const thinkers = Object.entries(constellation).map(([role, card]) => {
    const name = card?.name ?? "(unknown)";
    const slugUnderscore = slugify(name);           // what slugify() produces
    const slugHyphen = slugUnderscore.replace(/_/g, "-"); // normalized in API
    return { role, name, slugUnderscore, slugHyphen };
  });

  console.log("Thinkers in constellation:");
  for (const t of thinkers) {
    console.log(`  ${t.role}: ${t.name}`);
    console.log(`    underscore slug: ${t.slugUnderscore}`);
    console.log(`    hyphen slug:     ${t.slugHyphen}`);
  }

  const hyphenSlugs = thinkers.map(t => t.slugHyphen);
  const underscoreSlugs = thinkers.map(t => t.slugUnderscore);

  // Check both slug formats against thinker_cache
  const { data: cachedHyphen } = await supabase
    .from("thinker_cache")
    .select("thinker_slug")
    .in("thinker_slug", hyphenSlugs);

  const { data: cachedUnderscore } = await supabase
    .from("thinker_cache")
    .select("thinker_slug")
    .in("thinker_slug", underscoreSlugs);

  const hitHyphen = new Set((cachedHyphen ?? []).map((r: { thinker_slug: string }) => r.thinker_slug));
  const hitUnderscore = new Set((cachedUnderscore ?? []).map((r: { thinker_slug: string }) => r.thinker_slug));

  console.log(`\nthinker_cache hits:`);
  for (const t of thinkers) {
    const h = hitHyphen.has(t.slugHyphen) ? "✓ (hyphen)" : "";
    const u = hitUnderscore.has(t.slugUnderscore) ? "✓ (underscore)" : "";
    const miss = !h && !u ? "✗ MISS" : "";
    console.log(`  ${t.name}: ${h || u || miss}`);
  }

  // Also check what's in thinker_profiles for this session
  const { data: sessionCached } = await supabase
    .from("thinker_profiles")
    .select("thinker_slug, thinker_name, relationship_type")
    .eq("session_id", session.id);

  console.log(`\nSession cache (thinker_profiles) for this session: ${sessionCached?.length ?? 0} entries`);
  for (const r of sessionCached ?? []) {
    console.log(`  ${r.relationship_type}: ${r.thinker_name} (${r.thinker_slug})`);
  }

  // Time two requests for first thinker to production (or localhost if up)
  const BASE_URL = process.env.TEST_URL ?? "https://selfish-quiz1.vercel.app";
  const first = thinkers[0];
  const payload = {
    session_id: session.id,
    thinker_slug: first.slugUnderscore, // send as slugify() would produce
    thinker_name: first.name,
    relationship_type: first.role,
  };

  console.log(`\nTiming two requests to ${BASE_URL} for ${first.name} (${first.role})`);

  const t1 = Date.now();
  const r1 = await fetch(`${BASE_URL}/api/thinker-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const d1 = await r1.json() as { cached?: boolean; error?: string };
  const ms1 = Date.now() - t1;
  console.log(`  Request 1: ${ms1}ms | status=${r1.status} | cached=${d1.cached} | error=${d1.error ?? "none"}`);

  const t2 = Date.now();
  const r2 = await fetch(`${BASE_URL}/api/thinker-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const d2 = await r2.json() as { cached?: boolean; error?: string };
  const ms2 = Date.now() - t2;
  console.log(`  Request 2: ${ms2}ms | status=${r2.status} | cached=${d2.cached} | error=${d2.error ?? "none"}`);

  console.log(`\nSession cache working: ${ms2 < 1500 && d2.cached === true ? "YES ✓" : "NO ✗"}`);
}

main().catch(console.error);
