import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { setServerUser, isValidEmail } from "@/lib/user";
import { SubmitButton } from "./SubmitButton";
import { PhoneField } from "./PhoneField";

async function submitIdentity(formData: FormData) {
  "use server";
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

export default async function StartPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  return (
    <main className="mx-auto w-full max-w-[480px] px-6 py-20 sm:py-28 min-h-[calc(100vh-3rem)] flex flex-col justify-center">
      {/* Branding */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-none mb-4">
          Self<em>ish</em>
        </h1>
        <p className="text-lg sm:text-xl font-serif text-neutral-500 leading-snug">
          Find out who you are by encountering what you are not.
        </p>
      </div>

      {/* Form */}
      <form action={submitIdentity} className="space-y-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
            Name
          </label>
          <input
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition placeholder:text-neutral-300"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3.5 border border-neutral-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition placeholder:text-neutral-300"
            placeholder="you@example.com"
          />
        </div>

        <PhoneField />

        {error === "invalid" && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
            Please enter a valid name (2+ chars) and email.
          </div>
        )}
        {error === "db" && (
          <div className="text-sm text-red-600 bg-red-50 px-4 py-2.5 rounded-lg">
            Couldn&rsquo;t save — try again in a moment.
          </div>
        )}

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>

      <div className="mt-10 text-center text-xs text-neutral-400">
        Already taken a quiz?{" "}
        <Link href="/profile" className="underline underline-offset-4 hover:text-neutral-600 transition-colors">
          View your profile
        </Link>
      </div>

      <footer className="mt-auto pt-12 text-center">
        <p className="text-[11px] text-neutral-300">
          There are no right answers. Only yours.
        </p>
      </footer>
    </main>
  );
}
