import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendSMS } from "@/lib/sms";

export const runtime = "nodejs";

type Body = {
  email?: string;
  body?: string;
  intensity?: "light" | "medium" | "deep";
  content_id?: string | null;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, body, intensity, content_id } = payload;

  if (!email || !body) {
    return NextResponse.json(
      { error: "email and body are required" },
      { status: 400 }
    );
  }

  // Look up the user's phone number
  const { data: user, error: userErr } = await supabase
    .from("users")
    .select("phone")
    .eq("email", email)
    .maybeSingle();

  if (userErr) {
    console.error("User lookup failed:", userErr);
    return NextResponse.json({ error: "User lookup failed" }, { status: 500 });
  }

  if (!user?.phone) {
    return NextResponse.json(
      { error: "No phone number on file for this user" },
      { status: 404 }
    );
  }

  // Send via active provider (Twilio or Linq)
  try {
    const result = await sendSMS(email, user.phone, body);

    // Log to messages table
    const { error: insertErr } = await supabase.from("messages").insert({
      user_email: email,
      phone: user.phone,
      direction: "outbound",
      body,
      intensity: intensity ?? null,
      content_id: content_id ?? null,
    });

    if (insertErr) {
      console.error("Failed to log message:", insertErr);
      // Don't fail the request — the message was sent successfully
    }

    return NextResponse.json({
      ok: true,
      provider: result.provider,
      messageId: result.messageId,
      to: user.phone,
    });
  } catch (err) {
    console.error("Message send failed:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to send message",
      },
      { status: 500 }
    );
  }
}
