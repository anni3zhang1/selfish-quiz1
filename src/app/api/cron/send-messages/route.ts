import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { composeMessage } from "@/lib/composer";
import { getTwilioClient, getTwilioPhone } from "@/lib/twilio";

export const runtime = "nodejs";
export const maxDuration = 300; // may process multiple users

/**
 * Cron job: runs daily at 3pm UTC (8am PT / 11am ET).
 * Finds users who are due a message and sends one.
 *
 * Eligibility rules:
 * 1. User has a phone number
 * 2. User has a fingerprint (completed at least one quiz + synthesis ran)
 * 3. Cadence check:
 *    - Never messaged before → eligible if first quiz was 24h+ ago
 *    - Last message was outbound with no reply → back off (wait 72h)
 *    - Last message was inbound (user replied) → eligible if reply was 12h+ ago
 *    - Last message was outbound and user replied later → eligible if 24h+ since last outbound
 */

const CRON_SECRET = process.env.CRON_SECRET;

type EligibleUser = {
  email: string;
  phone: string;
};

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

    // Check message history for cadence
    const { data: lastMessages } = await supabase
      .from("messages")
      .select("direction, created_at")
      .eq("user_email", email)
      .order("created_at", { ascending: false })
      .limit(2);

    const now = Date.now();

    if (!lastMessages || lastMessages.length === 0) {
      // Never messaged — first message is sent immediately by the save route,
      // so if we get here it means something failed. Try sending now.
      eligible.push({ email, phone: user.phone });
      continue;
    }

    const lastMsg = lastMessages[0];
    const lastMsgAge = now - new Date(lastMsg.created_at).getTime();
    const twelveHours = 12 * 60 * 60 * 1000;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const seventyTwoHours = 72 * 60 * 60 * 1000;

    if (lastMsg.direction === "inbound") {
      // User replied — eligible if reply was 12h+ ago (give them space, then follow up)
      if (lastMsgAge >= twelveHours) {
        eligible.push({ email, phone: user.phone });
      }
    } else {
      // Last message was outbound (we sent it)
      // Check if user ever replied after our last message
      const hasReply = lastMessages.length > 1 && lastMessages[0].direction === "outbound"
        && lastMessages[1]?.direction === "inbound";

      if (hasReply) {
        // User replied to a previous message but we sent another since — standard 24h cadence
        if (lastMsgAge >= twentyFourHours) {
          eligible.push({ email, phone: user.phone });
        }
      } else {
        // No reply to our last message — back off to 72h
        if (lastMsgAge >= seventyTwoHours) {
          eligible.push({ email, phone: user.phone });
        }
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
      // Compose a message
      const composed = await composeMessage(user.email);

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
        content_id: composed.content_id,
      });

      console.log(`Sent ${composed.intensity} message to ${user.email} (SID: ${sms.sid})`);
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
