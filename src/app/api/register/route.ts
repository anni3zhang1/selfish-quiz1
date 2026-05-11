import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

type Body = {
  name?: string;
  email?: string;
  phone?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const phone = body.phone?.trim() || null;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Name must be 2+ characters" }, { status: 400 });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Upsert user (update name/phone if they already exist)
  const { error: upsertErr } = await supabase
    .from("users")
    .upsert(
      { email, name, ...(phone ? { phone } : {}) },
      { onConflict: "email" }
    );

  if (upsertErr) {
    console.error("User upsert failed:", upsertErr);
    return NextResponse.json({ error: "Failed to save user" }, { status: 500 });
  }

  // Set identity cookies
  const ONE_YEAR = 60 * 60 * 24 * 365;
  const c = await cookies();
  c.set("selfish_email", email, {
    maxAge: ONE_YEAR,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
  c.set("selfish_name", name, {
    maxAge: ONE_YEAR,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ ok: true });
}
