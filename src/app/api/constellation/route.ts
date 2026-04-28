import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateConstellation } from "@/lib/constellation";
import type { AnswerEntry } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;

type Body = {
  topic?: string;
  answers?: AnswerEntry[];
  name?: string;
  email?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { topic, answers, name, email } = body;
  if (!topic || !Array.isArray(answers) || answers.length === 0 || !name || !email) {
    return NextResponse.json(
      { error: "topic, answers, name, email required" },
      { status: 400 }
    );
  }

  const { data: session, error: insertErr } = await supabase
    .from("quiz_sessions")
    .insert({
      topic,
      answers,
      name,
      email,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (insertErr || !session) {
    console.error("Supabase insert failed:", insertErr);
    return NextResponse.json(
      { error: "Failed to save session" },
      { status: 500 }
    );
  }

  try {
    const result = await generateConstellation(topic, answers);

    const { error: updateErr } = await supabase
      .from("quiz_sessions")
      .update({
        constellation: result.constellation,
        profile_summary: result.profile_summary,
        status: "complete",
      })
      .eq("id", session.id);

    if (updateErr) {
      console.error("Supabase update failed:", updateErr);
    }

    return NextResponse.json({
      session_id: session.id,
      profile_summary: result.profile_summary,
      constellation: result.constellation,
    });
  } catch (err) {
    console.error("Constellation generation failed:", err);
    await supabase
      .from("quiz_sessions")
      .update({ status: "failed" })
      .eq("id", session.id);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Constellation generation failed",
      },
      { status: 500 }
    );
  }
}
