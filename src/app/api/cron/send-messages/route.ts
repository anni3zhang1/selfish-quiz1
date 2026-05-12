import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { composeMessage } from "@/lib/composer";
import type { MessageIntensity } from "@/lib/composer";
import { getTwilioClient, getTwilioPhone } from "@/lib/twilio";

export const runtime = "nodejs";
export const maxDuration = 300; // may process multiple users

/**
 * Cron job: runs daily at 3pm UTC (8am PT / 11am ET).
 * Finds users who are due a message and sends one.
 *
 * Re-engagement cadence (graduated backoff when user goes quiet):
 *   0 unanswered → active conversation, standard 24h cadence
 *   1 unanswered → wait 3-5 days, send ambient
 *   2 unanswered → wait 1 week, change angle (light intensity, different topic)
 *   3 unanswered → wait 2 weeks, send something surprising/delightful (ambient)
 *   4+ unanswered → monthly ambient check-ins
 *
 * Active user cadence:
 *   - Last message was inbound (user replied) → eligible if reply was 12h+ ago
 *   - Last message was outbound, user previously replied → eligible after 24h
 *
 * Never guilt, never nag.
 */

const CRON_SECRET = process.env.CRON_SECRET;

// Timing constants
const HOURS = (h: number) => h * 60 * 60 * 1000;
const DAYS = (d: number) => d * 24 * 60 * 60 * 1000;

type EligibleUser = {
  email: string;
  phone: string;
  suggestedIntensity: MessageIntensity | null; // null = let composer decide
  consecutiveUnanswered: number;
};

/**
 * Count how many consecutive outbound messages went unanswered.
 * Walks backward from most recent message until hitting an inbound.
 */
function countConsecutiveUnanswered(messages: { direction: string }[]): number {
  let count = 0;
  for (const msg of messages) {
    if (msg.direction === "outbound") {
      count++;
    } else {
      break; // hit an inbound reply — stop counting
    }
  }
  return count;
}

async function findEligibleUsers(): Promise<EligibleUser[]> {
  // Get all users with a phone number and a fingerprint
  const { data: usersWithMemory, error } = await supabase
    .from("user_memory")
    .select("email");

  if (error || !usersWithMemory) {
    console.error("Failed to fetch user_memory:", error);
    return [];
  }

  const eligible: EligibleUser[] = [];

  for (const { email } of usersWithMemory) {
    // Check user has a phone
    const { data: user } = await supabase
      .from("users")
      .select("phone")
      .eq("email", email)
      .maybeSingle();

    if (!user?.phone) continue;

    // Fetch recent message history (enough to count unanswered streak)
    const { data: recentMessages } = await supabase
      .from("messages")
      .select("direction, created_at")
      .eq("user_email", email)
      .order("created_at", { ascending: false })
      .limit(10);

    const now = Date.now();

    if (!recentMessages || recentMessages.length === 0) {
      // Never messaged — first message is sent by the welcome sequence,
      // so if we get here it means something failed. Try sending now.
      eligible.push({ email, phone: user.phone, suggestedIntensity: null, consecutiveUnanswered: 0 });
      continue;
    }

    const lastMsg = recentMessages[0];
    const lastMsgAge = now - new Date(lastMsg.created_at).getTime();

    if (lastMsg.direction === "inbound") {
      // User replied — eligible if reply was 12h+ ago
      if (lastMsgAge >= HOURS(12)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: null, consecutiveUnanswered: 0 });
      }
      continue;
    }

    // Last message was outbound — check how many went unanswered
    const unanswered = countConsecutiveUnanswered(recentMessages);

    if (unanswered === 0) {
      // Shouldn't happen if last was outbound, but safety net
      if (lastMsgAge >= HOURS(24)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: null, consecutiveUnanswered: 0 });
      }
    } else if (unanswered === 1) {
      // First missed — wait 2 days, go ambient
      if (lastMsgAge >= DAYS(2)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: "ambient", consecutiveUnanswered: 1 });
      }
    } else if (unanswered === 2) {
      // Second missed — wait 4 days, change angle (light, different topic)
      if (lastMsgAge >= DAYS(4)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: "light", consecutiveUnanswered: 2 });
      }
    } else if (unanswered === 3) {
      // Third missed — wait 7 days, surprise gift (ambient, no expectation)
      if (lastMsgAge >= DAYS(7)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: "ambient", consecutiveUnanswered: 3 });
      }
    } else if (unanswered === 4) {
      // Fourth missed — wait 14 days, ask if they still want messages
      if (lastMsgAge >= DAYS(14)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: "ambient", consecutiveUnanswered: 4 });
      }
    } else {
      // 5+ missed — monthly check-ins
      if (lastMsgAge >= DAYS(30)) {
        eligible.push({ email, phone: user.phone, suggestedIntensity: "ambient", consecutiveUnanswered: unanswered });
      }
    }
  }

  return eligible;
}

export async function GET(req: Request) {
  // Verify the cron secret to prevent unauthorized calls
  if (CRON_SECRET) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const eligible = await findEligibleUsers();
  console.log(`Cron: found ${eligible.length} eligible user(s)`);

  const results: { email: string; status: string; error?: string }[] = [];

  const twilio = getTwilioClient();
  const fromPhone = getTwilioPhone();

  for (const user of eligible) {
    try {
      // Compose a message, with re-engagement hint if user has been quiet
      const composed = await composeMessage(user.email, {
        suggestedIntensity: user.suggestedIntensity,
        consecutiveUnanswered: user.consecutiveUnanswered,
      });

      // Send it
      const sms = await twilio.messages.create({
        to: user.phone,
        from: fromPhone,
        body: composed.body,
      });

      // Log to messages table
      await supabase.from("messages").insert({
        user_email: user.email,
        phone: user.phone,
        direction: "outbound",
        body: composed.body,
        intensity: composed.intensity,
        content_id: null,
      });

      const reengageNote = user.consecutiveUnanswered > 0
        ? ` (re-engage attempt ${user.consecutiveUnanswered}, suggested ${user.suggestedIntensity})`
        : "";
      console.log(`Sent ${composed.intensity} message to ${user.email}${reengageNote} (SID: ${sms.sid})`);
      results.push({ email: user.email, status: "sent" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`Failed to send to ${user.email}:`, msg);
      results.push({ email: user.email, status: "failed", error: msg });
    }
  }

  return NextResponse.json({
    processed: eligible.length,
    results,
  });
}
