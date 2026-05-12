import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { synthesizeMemory } from "@/lib/memory";
import { sendWelcomeSequence } from "@/lib/welcome";
import type { Constellation } from "@/lib/types";

export const runtime = "nodejs";

type Body = {
  session_id?: string;
  profile_summary?: string;
  constellation?: Constellation;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { session_id, profile_summary, constellation } = body;
  if (!session_id || !constellation) {
    return NextResponse.json(
      { error: "session_id and constellation required" },
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

  if (session?.email) {
    const topic = session.topic ?? "your quiz";

    // Fire and forget — synthesis runs async, then welcome sequence sends
    synthesizeMemory(session.email, "quiz_completion")
      .then(async () => {
        // After synthesis completes, send the welcome sequence
        // (welcome function checks internally if user has already been messaged)
        await sendWelcomeSequence(session.email!, session_id, topic);
      })
      .catch((err) => {
        console.error("Memory synthesis or welcome sequence failed:", err);
      });
  }

  return NextResponse.json({ ok: true });
}
