/**
 * Unified messaging transport — routes to Twilio or Linq based on SMS_PROVIDER env var.
 *
 * All message-sending code should call these functions instead of Twilio/Linq directly.
 * Switch providers with one env var change, no code deploy needed.
 *
 * SMS_PROVIDER = "linq" | "twilio" (default: "twilio")
 */

import { getTwilioClient, getTwilioPhone } from "./twilio";
import {
  sendLinqMessage,
  replyLinqMessage,
  getLinqPhone,
  sendTypingIndicator,
} from "./linq";
import { supabase } from "./supabase";

export type SmsProvider = "twilio" | "linq";

export function getProvider(): SmsProvider {
  const provider = process.env.SMS_PROVIDER?.toLowerCase();
  if (provider === "linq") return "linq";
  return "twilio";
}

export function getFromPhone(): string {
  return getProvider() === "linq" ? getLinqPhone() : getTwilioPhone();
}

export type SendResult = {
  provider: SmsProvider;
  /** Twilio SID or Linq message ID */
  messageId: string;
  /** Linq chat ID (null for Twilio) */
  chatId: string | null;
};

// ─── Look up / store Linq chat ID ──────────────────────────────────

async function getLinqChatId(email: string): Promise<string | null> {
  const { data } = await supabase
    .from("users")
    .select("linq_chat_id")
    .eq("email", email)
    .maybeSingle();
  return data?.linq_chat_id ?? null;
}

async function storeLinqChatId(email: string, chatId: string): Promise<void> {
  await supabase
    .from("users")
    .update({ linq_chat_id: chatId })
    .eq("email", email);
}

// ─── Core send functions ───────────────────────────────────────────

/**
 * Send a message to a user by email. Looks up their phone and routes
 * through the active provider. For Linq, manages chat ID automatically.
 *
 * Returns the send result with provider info and IDs.
 */
export async function sendSMS(
  email: string,
  phone: string,
  body: string
): Promise<SendResult> {
  const provider = getProvider();

  if (provider === "linq") {
    // Check if we have an existing chat with this user
    const existingChatId = await getLinqChatId(email);

    if (existingChatId) {
      // Existing chat — send as follow-up (links allowed)
      const messageId = await replyLinqMessage(existingChatId, body);
      return { provider, messageId, chatId: existingChatId };
    }

    // New chat — first message (NO links allowed)
    const result = await sendLinqMessage(phone, body);
    // Store the chat ID for future messages
    await storeLinqChatId(email, result.chatId);
    return { provider, messageId: result.messageId, chatId: result.chatId };
  }

  // Twilio
  const twilio = getTwilioClient();
  const message = await twilio.messages.create({
    to: phone,
    from: getTwilioPhone(),
    body,
  });
  return { provider, messageId: message.sid, chatId: null };
}

/**
 * Send a follow-up message in an existing conversation.
 * For Linq, uses the stored chat ID. For Twilio, same as sendSMS.
 *
 * Use this when you know you're replying (e.g., in webhook handlers
 * responding to an inbound message).
 */
export async function replySMS(
  email: string,
  phone: string,
  body: string,
  /** Optional Linq chat ID — skips DB lookup if provided */
  chatId?: string | null
): Promise<SendResult> {
  const provider = getProvider();

  if (provider === "linq") {
    const resolvedChatId = chatId ?? (await getLinqChatId(email));

    if (resolvedChatId) {
      // Show typing indicator before sending
      sendTypingIndicator(resolvedChatId).catch(() => {});
      // Small delay so typing indicator is visible
      await new Promise((r) => setTimeout(r, 1500));

      const messageId = await replyLinqMessage(resolvedChatId, body);
      return { provider, messageId, chatId: resolvedChatId };
    }

    // No existing chat — create one (shouldn't normally happen for replies)
    console.warn(`replySMS: no chat ID for ${email}, creating new chat`);
    const result = await sendLinqMessage(phone, body);
    await storeLinqChatId(email, result.chatId);
    return { provider, messageId: result.messageId, chatId: result.chatId };
  }

  // Twilio — same as sendSMS
  const twilio = getTwilioClient();
  const message = await twilio.messages.create({
    to: phone,
    from: getTwilioPhone(),
    body,
  });
  return { provider, messageId: message.sid, chatId: null };
}
