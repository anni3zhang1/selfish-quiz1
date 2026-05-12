/**
 * Interactive chat loop — simulates the full SMS conversational flow.
 * Uses real Supabase, real memory synthesis, real composer.
 *
 * Run: npx tsx scripts/chat.ts [email]
 *
 * Flow each turn:
 *   1. Composer generates a message (using fingerprint + message history)
 *   2. Message is stored in the messages table as outbound
 *   3. You type a reply
 *   4. Reply is stored as inbound
 *   5. Memory synthesis runs (absorbs your reply into fingerprint)
 *   6. Back to step 1
 *
 * Type "quit" or "exit" to stop. Type "fingerprint" to see current state.
 */
import { readFileSync } from "fs";
import { resolve } from "path";
import { createInterface } from "readline";

// Load .env.local
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
for (const line of envContent.split("\n")) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const val = match[2].trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

import { composeMessage } from "../src/lib/composer";
import { synthesizeMemory } from "../src/lib/memory";
import { supabase } from "../src/lib/supabase";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

async function showFingerprint(email: string) {
  const { data } = await supabase
    .from("user_memory")
    .select("fingerprint, sessions_analyzed, updated_at")
    .eq("email", email)
    .maybeSingle();

  if (!data) {
    console.log("\n  (No fingerprint found)\n");
    return;
  }

  const fp = data.fingerprint as Record<string, unknown>;
  console.log("\n── Current Fingerprint ──");
  console.log(`  Sessions analyzed: ${data.sessions_analyzed}`);
  console.log(`  Updated: ${data.updated_at}`);
  console.log(`  Core identity: ${fp.core_identity}`);
  console.log(`  Conversation stage: ${fp.conversation_stage}`);
  console.log(`  Rapport level: ${fp.rapport_level}`);

  const edges = fp.curiosity_edges as Array<{ domain: string; entry_angle: string }>;
  if (edges?.length) {
    console.log(`  Curiosity edges:`);
    edges.forEach((e) => console.log(`    • ${e.domain}: "${e.entry_angle}"`));
  }

  const questions = fp.unresolved_questions as Array<{ question: string }>;
  if (questions?.length) {
    console.log(`  Unresolved questions:`);
    questions.forEach((q) => console.log(`    • ${q.question}`));
  }
  console.log("──────────────────────\n");
}

async function main() {
  const email = process.argv[2] || "bobcats@gmail.com";

  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  Selfish Chat — testing conversational    ║`);
  console.log(`║  dynamic with real composer + memory      ║`);
  console.log(`╚══════════════════════════════════════════╝`);
  console.log(`\n  User: ${email}`);
  console.log(`  Commands: "quit" to exit, "fingerprint" to see current state\n`);

  // Check fingerprint exists
  const { data: mem } = await supabase
    .from("user_memory")
    .select("sessions_analyzed")
    .eq("email", email)
    .maybeSingle();

  if (!mem) {
    console.log(`  ❌ No fingerprint found for ${email}. Take a quiz first.\n`);
    rl.close();
    return;
  }
  console.log(`  ✓ Fingerprint loaded (${mem.sessions_analyzed} sessions analyzed)\n`);

  // Check existing message history
  const { data: existingMessages } = await supabase
    .from("messages")
    .select("direction, body, intensity, created_at")
    .eq("user_email", email)
    .order("created_at", { ascending: true });

  if (existingMessages?.length) {
    console.log(`  Message history (${existingMessages.length} messages):`);
    existingMessages.forEach((m) => {
      const who = m.direction === "outbound" ? "  SELFISH" : "  YOU";
      const meta = m.intensity ? ` [${m.intensity}]` : "";
      console.log(`  ${who}${meta}: ${m.body}`);
    });
    console.log();
  }

  let turn = 0;
  while (true) {
    turn++;
    console.log(`── Turn ${turn} ──`);
    console.log(`  Composing...`);

    try {
      const startTime = Date.now();
      const composed = await composeMessage(email);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`  (${elapsed}s, ${composed.intensity})`);
      console.log(`\n  SELFISH: ${composed.body}`);
      console.log(`  [reasoning: ${composed.reasoning}]\n`);

      // Store outbound
      await supabase.from("messages").insert({
        user_email: email,
        phone: "test-chat",
        direction: "outbound",
        body: composed.body,
        intensity: composed.intensity,
        content_id: null,
      });
    } catch (err) {
      console.error(`  ❌ Compose failed:`, err);
      break;
    }

    // Get user reply
    const reply = await ask("  YOU: ");

    if (reply.toLowerCase() === "quit" || reply.toLowerCase() === "exit") {
      console.log("\n  Goodbye!\n");
      break;
    }

    if (reply.toLowerCase() === "fingerprint") {
      await showFingerprint(email);
      turn--; // Don't count this as a turn
      continue;
    }

    if (!reply.trim()) {
      console.log("  (empty reply, skipping)\n");
      turn--;
      continue;
    }

    // Store inbound
    await supabase.from("messages").insert({
      user_email: email,
      phone: "test-chat",
      direction: "inbound",
      body: reply.trim(),
      content_id: null,
      intensity: null,
    });

    // Synthesize memory with the reply
    console.log(`  Synthesizing memory...`);
    try {
      const synthStart = Date.now();
      await synthesizeMemory(email, "sms_reply");
      const synthElapsed = ((Date.now() - synthStart) / 1000).toFixed(1);
      console.log(`  Memory updated (${synthElapsed}s)\n`);
    } catch (err) {
      console.error(`  ⚠ Memory synthesis failed (continuing):`, err);
    }
  }

  rl.close();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
