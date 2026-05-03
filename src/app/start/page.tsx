import { redirect } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { setServerUser, isValidEmail } from "@/lib/user";

async function submitIdentity(formData: FormData) {
  "use server";
  const rawName = (formData.get("name") as string | null)?.trim() ?? "";
  const rawEmail = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";

  if (rawName.length < 2 || !isValidEmail(rawEmail)) {
    redirect("/start?error=invalid");
  }

  const { error } = await supabase
    .from("users")
    .upsert({ email: rawEmail, name: rawName }, { onConflict: "email" });

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
    <main className="mx-auto max-w-md px-6 py-20 sm:py-28">
      <h1 className="text-5xl sm:text-6xl font-serif tracking-tight leading-none mb-6">
        Self<em>ish</em>
      </h1>
      <p className="text-xl sm:text-2xl font-serif text-neutral-800 leading-snug mb-4">
        Find out who you are by encountering what you are not.
      </p>
      <p className="text-base text-neutral-600 leading-relaxed mb-10">
        Tell us how you think and we&rsquo;ll show you who thinks like you&hellip;and who doesn&rsquo;t.
      </p>

      <form action={submitIdentity} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Name
          </label>
          <input
            name="name"
            type="text"
            required
            minLength={2}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900"
            placeholder="you@example.com"
          />
        </div>

        {error === "invalid" && (
          <div className="text-sm text-red-600">
            Please enter a valid name (2+ chars) and email.
          </div>
        )}
        {error === "db" && (
          <div className="text-sm text-red-600">
            Couldn&rsquo;t save — try again in a moment.
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition"
        >
          Let&rsquo;s go →
        </button>
      </form>

      <div className="mt-8 text-center text-xs text-neutral-500">
        Already taken a quiz before?{" "}
        <Link href="/profile" className="underline underline-offset-4">
          View your profile
        </Link>
      </div>
    </main>
  );
}
