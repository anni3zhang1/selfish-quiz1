import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import type { Constellation, StanceData, UserInsight } from "@/lib/types";

export const runtime = "nodejs";

const TRACK_COLORS = [
  { from: "#A8D8B9", to: "#9AC5F4" },
  { from: "#F4C97E", to: "#F2A7A0" },
  { from: "#9AC5F4", to: "#C4B5FD" },
];

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
    const stanceData = constellation.stance as StanceData | undefined;
    const userInsight = constellation.user_insight as UserInsight | undefined;

    if (!stanceData) {
      return new Response("No stance data", { status: 404 });
    }

    const W = 600;
    const H = 630;

    return new ImageResponse(
      (
        <div
          style={{
            width: W,
            height: H,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "white",
            padding: "40px 40px 32px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: "#a3a3a3", fontWeight: 500, marginBottom: 8 }}>
              Stance
            </div>
            {userInsight && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", fontSize: 28, color: "#171717", fontWeight: 400, lineHeight: 1.2, textAlign: "center" }}>
                  {userInsight.archetype_label}
                </div>
                <div style={{ display: "flex", fontSize: 14, color: "#737373", marginTop: 8, lineHeight: 1.5, textAlign: "center", maxWidth: 440 }}>
                  {userInsight.archetype_description.length > 120
                    ? userInsight.archetype_description.slice(0, 117) + "..."
                    : userInsight.archetype_description}
                </div>
              </div>
            )}
          </div>

          {/* Sliders */}
          <div style={{ display: "flex", flexDirection: "column", gap: 44, flex: 1 }}>
            {stanceData.axes.map((axis, i) => {
              const colors = TRACK_COLORS[i % TRACK_COLORS.length];
              const trackWidth = 520;
              const filledWidth = Math.round((axis.position / 100) * trackWidth);
              const dotLeft = Math.round((axis.position / 100) * trackWidth);

              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Track */}
                  <div style={{ position: "relative", width: trackWidth, height: 10, borderRadius: 5, display: "flex" }}>
                    {/* Background track */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: trackWidth,
                        height: 10,
                        borderRadius: 5,
                        background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                        opacity: 0.35,
                      }}
                    />
                    {/* Filled portion */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: filledWidth,
                        height: 10,
                        borderRadius: 5,
                        background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
                      }}
                    />
                    {/* Dot indicator */}
                    <div
                      style={{
                        position: "absolute",
                        top: -5,
                        left: dotLeft - 10,
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: "white",
                        border: "3px solid #171717",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                      }}
                    />
                  </div>
                  {/* Labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", width: trackWidth }}>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#a3a3a3", fontWeight: 500 }}>
                      {axis.left}
                    </span>
                    <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#a3a3a3", fontWeight: 500 }}>
                      {axis.right}
                    </span>
                  </div>
                  {/* Insight */}
                  <div style={{ display: "flex", fontSize: 13, color: "#737373", fontStyle: "italic", lineHeight: 1.4 }}>
                    {axis.insight}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
            <span style={{ fontSize: 12, color: "#a3a3a3" }}>
              selfish.world
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
