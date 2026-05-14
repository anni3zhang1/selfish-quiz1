/**
 * Linq iMessage client — sends/receives iMessages via Linq's REST API.
 *
 * Two modes:
 *   sendLinqMessage(to, body)  → creates a new chat, returns chatId
 *   replyLinqMessage(chatId, body) → sends to existing chat thread
 *
 * IMPORTANT: Linq's first message in a chat CANNOT contain links.
 * Links in follow-up messages (replyLinqMessage) are fine.
 */

const LINQ_BASE = "https://api.linqapp.com/api/partner/v3";

function getLinqToken(): string {
  const token = process.env.LINQ_API_TOKEN;
  if (!token) throw new Error("LINQ_API_TOKEN must be set");
  return token;
}

export function getLinqPhone(): string {
  const phone = process.env.LINQ_PHONE_NUMBER;
  if (!phone) throw new Error("LINQ_PHONE_NUMBER must be set");
  return phone;
}

function linqHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${getLinqToken()}`,
    "Content-Type": "application/json",
  };
}

export type LinqSendResult = {
  chatId: string;
  messageId: string;
};

/**
 * Send the first message to a phone number. Creates a new Linq chat.
 * Returns the chat ID (needed for all follow-up messages).
 *
 * NOTE: body must NOT contain links — Linq blocks links in first messages.
 */
export async function sendLinqMessage(
  to: string,
  body: string
): Promise<LinqSendResult> {
  const from = getLinqPhone();

  const res = await fetch(`${LINQ_BASE}/chats`, {
    method: "POST",
    headers: linqHeaders(),
    body: JSON.stringify({
      from,
      to: [to],
      message: {
        parts: [{ type: "text", value: body }],
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Linq create chat failed (${res.status}): ${text}`);
  }

  const data = await res.json();

  return {
    chatId: data.id ?? data.chat?.id ?? data.data?.id,
    messageId: data.message?.id ?? data.data?.message?.id ?? "unknown",
  };
}

/**
 * Send a follow-up message to an existing Linq chat.
 * Links are allowed in follow-up messages.
 */
export async function replyLinqMessage(
  chatId: string,
  body: string
): Promise<string> {
  const res = await fetch(`${LINQ_BASE}/chats/${chatId}/messages`, {
    method: "POST",
    headers: linqHeaders(),
    body: JSON.stringify({
      parts: [{ type: "text", value: body }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Linq reply failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.id ?? data.data?.id ?? "unknown";
}

/**
 * Send a typing indicator to a chat (shows "..." in iMessage).
 * Fire-and-forget — errors are logged but not thrown.
 */
export async function sendTypingIndicator(chatId: string): Promise<void> {
  try {
    await fetch(`${LINQ_BASE}/chats/${chatId}/typing`, {
      method: "POST",
      headers: linqHeaders(),
    });
  } catch (err) {
    console.warn("Linq typing indicator failed:", err);
  }
}

/**
 * Verify a Linq webhook signature.
 * Linq signs webhooks with HMAC-SHA256 over "{timestamp}.{rawBody}".
 */
export async function verifyLinqSignature(
  rawBody: string,
  signature: string,
  timestamp: string
): Promise<boolean> {
  const secret = process.env.LINQ_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("LINQ_WEBHOOK_SECRET not set — skipping signature check");
    return true; // allow in dev
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const data = encoder.encode(`${timestamp}.${rawBody}`);
  const sig = await crypto.subtle.sign("HMAC", key, data);
  const computed = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return computed === signature;
}
