import { supabase } from "@/lib/supabase";
import { synthesizeMemory } from "@/lib/memory";
import { detectWelcomeReply } from "@/lib/welcome";
import { composeMessage } from "@/lib/composer";
import { replySMS } from "@/lib/sms";
import twilio from "twilio";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Twilio sends incoming SMS to this webhook as application/x-www-form-urlencoded.
 * Key fields: From, To, Body, MessageSid
 */
export async function POST(req: Request) {
  // Parse the form-encoded body from Twilio
  const formData = await req.formData();
  const from = formData.get("From") as string | null;
  const body = formData.get("Body") as string | null;
  const messageSid = formData.get("MessageSid") as string | null;

  if (!from || !body) {
    return new Response("Missing From or Body", { status: 400 });
  }

  // Validate the request is actually from Twilio (optional in dev, required in prod)
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (authToken && process.env.NODE_ENV === "production") {
    const signature = req.headers.get("x-twilio-signature") ?? "";
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/sms/webhook`;

    // Convert FormData to a plain object for validation
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value as string;
    });

    const isValid = twilio.validateRequest(authToken, signature, url, params);
    if (!isValid) {
      console.warn("Invalid Twilio signature — rejecting webhook");
      return new Response("Invalid signature", { status: 403 });
    }
  }

  // Look up user by phone number
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("email")
    .eq("phone", from)
    .maybeSingle();

  if (userErr) {
    console.error("User lookup by phone failed:", userErr);
  }

  const userEmail = user?.email ?? "unknown";

  // Store the inbound message
  const { error: insertErr } = await supabase.from("messages").insert({
    user_email: userEmail,
    phone: from,
    direction: "inbound",
    body: body.trim(),
    content_id: null,
    intensity: null,
  });

  if (insertErr) {
    console.error("Failed to store inbound message:", insertErr);
  }

  console.log(`SMS received from ${from} (${userEmail}): ${body.trim().slice(0, 80)}...`);

  // Check if this is a reply to the welcome MC question (e.g. "1", "2", "3")
  // Must await fully before returning — Vercel kills the function after response
  if (userEmail !== "unknown") {
    try {
      const welcomeChoice = await detectWelcomeReply(userEmail, body.trim());

      if (welcomeChoice) {
        console.log(`Welcome MC reply from ${userEmail}: chose "${welcomeChoice.chosenEdge}" (option ${welcomeChoice.edgeIndex + 1})`);

        const { data: recentInbound } = await supabase
          .from("messages")
          .select("id")
          .eq("user_email", userEmail)
          .eq("direction", "inbound")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (recentInbound) {
          await supabase
            .from("messages")
            .update({ content_id: `welcome_reply:${welcomeChoice.chosenEdge}` })
            .eq("id", recentInbound.id);
        }

        await synthesizeMemory(userEmail, "sms_reply");
        const composed = await composeMessage(userEmail);
        const result = await replySMS(userEmail, from!, composed.body);

        await supabase.from("messages").insert({
          user_email: userEmail,
          phone: from,
          direction: "outbound",
          body: composed.body,
          intensity: composed.intensity,
          content_id: null,
        });

        console.log(`Follow-up sent to ${userEmail} after welcome choice (${result.provider}: ${result.messageId})`);
      } else {
        await synthesizeMemory(userEmail, "sms_reply");
        const composed = await composeMessage(userEmail);
        const result = await replySMS(userEmail, from!, composed.body);

        await supabase.from("messages").insert({
          user_email: userEmail,
          phone: from,
          direction: "outbound",
          body: composed.body,
          intensity: composed.intensity,
          content_id: null,
        });

        console.log(`Reply sent to ${userEmail} (${composed.intensity}, ${result.provider}: ${result.messageId})`);
      }
    } catch (err) {
      console.error("Reply compose/send failed:", err);
    }
  }

  // Respond with empty TwiML (acknowledges receipt, no auto-reply)
  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;
  return new Response(twiml, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}
