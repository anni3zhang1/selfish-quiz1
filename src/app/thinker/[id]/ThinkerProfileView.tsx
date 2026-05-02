"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { getRelationship } from "@/lib/relationships";
import type { RelationshipType, ThinkerProfileData } from "@/lib/types";

type Props = {
  sessionId: string;
  thinkerSlug: string;
  thinkerName: string;
  relationship: RelationshipType;
  tagline: string | null;
  initialProfile: ThinkerProfileData | null;
};

export default function ThinkerProfileView({
  sessionId,
  thinkerSlug,
  thinkerName,
  relationship,
  tagline,
  initialProfile,
}: Props) {
  const [profile, setProfile] = useState<ThinkerProfileData | null>(initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProfile);
  const triggeredRef = useRef(false);

  const meta = getRelationship(relationship);
  const accent = meta?.hex ?? "#525252";
  const backHref = `/results/${sessionId}`;

  useEffect(() => {
    if (initialProfile || triggeredRef.current) return;
    triggeredRef.current = true;

    setIsLoading(true);
    setError(null);

    fetch("/api/thinker-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        thinker_slug: thinkerSlug,
        thinker_name: thinkerName,
        relationship_type: relationship,
      }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as {
          profile?: ThinkerProfileData;
          error?: string;
        };
        if (!res.ok || !data.profile) {
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }
        setProfile(data.profile);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      })
      .finally(() => setIsLoading(false));
  }, [initialProfile, sessionId, thinkerSlug, thinkerName, relationship]);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      {/* Back link */}
      <div className="mb-8">
        <Link
          href={backHref}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
        >
          ← Back to your constellation
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        {meta && (
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wider mb-4"
            style={{ backgroundColor: `${accent}22`, color: accent }}
          >
            <span>{meta.emoji}</span>
            <span>Your {meta.label}</span>
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-tight mb-3">
          {thinkerName}
        </h1>
        {tagline && (
          <p className="text-lg italic text-neutral-600">{tagline}</p>
        )}
      </header>

      {isLoading && !profile && (
        <div className="py-16 flex flex-col items-center text-center">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-5" />
          <div className="text-lg font-serif mb-2">
            Building {thinkerName}&rsquo;s profile...
          </div>
          <p className="text-sm text-neutral-500">
            This usually takes 30–60 seconds.
          </p>
        </div>
      )}

      {error && !profile && (
        <div className="mb-10 p-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Could not generate this profile.</strong> {error}
        </div>
      )}

      {profile && (
        <div className="space-y-8">
          <Section title="Why You're Matched" accent={accent}>
            <Prose>{profile.why_matched}</Prose>
          </Section>

          <Section title="How They Think" accent={accent}>
            <Prose>{profile.how_they_think}</Prose>
          </Section>

          <Section title="Where They Come From" accent={accent}>
            <Prose>{profile.where_they_come_from}</Prose>
          </Section>

          <Section title="The Ideas That Matter" accent={accent}>
            <ol className="space-y-5">
              {profile.ideas_that_matter.map((idea, i) => (
                <li
                  key={i}
                  className="border-l-2 pl-4"
                  style={{ borderColor: `${accent}55` }}
                >
                  <div className="text-base font-semibold text-neutral-900 mb-1">
                    {idea.claim}
                  </div>
                  <p className="text-sm text-neutral-700 leading-relaxed mb-2">
                    <span className="font-semibold text-neutral-800">Example: </span>
                    {idea.example}
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    <span className="font-semibold text-neutral-800">Why it matters: </span>
                    {idea.why_matters}
                  </p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="What They're Arguing About" accent={accent}>
            <Prose>{profile.what_theyre_arguing}</Prose>
          </Section>

          <Section title="The Tension They Haven't Resolved" accent={accent}>
            <Prose>{profile.internal_tension}</Prose>
          </Section>

          <Section title="Where to Start" accent={accent}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <EntryPoint
                label="To start"
                title={profile.where_to_start.to_start.title}
                why={profile.where_to_start.to_start.why}
                accent={accent}
              />
              <EntryPoint
                label="To go deep"
                title={profile.where_to_start.to_go_deep.title}
                why={profile.where_to_start.to_go_deep.why}
                accent={accent}
              />
              <EntryPoint
                label="Surprising"
                title={profile.where_to_start.surprising.title}
                why={profile.where_to_start.surprising.why}
                accent={accent}
              />
            </div>
          </Section>
        </div>
      )}

      <footer className="mt-16">
        <Link
          href={backHref}
          className="text-sm text-neutral-600 hover:text-neutral-900 underline underline-offset-4"
        >
          ← Back to your constellation
        </Link>
      </footer>
    </main>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-6">
      <h2
        className="text-xs uppercase tracking-wider font-semibold mb-4"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-line">
      {children}
    </p>
  );
}

function EntryPoint({
  label,
  title,
  why,
  accent,
}: {
  label: string;
  title: string;
  why: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        borderColor: `${accent}55`,
        backgroundColor: `${accent}10`,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-wider font-semibold mb-2"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="text-sm font-semibold text-neutral-900 mb-1">
        {title}
      </div>
      <p className="text-xs text-neutral-700 leading-relaxed">{why}</p>
    </div>
  );
}
