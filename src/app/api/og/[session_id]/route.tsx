import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import type { Constellation, PositionMapData, UserInsight } from "@/lib/types";

export const runtime = "nodejs";

const QUADRANT_COLORS = {
  top_left:     { bg: "#A8D8B9", text: "#1B4332", circle: "#4A6741" },
  top_right:    { bg: "#9AC5F4", text: "#1A365D", circle: "#3B6FA0" },
  bottom_left:  { bg: "#F4C97E", text: "#5C3310", circle: "#9A7220" },
  bottom_right: { bg: "#F2A7A0", text: "#5C1A1A", circle: "#8A3030" },
} as const;

type QuadrantKey = keyof typeof QUADRANT_COLORS;

function getQuadrant(x: number, y: number): QuadrantKey {
  if (x < 50 && y < 50) return "top_left";
  if (x >= 50 && y < 50) return "top_right";
  if (x < 50 && y >= 50) return "bottom_left";
  return "bottom_right";
}

function getInitials(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

function clamp(v: number): number {
  return Math.max(10, Math.min(90, v));
}

/** Simple collision spread — same logic as the component */
function spreadPoints(points: { x: number; y: number }[], minDist = 12, iterations = 8) {
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
          out[i].x = Math.max(10, Math.min(90, out[i].x - nx * push));
          out[i].y = Math.max(10, Math.min(90, out[i].y - ny * push));
          out[j].x = Math.max(10, Math.min(90, out[j].x + nx * push));
          out[j].y = Math.max(10, Math.min(90, out[j].y + ny * push));
        }
      }
    }
  }
  return out;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ session_id: string }> }
) {
  const { session_id } = await params;

  const { data, error } = await supabase
    .from("quiz_sessions")
    .select("topic, constellation")
    .eq("id", session_id)
    .single();

  if (error || !data?.constellation) {
    return new Response("Not found", { status: 404 });
  }

  const constellation = data.constellation as Constellation;
  const positionMap = constellation.position_map as PositionMapData | undefined;
  const userInsight = constellation.user_insight as UserInsight | undefined;

  if (!positionMap) {
    return new Response("No position map data", { status: 404 });
  }

  // Spread points
  const allRaw = [...positionMap.thinkers.map((t) => ({ x: t.x, y: t.y })), { x: positionMap.user.x, y: positionMap.user.y }];
  const spread = spreadPoints(allRaw);
  const thinkerPositions = spread.slice(0, positionMap.thinkers.length);
  const userPos = spread[spread.length - 1];

  // Collect thumbnail URLs for thinkers
  const thumbs: Record<string, string> = {};
  for (const key of Object.keys(constellation)) {
    if (key === "user_insight" || key === "position_map") continue;
    const card = constellation[key as keyof Constellation];
    if (card && typeof card === "object" && "name" in card && "thumbnail_url" in card && card.thumbnail_url) {
      thumbs[card.name] = card.thumbnail_url;
    }
  }

  const GRID_SIZE = 480;

  return new ImageResponse(
    (
      <div
        style={{
          width: 600,
          height: 630,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          fontFamily: "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", padding: "28px 32px 12px" }}>
          <div style={{ display: "flex", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a3a3a3", fontWeight: 500 }}>
            Stance
          </div>
          {userInsight && (
            <div style={{ display: "flex", flexDirection: "column", marginTop: 6 }}>
              <div style={{ display: "flex", fontSize: 24, color: "#171717", fontWeight: 400, lineHeight: 1.2 }}>
                {userInsight.archetype_label}
              </div>
              <div style={{ display: "flex", fontSize: 13, color: "#737373", marginTop: 4, lineHeight: 1.4 }}>
                {userInsight.archetype_description.length > 100
                  ? userInsight.archetype_description.slice(0, 97) + "..."
                  : userInsight.archetype_description}
              </div>
            </div>
          )}
        </div>

        {/* Map */}
        <div style={{ display: "flex", flexDirection: "column", padding: "0 16px 16px", flex: 1 }}>
          {/* Y top label */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {positionMap.axes.y[0]}
            </span>
          </div>

          {/* Grid */}
          <div style={{ display: "flex", position: "relative", width: GRID_SIZE, height: GRID_SIZE, margin: "0 auto", borderRadius: 12, overflow: "hidden" }}>

            {/* Quadrant backgrounds */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "50%", height: "50%", backgroundColor: QUADRANT_COLORS.top_left.bg, display: "flex", alignItems: "flex-start", justifyContent: "flex-start", padding: 12, borderRadius: "12px 0 0 0" }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.top_left.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.2 }}>
                {positionMap.quadrants.top_left}
              </span>
            </div>
            <div style={{ position: "absolute", top: 0, left: "50%", width: "50%", height: "50%", backgroundColor: QUADRANT_COLORS.top_right.bg, display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 12, borderRadius: "0 12px 0 0" }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.top_right.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.2, textAlign: "right" }}>
                {positionMap.quadrants.top_right}
              </span>
            </div>
            <div style={{ position: "absolute", top: "50%", left: 0, width: "50%", height: "50%", backgroundColor: QUADRANT_COLORS.bottom_left.bg, display: "flex", alignItems: "flex-end", justifyContent: "flex-start", padding: 12, borderRadius: "0 0 0 12px" }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.bottom_left.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.2 }}>
                {positionMap.quadrants.bottom_left}
              </span>
            </div>
            <div style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: "50%", backgroundColor: QUADRANT_COLORS.bottom_right.bg, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 12, borderRadius: "0 0 12px 0" }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.bottom_right.text, textTransform: "uppercase", letterSpacing: "0.02em", lineHeight: 1.2, textAlign: "right" }}>
                {positionMap.quadrants.bottom_right}
              </span>
            </div>

            {/* Axis lines */}
            <svg
              width={GRID_SIZE}
              height={GRID_SIZE}
              viewBox={`0 0 ${GRID_SIZE} ${GRID_SIZE}`}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {/* X axis */}
              <line x1="8" y1={GRID_SIZE / 2} x2={GRID_SIZE - 8} y2={GRID_SIZE / 2} stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
              {/* Y axis */}
              <line x1={GRID_SIZE / 2} y1="8" x2={GRID_SIZE / 2} y2={GRID_SIZE - 8} stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            {/* X-axis labels inside grid */}
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(6px)", display: "flex", fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {positionMap.axes.x[0]}
            </div>
            <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(6px)", display: "flex", fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {positionMap.axes.x[1]}
            </div>

            {/* Thinker dots */}
            {positionMap.thinkers.map((t, i) => {
              const pos = thinkerPositions[i];
              const cx = clamp(pos.x);
              const cy = clamp(pos.y);
              const q = getQuadrant(t.x, t.y);
              const circleColor = QUADRANT_COLORS[q].circle;
              const textColor = QUADRANT_COLORS[q].text;
              const thumb = thumbs[t.name];

              return (
                <div
                  key={t.name}
                  style={{
                    position: "absolute",
                    left: `${cx}%`,
                    top: `${cy}%`,
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      backgroundColor: thumb ? undefined : circleColor,
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                    }}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt={t.name}
                        width={38}
                        height={38}
                        style={{ width: 38, height: 38, objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>
                        {getInitials(t.name)}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: textColor, marginTop: 2 }}>
                    {t.name}
                  </span>
                </div>
              );
            })}

            {/* "You" dot */}
            <div
              style={{
                position: "absolute",
                left: `${clamp(userPos.x)}%`,
                top: `${clamp(userPos.y)}%`,
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  backgroundColor: "#185FA5",
                  border: "3px solid white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 3px 12px rgba(24,95,165,0.4)",
                }}
              >
                <span style={{ fontSize: 16, color: "white", fontWeight: 400 }}>
                  You
                </span>
              </div>
            </div>

          </div>{/* end grid */}

          {/* Y bottom label */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {positionMap.axes.y[1]}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 32px 20px" }}>
          <span style={{ fontSize: 12, color: "#a3a3a3" }}>
            selfish-quiz1.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 600,
      height: 630,
    }
  );
}
