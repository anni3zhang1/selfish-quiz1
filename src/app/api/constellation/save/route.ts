import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { synthesizeMemory } from "@/lib/memory";
import { sendWelcomeSequence } from "@/lib/welcome";
import type { Constellation } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120; // synthesis + hooks + message sending can take 30-60s

type Body = {
  session_id?: string;
  profile_summary?: string;
  constellation?: Constellation;
  /** Partial update — merges into existing constellation JSONB */
  patch?: Record<string, unknown>;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { session_id, profile_summary, constellation, patch } = body;
  if (!session_id) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  // Patch mode: merge fields into existing constellation JSONB
  if (patch && !constellation) {
    const { data: existing } = await supabase
      .from("quiz_sessions")
      .select("constellation")
      .eq("id", session_id)
      .single();

    if (!existing?.constellation) {
      return NextResponse.json({ error: "No constellation to patch" }, { status: 404 });
    }

    const merged = { ...existing.constellation, ...patch };
    const { error } = await supabase
      .from("quiz_sessions")
      .update({ constellation: merged })
      .eq("id", session_id);

    if (error) {
      console.error("Supabase patch failed:", error);
      return NextResponse.json({ error: "Failed to patch constellation" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  }

  if (!constellation) {
    return NextResponse.json(
      { error: "constellation or patch required" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("quiz_sessions")
    .update({
      constellation,
      profile_summary: profile_summary ?? null,
      status: "complete",
    })
    .eq("id", session_id);

  if (error) {
    console.error("Supabase save failed:", error);
    return NextResponse.json({ error: "Failed to save constellation" }, { status: 500 });
  }

  // Trigger memory synthesis in the background (don't block the response)
  // Look up the user's email and topic from the session we just saved
  const { data: session } = await supabase
    .from("quiz_sessions")
    .select("email, topic")
    .eq("id", session_id)
    .single();

  // Await synthesis + welcome before returning.
  // The client already has results on screen — the extra seconds are fine.
  // (after() and fire-and-forget both get killed by Vercel before finishing.)
  if (session?.email) {
    const email = session.email;
    const topic = session.topic ?? "your quiz";

    try {
      console.log(`[save] Starting memory synthesis for ${email}`);
      await synthesizeMemory(email, "quiz_completion");
      console.log(`[save] Memory synthesis complete, sending welcome sequence`);
      await sendWelcomeSequence(email, session_id, topic);
      console.log(`[save] Welcome sequence complete for ${email}`);
    } catch (err) {
      console.error("Memory synthesis or welcome sequence failed:", err);
      // Don't fail the save response — the constellation was saved successfully
    }
  }

  return NextResponse.json({ ok: true });
}
