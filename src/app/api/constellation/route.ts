import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { AnswerEntry } from "@/lib/types";

export const runtime = "nodejs";

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

  return NextResponse.json({ session_id: session.id });
}
