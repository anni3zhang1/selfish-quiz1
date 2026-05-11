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

  const { data } = await supabase
    .from("quiz_sessions")
    .select("id, topic, constellation, created_at")
    .not("constellation", "is", null)
    .order("created_at", { ascending: false })
    .limit(1);

  const c = data?.[0]?.constellation;
  console.log("Session:", data?.[0]?.id, "topic:", data?.[0]?.topic);
  console.log("Constellation keys:", Object.keys(c ?? {}));
  const first = Object.values(c ?? {})[0] as Record<string, unknown>;
  console.log("First card keys:", Object.keys(first ?? {}));
  console.log("First card sample:", JSON.stringify(first, null, 2));
}

main().catch(console.error);
