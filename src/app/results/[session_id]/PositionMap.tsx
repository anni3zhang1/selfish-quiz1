"use client";

import Image from "next/image";
import type { PositionMapData } from "@/lib/types";

// Quadrant color palettes — [background, circle dark, circle light, text color]
const QUADRANT_COLORS = {
  top_left:     { bg: "#A8D8B9", text: "#1B4332", circleDark: "#4A6741", circleLight: "#6B8F63" },
  top_right:    { bg: "#9AC5F4", text: "#1A365D", circleDark: "#3B6FA0", circleLight: "#4A7EB8" },
  bottom_left:  { bg: "#F4C97E", text: "#5C3310", circleDark: "#9A7220", circleLight: "#B8862A" },
  bottom_right: { bg: "#F2A7A0", text: "#5C1A1A", circleDark: "#8A3030", circleLight: "#B04040" },
} as const;

type QuadrantKey = keyof typeof QUADRANT_COLORS;

function getQuadrant(x: number, y: number): QuadrantKey {
  if (x < 50 && y < 50) return "top_left";
  if (x >= 50 && y < 50) return "top_right";
  if (x < 50 && y >= 50) return "bottom_left";
  return "bottom_right";
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Clamp coordinates to a safe zone so circles + labels don't bleed outside the grid */
const SAFE_MIN = 10;
const SAFE_MAX = 90;
function clamp(v: number): number {
  return Math.max(SAFE_MIN, Math.min(SAFE_MAX, v));
}

/** Pick a circle color — alternate between dark/light variants per quadrant for variety */
function getCircleColor(x: number, y: number, index: number): string {
  const q = QUADRANT_COLORS[getQuadrant(x, y)];
  return index % 2 === 0 ? q.circleDark : q.circleLight;
}

/** Nudge points apart so circles + labels don't overlap.
 *  Works in percentage space (0-100). MIN_DIST ≈ circle diameter as % of grid. */
function spreadPoints(
  points: { x: number; y: number }[],
  minDist = 12,
  iterations = 8
): { x: number; y: number }[] {
  const out = points.map((p) => ({ x: p.x, y: p.y }));
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const dx = out[j].x - out[i].x;
        const dy = out[j].y - out[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && dist > 0) {
          const push = (minDist - dist) / 2;
          const nx = dx / dist;
          const ny = dy / dist;
          out[i].x -= nx * push;
          out[i].y -= ny * push;
          out[j].x += nx * push;
          out[j].y += ny * push;
          // Re-clamp
          out[i].x = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[i].x));
          out[i].y = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[i].y));
          out[j].x = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[j].x));
          out[j].y = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[j].y));
        } else if (dist === 0) {
          // Exact same position — push apart randomly
          out[j].x = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[j].x + minDist * 0.7));
          out[j].y = Math.max(SAFE_MIN, Math.min(SAFE_MAX, out[j].y + minDist * 0.3));
        }
      }
    }
  }
  return out;
}

