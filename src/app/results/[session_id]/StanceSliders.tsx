"use client";

import type { StanceData } from "@/lib/types";

// Gradient stops for the slider track
const TRACK_COLORS = [
  { from: "#A8D8B9", to: "#9AC5F4" },  // green → blue
  { from: "#F4C97E", to: "#F2A7A0" },  // gold → rose
  { from: "#9AC5F4", to: "#C4B5FD" },  // blue → violet
];

export default function StanceSliders({
  data,
  topicLabel,
  archetypeLabel,
  archetypeDescription,
  compact,
}: {
  data: StanceData;
  topicLabel: string;
  archetypeLabel?: string;
  archetypeDescription?: string;
  /** When true, hides outer card wrapper */
  compact?: boolean;
}) {
  const content = (
    <div style={{ display: "flex", flexDirection: "column", gap: 28, width: "100%" }}>
      {data.axes.map((axis, i) => {
        const colors = TRACK_COLORS[i % TRACK_COLORS.length];
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {/* Slider track */}
            <div style={{ position: "relative", width: "100%", height: 8, borderRadius: 4, overflow: "hidden" }}>
              {/* Track background */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                  opacity: 0.4,
                  borderRadius: 4,
                }}
              />
              {/* Filled portion */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: `${axis.position}%`,
                  background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                  borderRadius: 4,
                }}
              />
              {/* Dot indicator */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: `${axis.position}%`,
                  transform: "translate(-50%, -50%)",
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  backgroundColor: "white",
                  border: "3px solid #171717",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                  zIndex: 2,
                }}
              />
            </div>
            {/* Axis labels */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium" style={{ maxWidth: "40%" }}>
                {axis.left}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-medium text-right" style={{ maxWidth: "40%" }}>
                {axis.right}
              </span>
            </div>
            {/* Insight */}
            <p className="text-xs text-neutral-500 leading-relaxed italic" style={{ marginTop: -2 }}>
              {axis.insight}
            </p>
          </div>
        );
      })}
    </div>
  );

  if (compact) return content;

  return (
    <div style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
      {/* Header */}
      {archetypeLabel && (
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
            {topicLabel}
          </p>
          <h2 className="text-2xl font-serif tracking-tight text-neutral-900 leading-snug">
            {archetypeLabel}
          </h2>
          {archetypeDescription && (
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-[360px] mx-auto">
              {archetypeDescription}
            </p>
          )}
        </div>
      )}
      {content}
    </div>
  );
}
