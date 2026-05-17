import { supabase } from "@/lib/supabase";
import { verifyLinqSignature } from "@/lib/linq";
import { synthesizeMemory } from "@/lib/memory";
import { detectWelcomeReply } from "@/lib/welcome";
import { composeMessage } from "@/lib/composer";
import { replySMS } from "@/lib/sms";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Linq sends inbound iMessages as JSON POST with HMAC-SHA256 signature.
 *
 * Headers:
 *   X-Webhook-Signature — HMAC-SHA256 hex digest
 *   X-Webhook-Timestamp — Unix timestamp
 *   X-Webhook-Event     — event type (e.g., "message.received")
 *
 * Body shape (V3, 2026-02-03):
 * {
 *   event_type: "message.received",
 *   event_id: "...",
 *   data: {
 *     chat: { id, is_group, owner_handle },
 *     id: "message-uuid",
 *     direction: "inbound",
 *     sender_handle: { handle: "+1...", is_me: false },
 *     parts: [{ type: "text", value: "..." }],
 *     sent_at: "...",
 *     service: "iMessage"
 *   }
 * }
 */

type LinqWebhookPayload = {
  event_type: string;
  event_id: string;
  data: {
    chat: {
      id: string;
      is_group: boolean;
      owner_handle: { handle: string; is_me: boolean };
    };
    id: string;
    direction: string;
    sender_handle: {
      handle: string;
      is_me: boolean;
    };
    parts: Array<{ type: string; value: string }>;
    sent_at: string;
    service: string;
  };
};

export async function POST(req: Request) {
  const rawBody = await req.text();

  // Validate signature in production
  const signature = req.headers.get("x-webhook-signature") ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";
  const eventType = req.headers.get("x-webhook-event") ?? "";

  if (process.env.NODE_ENV === "production") {
    const valid = await verifyLinqSignature(rawBody, signature, timestamp);
    if (!valid) {
      console.warn("Invalid Linq webhook signature — rejecting");
      return new Response("Invalid signature", { status: 403 });
    }
  }

  let payload: LinqWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // Only handle message.received events
  if (
    payload.event_type !== "message.received" &&
    eventType !== "message.received"
  ) {
    // Acknowledge other events (reactions, read receipts, etc.) without processing
    console.log(`Linq webhook: ignoring event type "${payload.event_type}"`);
    return new Response("OK", { status: 200 });
  }

  const { data: eventData } = payload;
  const chatId = eventData.chat.id;
  let from = eventData.sender_handle.handle; // phone number
  const textParts = eventData.parts.filter((p) => p.type === "text");
  const body = textParts.map((p) => p.value).join("\n").trim();

  if (!from || !body) {
    return new Response("Missing sender or body", { status: 400 });
  }

  // Normalize phone to E.164 — Linq may send with or without "+"
  if (!from.startsWith("+")) {
    from = `+${from}`;
  }

  console.log(`[linq-webhook] Inbound from ${from}, chatId=${chatId}, body="${body.slice(0, 80)}"`);

  // Look up user by phone number (try both with and without +1 prefix)
  let { data: user, error: userErr } = await supabase
    .from("users")
    .select("email, linq_chat_id")
    .eq("phone", from)
    .maybeSingle();

  // Fallback: if phone stored as +1XXXXXXXXXX but Linq sent +XXXXXXXXXX or vice versa
  if (!user && !userErr && from.startsWith("+1")) {
    const without1 = "+" + from.slice(2);
    const result = await supabase
      .from("users")
      .select("email, linq_chat_id")
      .eq("phone", without1)
      .maybeSingle();
    user = result.data;
    userErr = result.error;
  } else if (!user && !userErr && !from.startsWith("+1")) {
    const with1 = "+1" + from.slice(1);
    const result = await supabase
      .from("users")
      .select("email, linq_chat_id")
      .eq("phone", with1)
      .maybeSingle();
    user = result.data;
    userErr = result.error;
  }

  if (userErr) {
    console.error("User lookup by phone failed:", userErr);
  }

  const userEmail = user?.email ?? "unknown";

  // Update linq_chat_id if we don't have it stored yet
  if (user && !user.linq_chat_id) {
    await supabase
      .from("users")
      .update({ linq_chat_id: chatId })
      .eq("email", userEmail);
  }

  // Store the inbound message
  const { error: insertErr } = await supabase.from("messages").insert({
    user_email: userEmail,
    phone: from,
    direction: "inbound",
    body,
    content_id: null,
    intensity: null,
  });

  if (insertErr) {
    console.error("Failed to store inbound message:", insertErr);
  }

  console.log(
    `iMessage received from ${from} (${userEmail}): ${body.slice(0, 80)}...`
  );

  // Process reply — must await fully before returning (Vercel kills the function after response)
  if (userEmail !== "unknown") {
    try {
      const welcomeChoice = await detectWelcomeReply(userEmail, body);

      if (welcomeChoice) {
        console.log(
          `Welcome MC reply from ${userEmail}: chose "${welcomeChoice.chosenEdge}" (option ${welcomeChoice.edgeIndex + 1})`
        );

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
            .update({
              content_id: `welcome_reply:${welcomeChoice.chosenEdge}`,
            })
            .eq("id", recentInbound.id);
        }

        await synthesizeMemory(userEmail, "sms_reply");
        const composed = await composeMessage(userEmail);
        const result = await replySMS(userEmail, from, composed.body, chatId);

        await supabase.from("messages").insert({
          user_email: userEmail,
          phone: from,
          direction: "outbound",
          body: composed.body,
          intensity: composed.intensity,
          content_id: null,
        });

        console.log(
          `Follow-up sent to ${userEmail} after welcome choice (${result.provider}: ${result.messageId})`
        );
      } else {
        await synthesizeMemory(userEmail, "sms_reply");
        const composed = await composeMessage(userEmail);
        const result = await replySMS(userEmail, from, composed.body, chatId);

        await supabase.from("messages").insert({
          user_email: userEmail,
          phone: from,
          direction: "outbound",
          body: composed.body,
          intensity: composed.intensity,
          content_id: null,
        });

        console.log(
          `Reply sent to ${userEmail} (${composed.intensity}, ${result.provider}: ${result.messageId})`
        );
      }
    } catch (err) {
      console.error("Reply compose/send failed:", err);
    }
  }

  return new Response("OK", { status: 200 });
}
