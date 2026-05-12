import { NextResponse } from "next/server";
import { composeMessage } from "@/lib/composer";

export const runtime = "nodejs";
export const maxDuration = 60; // composer may take a while

type Body = {
  email?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email } = body;
  if (!email) {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  try {
    const message = await composeMessage(email);
    return NextResponse.json(message);
  } catch (err) {
    console.error("Compose failed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to compose message" },
      { status: 500 }
    );
  }
}
