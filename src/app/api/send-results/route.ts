import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import ConstellationEmail from "@/emails/constellation";
import type { Constellation } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 30;

type Body = {
  sessionId?: string;
};

function getSiteUrl(req: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { sessionId } = body;
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  // Fetch session — source of truth lives in DB, not request body.
  const { data: session, error: fetchErr } = await supabase
    .from("quiz_sessions")
    .select(
      "id, topic, name, email, profile_summary, constellation, status, email_sent"
    )
    .eq("id", sessionId)
    .single();

  if (fetchErr || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "complete" || !session.constellation) {
    return NextResponse.json(
      { error: "Constellation not ready" },
      { status: 409 }
    );
  }

  if (session.email_sent) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.warn(
      "send-results: RESEND_API_KEY or RESEND_FROM_EMAIL not set; skipping send"
    );
    return NextResponse.json({ ok: true, skipped: true, reason: "not_configured" });
  }

  const siteUrl = getSiteUrl(req);
  const resultsUrl = `${siteUrl}/results/${session.id}`;
  const profileUrl = `${siteUrl}/profile?email=${encodeURIComponent(session.email ?? "")}`;

  // Pretty topic label fallback — replaces underscores
  const topicLabel = session.topic
    ? session.topic
        .split("_")
        .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ")
    : "Selfish";

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error: sendErr } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: session.email,
      subject: `Your ${topicLabel} constellation`,
      react: ConstellationEmail({
        name: session.name ?? "there",
        topicLabel,
        profileSummary: session.profile_summary ?? undefined,
        constellation: session.constellation as Constellation,
        resultsUrl,
        profileUrl,
      }),
    });

    if (sendErr) {
      console.error("Resend error:", sendErr);
      return NextResponse.json(
        { error: "Email send failed" },
        { status: 500 }
      );
    }

    await supabase
      .from("quiz_sessions")
      .update({ email_sent: true })
      .eq("id", session.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-results unexpected error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
