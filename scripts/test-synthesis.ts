/**
 * Test script for memory synthesis.
 * Run: npx tsx scripts/test-synthesis.ts [email]
 */
// Load env vars manually since dotenv may not be installed
import { readFileSync } from "fs";
import { resolve } from "path";

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

import { synthesizeMemory } from "../src/lib/memory";

async function main() {
  const email = process.argv[2] || "bobcats@gmail.com";
  console.log(`\nSynthesizing memory for: ${email}`);
  console.log("This calls Claude with all quiz data — may take 30-60s...\n");
  console.time("synthesis");

  const fingerprint = await synthesizeMemory(email, "quiz_completion");

  console.timeEnd("synthesis");
  console.log("\n=== FINGERPRINT ===\n");
  console.log(JSON.stringify(fingerprint, null, 2));
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
