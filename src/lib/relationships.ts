import type { RelationshipType } from "./types";

export type RelationshipMeta = {
  key: RelationshipType;
  label: string; // shown on face-down card (e.g. "YOUR REFLECTION")
  shortName: string; // 1-word internal/legend label (e.g. "Mirror")
  oneLine: string; // shown beneath label, also used in lists
  emoji: string;
  // Card face background — either Tailwind classes or inline gradient
  faceBg: string;
  // Color used for backdrop tints (modal background) — needs to be opacity-friendly hex
  hex: string;
};

export const RELATIONSHIPS: RelationshipMeta[] = [
  {
    key: "mirror",
    label: "YOUR REFLECTION",
    shortName: "Mirror",
    oneLine: "This is you — somewhere else entirely.",
    emoji: "🪞",
    faceBg: "bg-[#C0C0C0]",
    hex: "#C0C0C0",
  },
  {
    key: "complement",
    label: "YOUR BLIND SPOT",
    shortName: "Complement",
    oneLine: "This is what you don't naturally carry.",
    emoji: "🧩",
    faceBg: "bg-[#00897B]",
    hex: "#00897B",
  },
  {
    key: "precursor",
    label: "YOUR ROOT",
    shortName: "Precursor",
    oneLine: "This is where your thinking came from.",
    emoji: "🌱",
    faceBg: "bg-[#8D6E63]",
    hex: "#8D6E63",
  },
  {
    key: "antagonist",
    label: "YOUR SHARPENER",
    shortName: "Antagonist",
    oneLine: "This is the strongest case against you.",
    emoji: "⚔️",
    faceBg: "bg-[#C62828]",
    hex: "#C62828",
  },
  {
    key: "horizon",
    label: "YOUR NEXT STEP",
    shortName: "Horizon",
    oneLine: "This is one step further than you've gone.",
    emoji: "🌅",
    faceBg: "bg-gradient-to-br from-[#FF7043] to-[#FFA726]",
    hex: "#FF7043",
  },
  {
    key: "shadow",
    label: "YOUR DISMISSAL",
    shortName: "Shadow",
    oneLine: "This is what you've been too quick to ignore.",
    emoji: "🌑",
    faceBg: "bg-[#4A148C]",
    hex: "#4A148C",
  },
  {
    key: "integrated_self",
    label: "YOUR DESTINATION",
    shortName: "Integrated Self",
    oneLine: "This is who you're becoming.",
    emoji: "✨",
    faceBg: "bg-gradient-to-br from-[#F9A825] to-[#FFD54F]",
    hex: "#F9A825",
  },
];

// Reveal order matches the spec; pulse indicator follows this list.
export const REVEAL_ORDER: RelationshipType[] = [
  "precursor",
  "mirror",
  "complement",
  "antagonist",
  "shadow",
  "horizon",
  "integrated_self",
];

// Spatial coordinates relative to user-card center (pixels). Desktop only.
export const SPATIAL_OFFSETS: Record<RelationshipType, { x: number; y: number }> = {
  mirror: { x: 280, y: 0 },
  complement: { x: 200, y: 200 },
  precursor: { x: 0, y: 280 },
  antagonist: { x: -280, y: 0 },
  horizon: { x: 0, y: -200 },
  shadow: { x: 0, y: 60 },
  integrated_self: { x: 0, y: -360 },
};

// Slight rotation per card for "placed not printed" feel.
export const SPATIAL_ROTATIONS: Record<RelationshipType, number> = {
  mirror: 2,
  complement: -2,
  precursor: 1.5,
  antagonist: -1.5,
  horizon: 2,
  shadow: 0,
  integrated_self: -1,
};

export function getRelationship(
  key: RelationshipType
): RelationshipMeta | undefined {
  return RELATIONSHIPS.find((r) => r.key === key);
}
