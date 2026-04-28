import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/user";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const [{ data: user }, { data: sessions }] = await Promise.all([
    supabase.from("users").select("name, email, created_at").eq("email", email).maybeSingle(),
    supabase
      .from("quiz_sessions")
      .select("id, topic, profile_summary, constellation, status, created_at")
      .eq("email", email)
      .eq("status", "complete")
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    user: user ?? null,
    sessions: sessions ?? [],
  });
}
