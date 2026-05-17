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
  try {
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

    // Spread points to avoid overlaps
    const allRaw = [...positionMap.thinkers.map((t) => ({ x: t.x, y: t.y })), { x: positionMap.user.x, y: positionMap.user.y }];
    const spread = spreadPoints(allRaw);
    const thinkerPositions = spread.slice(0, positionMap.thinkers.length);
    const userPos = spread[spread.length - 1];

    const W = 600;
    const H = 630;
    const GRID = 480;
    const GRID_LEFT = (W - GRID) / 2;

    return new ImageResponse(
      (
        <div
          style={{
            width: W,
            height: H,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", padding: "28px 32px 14px" }}>
            <div style={{ display: "flex", fontSize: 11, textTransform: "uppercase", letterSpacing: 1.5, color: "#a3a3a3", fontWeight: 500 }}>
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

          {/* Y top label */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: 1, textTransform: "uppercase" }}>
              {positionMap.axes.y[0]}
            </span>
          </div>

          {/* Grid container */}
          <div style={{ display: "flex", position: "relative", width: GRID, height: GRID, marginLeft: GRID_LEFT, borderRadius: 12, overflow: "hidden" }}>

            {/* Quadrant backgrounds — 4 absolute divs */}
            <div style={{ position: "absolute", top: 0, left: 0, width: GRID / 2, height: GRID / 2, backgroundColor: QUADRANT_COLORS.top_left.bg, display: "flex", padding: 12 }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.top_left.text, textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.2 }}>
                {positionMap.quadrants.top_left}
              </span>
            </div>
            <div style={{ position: "absolute", top: 0, left: GRID / 2, width: GRID / 2, height: GRID / 2, backgroundColor: QUADRANT_COLORS.top_right.bg, display: "flex", justifyContent: "flex-end", padding: 12 }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.top_right.text, textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.2, textAlign: "right" }}>
                {positionMap.quadrants.top_right}
              </span>
            </div>
            <div style={{ position: "absolute", top: GRID / 2, left: 0, width: GRID / 2, height: GRID / 2, backgroundColor: QUADRANT_COLORS.bottom_left.bg, display: "flex", alignItems: "flex-end", padding: 12 }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.bottom_left.text, textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.2 }}>
                {positionMap.quadrants.bottom_left}
              </span>
            </div>
            <div style={{ position: "absolute", top: GRID / 2, left: GRID / 2, width: GRID / 2, height: GRID / 2, backgroundColor: QUADRANT_COLORS.bottom_right.bg, display: "flex", alignItems: "flex-end", justifyContent: "flex-end", padding: 12 }}>
              <span style={{ fontSize: 14, color: QUADRANT_COLORS.bottom_right.text, textTransform: "uppercase", letterSpacing: 0.3, lineHeight: 1.2, textAlign: "right" }}>
                {positionMap.quadrants.bottom_right}
              </span>
            </div>

            {/* Axis lines — thin divs instead of SVG */}
            <div style={{ position: "absolute", top: GRID / 2 - 1, left: 8, width: GRID - 16, height: 2, backgroundColor: "#d4d4d4" }} />
            <div style={{ position: "absolute", top: 8, left: GRID / 2 - 1, width: 2, height: GRID - 16, backgroundColor: "#d4d4d4" }} />

            {/* X-axis labels */}
            <div style={{ position: "absolute", left: 12, top: GRID / 2 + 6, display: "flex", fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: 1, textTransform: "uppercase" }}>
              {positionMap.axes.x[0]}
            </div>
            <div style={{ position: "absolute", right: 12, top: GRID / 2 + 6, display: "flex", fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: 1, textTransform: "uppercase" }}>
              {positionMap.axes.x[1]}
            </div>

            {/* Thinker dots — initials only (no external images for reliability) */}
            {positionMap.thinkers.map((t, i) => {
              const pos = thinkerPositions[i];
              const cx = clamp(pos.x);
              const cy = clamp(pos.y);
              const q = getQuadrant(t.x, t.y);
              const circleColor = QUADRANT_COLORS[q].circle;
              const textColor = QUADRANT_COLORS[q].text;
              // Convert percentage to pixels for absolute positioning
              const pxLeft = Math.round((cx / 100) * GRID);
              const pxTop = Math.round((cy / 100) * GRID);

              return (
                <div
                  key={t.name}
                  style={{
                    position: "absolute",
                    left: pxLeft - 19,
                    top: pxTop - 25,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 38,
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: circleColor,
                      border: "2px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 600, color: "white" }}>
                      {getInitials(t.name)}
                    </span>
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 600, color: textColor, marginTop: 2, textAlign: "center" }}>
                    {t.name}
                  </span>
                </div>
              );
            })}

            {/* "You" dot */}
            {(() => {
              const pxLeft = Math.round((clamp(userPos.x) / 100) * GRID);
              const pxTop = Math.round((clamp(userPos.y) / 100) * GRID);
              return (
                <div
                  style={{
                    position: "absolute",
                    left: pxLeft - 22,
                    top: pxTop - 22,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 44,
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: "#185FA5",
                      border: "3px solid white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 16, color: "white", fontWeight: 400 }}>
                      You
                    </span>
                  </div>
                </div>
              );
            })()}

          </div>{/* end grid */}

          {/* Y bottom label */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: "#a3a3a3", letterSpacing: 1, textTransform: "uppercase" }}>
              {positionMap.axes.y[1]}
            </span>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 32px 16px" }}>
            <span style={{ fontSize: 12, color: "#a3a3a3" }}>
              stance.vercel.app
            </span>
          </div>
        </div>
      ),
      {
        width: W,
        height: H,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
        },
      }
    );
  } catch (err) {
    console.error("[og] Image generation failed:", err);
    return new Response(
      `Image generation error: ${err instanceof Error ? err.message : String(err)}`,
      { status: 500 }
    );
  }
}