export default function PositionMap({
  data,
  topicLabel,
  thumbnails,
  compact,
}: {
  data: PositionMapData;
  topicLabel: string;
  /** name → thumbnail_url mapping from detail data */
  thumbnails?: Record<string, string>;
  /** When true, renders just the map without the card wrapper and header */
  compact?: boolean;
}) {
  // Spread all points (thinkers + user) to avoid overlap
  const allRaw = [...data.thinkers.map((t) => ({ x: t.x, y: t.y })), { x: data.user.x, y: data.user.y }];
  const spread = spreadPoints(allRaw);
  const thinkerPositions = spread.slice(0, data.thinkers.length);
  const userPosition = spread[spread.length - 1];

  const mapSection = (
      <div style={{ padding: compact ? "0" : "0 1rem 1rem", position: "relative" }}>
        <div style={{ position: "relative", width: "100%", paddingTop: compact ? 16 : 32, paddingBottom: compact ? 16 : 32, paddingLeft: 0, paddingRight: 0 }}>

          {/* Y-axis top label */}
          <div style={{ textAlign: "center", marginBottom: 6 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {data.axes.y[0]}
            </span>
          </div>

          {/* The square grid */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", overflow: "hidden", borderRadius: 12 }}>

            {/* Quadrant backgrounds */}
            <div style={{ position: "absolute", top: 0, left: 0, right: "50%", bottom: "50%", background: QUADRANT_COLORS.top_left.bg, borderRadius: "12px 0 0 0", display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: 14 }}>
              <span style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 17, color: QUADRANT_COLORS.top_left.text, lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {data.quadrants.top_left.split(/\s+/).reduce<string[][]>((acc, word) => {
                  const last = acc[acc.length - 1];
                  if (last && last.join(" ").length + word.length < 14) {
                    last.push(word);
                  } else {
                    acc.push([word]);
                  }
                  return acc;
                }, []).map(l => l.join(" ")).join("\n").split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            </div>
            <div style={{ position: "absolute", top: 0, left: "50%", right: 0, bottom: "50%", background: QUADRANT_COLORS.top_right.bg, borderRadius: "0 12px 0 0", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 14 }}>
              <span style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 17, color: QUADRANT_COLORS.top_right.text, textAlign: "right", lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {data.quadrants.top_right.split(/\s+/).reduce<string[][]>((acc, word) => {
                  const last = acc[acc.length - 1];
                  if (last && last.join(" ").length + word.length < 14) {
                    last.push(word);
                  } else {
                    acc.push([word]);
                  }
                  return acc;
                }, []).map(l => l.join(" ")).join("\n").split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            </div>
            <div style={{ position: "absolute", top: "50%", left: 0, right: "50%", bottom: 0, background: QUADRANT_COLORS.bottom_left.bg, borderRadius: "0 0 0 12px", display: "flex", alignItems: "flex-end", justifyContent: "flex-start", padding: 14 }}>
              <span style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 17, color: QUADRANT_COLORS.bottom_left.text, lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {data.quadrants.bottom_left.split(/\s+/).reduce<string[][]>((acc, word) => {
                  const last = acc[acc.length - 1];
                  if (last && last.join(" ").length + word.length < 14) {
                    last.push(word);
                  } else {
                    acc.push([word]);
                  }
                  return acc;
                }, []).map(l => l.join(" ")).join("\n").split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", right: 0, bottom: 0, background: QUADRANT_COLORS.bottom_right.bg, borderRadius: "0 0 12px 0", display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 14 }}>
              <span style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 17, color: QUADRANT_COLORS.bottom_right.text, textAlign: "right", lineHeight: 1.2, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.02em" }}>
                {data.quadrants.bottom_right.split(/\s+/).reduce<string[][]>((acc, word) => {
                  const last = acc[acc.length - 1];
                  if (last && last.join(" ").length + word.length < 14) {
                    last.push(word);
                  } else {
                    acc.push([word]);
                  }
                  return acc;
                }, []).map(l => l.join(" ")).join("\n").split("\n").map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </span>
            </div>

            {/* Axes — SVG overlay */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }} viewBox="0 0 400 400">
              {/* X axis */}
              <line x1="8" y1="200" x2="392" y2="200" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinecap="round" />
              <path d="M16,192 L4,200 L16,208" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M384,192 L396,200 L384,208" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {/* Y axis */}
              <line x1="200" y1="8" x2="200" y2="392" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinecap="round" />
              <path d="M192,16 L200,4 L208,16" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              <path d="M192,384 L200,396 L208,384" fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
            </svg>

            {/* X-axis labels */}
            <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(8px)", fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, color: "#a3a3a3", zIndex: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {data.axes.x[0]}
            </div>
            <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(8px)", fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 9, fontWeight: 700, color: "#a3a3a3", zIndex: 2, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {data.axes.x[1]}
            </div>

            {/* Thinker dots */}
            {data.thinkers.map((t, i) => {
              const thumb = thumbnails?.[t.name];
              const cx = thinkerPositions[i].x;
              const cy = thinkerPositions[i].y;
              const quadrant = getQuadrant(t.x, t.y);
              const textColor = QUADRANT_COLORS[quadrant].text;
              const circleColor = getCircleColor(t.x, t.y, i);

              return (
                <div
                  key={t.name}
                  style={{
                    position: "absolute",
                    left: `${cx}%`,
                    top: `${cy}%`,
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                    textAlign: "center",
                  }}
                >
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: thumb ? undefined : circleColor,
                    border: "2px solid white",
                    margin: "0 auto 2px",
                    overflow: "hidden",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={t.name}
                        width={38}
                        height={38}
                        className="object-cover"
                        style={{ width: 38, height: 38 }}
                      />
                    ) : (
                      <span style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 11, fontWeight: 600, color: "white" }}>
                        {getInitials(t.name)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 600, color: textColor, maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", textAlign: "center" }}>
                    {t.name}
                  </span>
                </div>
              );
            })}

            {/* "You" dot */}
            <div style={{
              position: "absolute",
              left: `${userPosition.x}%`,
              top: `${userPosition.y}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 10,
              textAlign: "center",
            }}>
              <div style={{ position: "relative", width: 48, height: 48, margin: "0 auto" }}>
                <div
                  className="position-map-pulse-ring"
                  style={{
                    position: "absolute",
                    inset: -4,
                    borderRadius: "50%",
                    border: "2px solid rgba(24,95,165,0.25)",
                  }}
                />
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#185FA5",
                  border: "2.5px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 12px rgba(24,95,165,0.4)",
                }}>
                  <span style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 15, color: "white", fontWeight: 400 }}>
                    You
                  </span>
                </div>
              </div>
            </div>

          </div>{/* end square grid */}

          {/* Y-axis bottom label */}
          <div style={{ textAlign: "center", marginTop: 6 }}>
            <span style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 10, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {data.axes.y[1]}
            </span>
          </div>

        </div>
      </div>
  );

  if (compact) {
    return mapSection;
  }

  return (
    <div style={{ maxWidth: 560, width: "100%", margin: "0 auto", background: "white", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: "12px", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "1.5rem 1.5rem 0.75rem" }}>
        <p style={{ fontFamily: "var(--font-space-grotesk), 'Space Grotesk', sans-serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a3a3a3", margin: "0 0 6px", fontWeight: 500 }}>
          Your position map
        </p>
        <p style={{ fontFamily: "var(--font-dm-serif), 'DM Serif Display', serif", fontSize: 22, color: "#171717", margin: 0, fontWeight: 400 }}>
          {topicLabel}
        </p>
      </div>
      {mapSection}
    </div>
  );
}
