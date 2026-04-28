import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const { session_id } = await params;

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, topic, profile_summary, constellation, status, created_at")
    .eq("id", session_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
