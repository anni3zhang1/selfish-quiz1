"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getRelationship } from "@/lib/relationships";
import type {
  RelationshipType,
  ThinkerProfileData,
  ThinkerArgument,
  ThinkerImpact,
  ThinkerQuestion,
  ThinkerTension,
} from "@/lib/types";

type Props = {
  sessionId: string;
  thinkerSlug: string;
  thinkerName: string;
  relationship: RelationshipType;
  tagline: string | null;
  thumbnailUrl: string | null;
  initialProfile: ThinkerProfileData | null;
};

type PartialProfile = Partial<ThinkerProfileData>;

type StreamChunk =
  | {
      section: "static";
      what_they_believe: string;
      core_arguments: ThinkerArgument[];
      where_they_come_from: string;
      how_they_think: string;
      tension: ThinkerTension;
      who_they_impact: ThinkerImpact[];
      wikipedia_image_url: string;
    }
  | {
      section: "dynamic";
      why_matched: string;
      questions_worth_sitting_with: ThinkerQuestion[];
      you_impact: string;
    }
  | { section: "error"; error: string };

function firstSentence(text: string): string {
  const m = text.match(/[^.!?]*[.!?]/);
  return m ? m[0].trim() : text.slice(0, 120).trim();
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden
      className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SectionSkeleton({ accentColor = "#e5e7eb" }: { accentColor?: string }) {
  return (
    <div
      className="rounded-2xl border overflow-hidden animate-pulse"
      style={{ borderColor: `${accentColor}33` }}
    >
      <div className="px-6 py-4" style={{ backgroundColor: `${accentColor}0d` }}>
        <div className="h-2.5 w-28 rounded-full mb-3" style={{ backgroundColor: `${accentColor}55` }} />
        <div className="space-y-2">
          <div className="h-3.5 w-full rounded" style={{ backgroundColor: `${accentColor}22` }} />
          <div className="h-3.5 w-5/6 rounded" style={{ backgroundColor: `${accentColor}22` }} />
          <div className="h-3.5 w-2/3 rounded" style={{ backgroundColor: `${accentColor}22` }} />
        </div>
      </div>
    </div>
  );
}

export default function ThinkerProfileView({
  sessionId,
  thinkerSlug,
  thinkerName,
  relationship,
  tagline,
  thumbnailUrl,
  initialProfile,
}: Props) {
  const [profile, setProfile] = useState<PartialProfile | null>(initialProfile);
  const [imageUrl, setImageUrl] = useState<string | null>(thumbnailUrl);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialProfile);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const triggeredRef = useRef(false);

  const meta = getRelationship(relationship);
  const accent = meta?.hex ?? "#525252";
  const backHref = `/results/${sessionId}`;

  function toggleSection(id: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  useEffect(() => {
    if (initialProfile || triggeredRef.current) return;
    triggeredRef.current = true;

    setIsLoading(true);
    setError(null);

    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch("/api/thinker-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            thinker_slug: thinkerSlug,
            thinker_name: thinkerName,
            relationship_type: relationship,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }

        const contentType = res.headers.get("content-type") ?? "";

        if (contentType.includes("x-ndjson") && res.body) {
          // Streaming path — sections arrive progressively
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              let chunk: StreamChunk;
              try {
                chunk = JSON.parse(line) as StreamChunk;
              } catch {
                continue; // skip malformed lines
              }

              if (chunk.section === "static") {
                setProfile((prev) => ({
                  ...prev,
                  what_they_believe: chunk.what_they_believe,
                  core_arguments: chunk.core_arguments,
                  where_they_come_from: chunk.where_they_come_from,
                  how_they_think: chunk.how_they_think,
                  tension: chunk.tension,
                  who_they_impact: chunk.who_they_impact,
                }));
                if (chunk.wikipedia_image_url) setImageUrl(chunk.wikipedia_image_url);
                setIsLoading(false);
                setIsStreaming(true);
              } else if (chunk.section === "dynamic") {
                setProfile((prev) => ({
                  ...prev,
                  why_matched: chunk.why_matched,
                  questions_worth_sitting_with: chunk.questions_worth_sitting_with,
                  who_they_impact: [
                    ...(prev?.who_they_impact ?? []),
                    { group: "You", impact: chunk.you_impact },
                  ],
                }));
                setIsStreaming(false);
              } else if (chunk.section === "error") {
                throw new Error(chunk.error);
              }
            }
          }
        } else {
          // Full JSON path — session cache hit or full cache miss
          const data = (await res.json()) as { profile?: ThinkerProfileData; error?: string };
          if (!data.profile) throw new Error(data.error ?? "No profile in response");
          setProfile(data.profile);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    })();

    return () => controller.abort();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasStatic = !!(profile?.what_they_believe);
  const hasDynamic = !!(profile?.why_matched);

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

      {/* Header — always visible */}
      <header className="mb-10">
        <div className="flex items-center gap-5 mb-5">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={thinkerName}
              width={96}
              height={96}
              className="rounded-full object-cover w-24 h-24 ring-2 ring-neutral-300 shadow-md shrink-0"
            />
          )}
          <div className="min-w-0">
            {meta && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ backgroundColor: `${accent}22`, color: accent }}
              >
                <span>{meta.emoji}</span>
                <span>Your {meta.label}</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-serif tracking-tight leading-tight">
              {thinkerName}
            </h1>
          </div>
        </div>
        {tagline && (
          <p className="text-lg italic text-neutral-600 leading-relaxed">{tagline}</p>
        )}
      </header>

      {/* Full-page spinner — only before any content arrives */}
      {isLoading && !profile && (
        <div className="py-16 flex flex-col items-center text-center">
          <div className="w-10 h-10 border-2 border-neutral-300 border-t-neutral-700 rounded-full animate-spin mb-5" />
          <div className="text-lg font-serif mb-2">
            Building {thinkerName}&rsquo;s profile...
          </div>
          <p className="text-sm text-neutral-500">This usually takes a few seconds.</p>
        </div>
      )}

      {error && !profile && (
        <div className="mb-10 p-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <strong>Could not generate this profile.</strong> {error}
        </div>
      )}

      {/* Progressive sections */}
      {(hasStatic || hasDynamic || isStreaming) && (
        <div className="space-y-4">

          {/* Why You're Matched — skeleton while waiting for dynamic chunk */}
          {hasDynamic ? (
            <section
              className="rounded-2xl border p-6"
              style={{ borderColor: `${accent}55`, backgroundColor: `${accent}10` }}
            >
              <div
                className="text-xs uppercase tracking-wider font-semibold mb-3"
                style={{ color: accent }}
              >
                Why You&rsquo;re Matched
              </div>
              <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                {profile!.why_matched}
              </p>
            </section>
          ) : isStreaming ? (
            <SectionSkeleton accentColor={accent} />
          ) : null}

          {/* Who They Impact — grows when "You" entry arrives with dynamic chunk */}
          {profile?.who_they_impact && profile.who_they_impact.length > 0 && (
            <section>
              <div className="text-xs uppercase tracking-wider font-semibold text-neutral-500 mb-3 px-1">
                Who {thinkerName.split(" ").pop()} Impacts
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                {profile.who_they_impact.map((item, i) => (
                  <div
                    key={i}
                    className="shrink-0 w-48 rounded-xl border border-neutral-200 bg-white p-4 flex flex-col"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {item.emoji && <span className="text-lg leading-none">{item.emoji}</span>}
                      <span className="text-sm font-semibold text-neutral-900 leading-snug">
                        {item.group}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">{item.impact}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Static accordion sections */}
          {hasStatic ? (
            <>
              <AccordionSection
                id="what_they_believe"
                title="What They Believe"
                teaser={firstSentence(profile!.what_they_believe!)}
                open={openSections.has("what_they_believe")}
                onToggle={toggleSection}
                accentColor={accent}
              >
                <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                  {profile!.what_they_believe}
                </p>
              </AccordionSection>

              <AccordionSection
                id="core_arguments"
                title="Core Arguments"
                teaser={profile!.core_arguments![0]?.claim ?? ""}
                open={openSections.has("core_arguments")}
                onToggle={toggleSection}
                accentColor={accent}
              >
                <ol className="space-y-7">
                  {profile!.core_arguments!.map((arg, i) => (
                    <li key={i} className="border-l-2 pl-5" style={{ borderColor: `${accent}55` }}>
                      <div className="text-base font-semibold text-neutral-900 mb-2 leading-snug">
                        {arg.claim}
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed mb-3 pl-3 border-l border-neutral-200">
                        {arg.example}
                      </p>
                      <p className="text-sm italic leading-relaxed" style={{ color: accent }}>
                        Why it matters to you: {arg.why_it_matters}
                      </p>
                    </li>
                  ))}
                </ol>
              </AccordionSection>

              <AccordionSection
                id="where_they_come_from"
                title="Where They Come From"
                teaser={firstSentence(profile!.where_they_come_from!)}
                open={openSections.has("where_they_come_from")}
                onToggle={toggleSection}
                accentColor={accent}
              >
                <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                  {profile!.where_they_come_from}
                </p>
              </AccordionSection>

              <AccordionSection
                id="how_they_think"
                title="How They Think"
                teaser={firstSentence(profile!.how_they_think!)}
                open={openSections.has("how_they_think")}
                onToggle={toggleSection}
                accentColor={accent}
              >
                <p className="text-base text-neutral-800 leading-relaxed whitespace-pre-line">
                  {profile!.how_they_think}
                </p>
              </AccordionSection>

              <AccordionSection
                id="tension"
                title="The Tension"
                teaser={profile!.tension!.belief_a}
                open={openSections.has("tension")}
                onToggle={toggleSection}
                accentColor="#d97706"
                headerVariant="tension"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <p className="text-base font-medium text-neutral-900 leading-relaxed max-w-prose">
                    {profile!.tension!.belief_a}
                  </p>
                  <div className="text-3xl leading-none text-amber-600" aria-hidden>
                    ↔
                  </div>
                  <p className="text-base font-medium text-neutral-900 leading-relaxed max-w-prose">
                    {profile!.tension!.belief_b}
                  </p>
                </div>
                <p className="mt-6 text-sm text-neutral-500 leading-relaxed text-center italic">
                  {profile!.tension!.explanation}
                </p>
              </AccordionSection>
            </>
          ) : isStreaming ? (
            <>
              <SectionSkeleton accentColor={accent} />
              <SectionSkeleton accentColor={accent} />
              <SectionSkeleton accentColor={accent} />
            </>
          ) : null}

          {/* Questions Worth Sitting With */}
          {profile?.questions_worth_sitting_with ? (
            <AccordionSection
              id="questions"
              title="Questions Worth Sitting With"
              teaser={profile.questions_worth_sitting_with[0]?.question ?? ""}
              open={openSections.has("questions")}
              onToggle={toggleSection}
              accentColor={accent}
            >
              <div className="space-y-5">
                {profile.questions_worth_sitting_with.map((q, i) => (
                  <div key={i} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="text-lg font-bold text-neutral-900 leading-snug mb-3">
                      {q.question}
                    </div>
                    <p className="text-sm italic text-neutral-500 leading-relaxed mb-2">
                      What you said: {q.what_you_said}
                    </p>
                    <p className="text-sm text-neutral-800 leading-relaxed">
                      <span className="font-semibold">How {thinkerName} sees it: </span>
                      {q.how_thinker_sees_it}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionSection>
          ) : isStreaming ? (
            <SectionSkeleton accentColor={accent} />
          ) : null}

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

type AccordionSectionProps = {
  id: string;
  title: string;
  teaser: string;
  open: boolean;
  onToggle: (id: string) => void;
  accentColor: string;
  headerVariant?: "default" | "tension";
  children: React.ReactNode;
};

function AccordionSection({
  id,
  title,
  teaser,
  open,
  onToggle,
  accentColor,
  headerVariant = "default",
  children,
}: AccordionSectionProps) {
  const isTension = headerVariant === "tension";
  const headerBg = isTension ? "#fef3c7" : `${accentColor}0d`;
  const headerBorder = isTension ? "#fde68a" : `${accentColor}33`;
  const titleColor = isTension ? "#92400e" : accentColor;

  return (
    <section className="rounded-2xl border overflow-hidden" style={{ borderColor: headerBorder }}>
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={open}
        className="w-full text-left px-6 py-4 flex items-start gap-3 transition-colors"
        style={{ backgroundColor: headerBg }}
      >
        <div className="flex-1 min-w-0">
          <div
            className="text-xs uppercase tracking-wider font-semibold mb-1"
            style={{ color: titleColor }}
          >
            {title}
          </div>
          {!open && teaser && (
            <p className="text-sm text-neutral-600 leading-snug line-clamp-2">{teaser}</p>
          )}
        </div>
        <div style={{ color: titleColor }} className="mt-0.5">
          <ChevronIcon open={open} />
        </div>
      </button>

      {open && (
        <div className="px-6 py-5 bg-white border-t" style={{ borderColor: headerBorder }}>
          {children}
        </div>
      )}
    </section>
  );
}
