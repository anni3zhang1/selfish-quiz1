/**
 * Test script for the SMS message composer.
 * Run: npx tsx scripts/test-composer.ts [email]
 *
 * Requires a fingerprint to exist in user_memory for this email.
 * Run test-synthesis.ts first if needed.
 */
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

import { composeMessage } from "../src/lib/composer";

async function main() {
  const email = process.argv[2] || "bobcats@gmail.com";
  console.log(`\nComposing message for: ${email}`);
  console.log("Reading fingerprint + content + history, then calling Claude...\n");

  // Generate a few messages to see variety
  const count = parseInt(process.argv[3] || "3", 10);

  for (let i = 0; i < count; i++) {
    console.log(`--- Message ${i + 1} of ${count} ---`);
    console.time(`  compose`);
    const msg = await composeMessage(email);
    console.timeEnd(`  compose`);
    console.log(`  Intensity: ${msg.intensity}`);
    console.log(`  Content ID: ${msg.content_id ?? "(none)"}`);
    console.log(`  Body: "${msg.body}"`);
    console.log(`  Reasoning: ${msg.reasoning}`);
    console.log();
  }
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
