import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Constellation, StanceData, UserInsight } from "@/lib/types";
import { getQuiz } from "@/lib/quizzes";
import StanceSliders from "@/app/results/[session_id]/StanceSliders";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ session_id: string }>;
};

async function getSession(sessionId: string) {
  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("id, topic, constellation, status")
    .eq("id", sessionId)
    .single();

  if (error || !data || data.status !== "complete" || !data.constellation) return null;
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { session_id } = await params;
  const data = await getSession(session_id);

  if (!data) {
    return { title: "Stance" };
  }

  const constellation = data.constellation as Constellation;
  const userInsight = constellation.user_insight as UserInsight | undefined;
  const quiz = getQuiz(data.topic);
  const topicLabel = quiz?.topicLabel ?? data.topic;

  const title = userInsight
    ? `${userInsight.archetype_label} — Stance`
    : `My stance on ${topicLabel}`;
  const description = userInsight?.archetype_description ?? `See where I stand on ${topicLabel}`;

  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://selfish-quiz1.vercel.app"}/api/og/${session_id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: ogImageUrl, width: 600, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function SharePage({ params }: Props) {
  const { session_id } = await params;
  const data = await getSession(session_id);

  if (!data) notFound();

  const constellation = data.constellation as Constellation;
  const stanceData = constellation.stance as StanceData | undefined;
  const userInsight = constellation.user_insight as UserInsight | undefined;
  const quiz = getQuiz(data.topic);
  const topicLabel = quiz?.topicLabel ?? data.topic;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-neutral-50">
      <div className="w-full max-w-[480px] flex flex-col items-center gap-8">

        {/* Archetype */}
        {userInsight ? (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
              Stance
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug text-neutral-900">
              {userInsight.archetype_label}
            </h1>
            <p className="text-sm text-neutral-500 mt-2 max-w-[360px] mx-auto leading-relaxed">
              {userInsight.archetype_description}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
              Stance
            </p>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-tight leading-snug text-neutral-900">
              My stance on {topicLabel}
            </h1>
            <p className="text-sm text-neutral-500 mt-2 max-w-[360px] mx-auto leading-relaxed">
              Take the quiz to discover where you stand and which thinkers align with your worldview.
            </p>
          </div>
        )}

        {/* Stance Sliders */}
        {stanceData && (
          <StanceSliders
            data={stanceData}
            topicLabel={topicLabel}
          />
        )}

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 w-full">
          <Link
            href={`/quiz/${data.topic}`}
            className="inline-flex items-center justify-center gap-2 w-full max-w-[320px] px-6 py-3.5 bg-neutral-900 text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Take this quiz
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            See all quizzes
          </Link>
        </div>

      </div>
    </div>
  );
}
