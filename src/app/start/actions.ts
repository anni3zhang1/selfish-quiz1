"use server";

import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { setServerUser, isValidEmail } from "@/lib/user";

export async function submitIdentity(formData: FormData) {
  const rawName = (formData.get("name") as string | null)?.trim() ?? "";
  const rawEmail = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const rawPhone = (formData.get("phone") as string | null)?.trim() || null;

  if (rawName.length < 2 || !isValidEmail(rawEmail)) {
    redirect("/start?error=invalid");
  }

  const { error } = await supabase
    .from("users")
    .upsert(
      { email: rawEmail, name: rawName, ...(rawPhone ? { phone: rawPhone } : {}) },
      { onConflict: "email" }
    );

  if (error) {
    console.error("upsert user failed:", error);
    redirect("/start?error=db");
  }

  await setServerUser({ email: rawEmail, name: rawName });
  redirect("/");
}
