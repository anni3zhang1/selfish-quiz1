import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

  return NextResponse.json({ ok: true });
}
