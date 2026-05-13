import type { RelationshipType } from "./types";

export type RelationshipMeta = {
  key: RelationshipType;
  label: string;
  emoji: string;
  oneLine: string;
  hex: string; // accent color for modal and badges
  faceGradient: string; // tailwind classes for card face
  textOnFace: string; // tailwind text color for the card face
};

export const RELATIONSHIPS: RelationshipMeta[] = [
  {
    key: "mirror",
    label: "Mirror",
    emoji: "🪞",
    oneLine: "Thinks like you",
    hex: "#9CA3AF",
    faceGradient: "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500",
    textOnFace: "text-gray-900",
  },
  {
    key: "complement",
    label: "Complement",
    emoji: "🧩",
    oneLine: "Fills your gaps",
    hex: "#0D9488",
    faceGradient: "bg-gradient-to-br from-teal-500 via-teal-600 to-teal-800",
    textOnFace: "text-teal-50",
  },
  {
    key: "precursor",
    label: "Precursor",
    emoji: "🌱",
    oneLine: "Built your foundation",
    hex: "#92400E",
    faceGradient: "bg-gradient-to-br from-amber-600 via-amber-800 to-stone-800",
    textOnFace: "text-amber-50",
  },
  {
    key: "antagonist",
    label: "Antagonist",
    emoji: "⚔️",
    oneLine: "Challenges you",
    hex: "#B91C1C",
    faceGradient: "bg-gradient-to-br from-red-600 via-red-700 to-red-950",
    textOnFace: "text-red-50",
  },
  {
    key: "horizon",
    label: "Horizon",
    emoji: "🌅",
    oneLine: "Where you're headed",
    hex: "#EA580C",
    faceGradient: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-900",
    textOnFace: "text-orange-50",
  },
  {
    key: "shadow",
    label: "Shadow",
    emoji: "🌑",
    oneLine: "What you've buried",
    hex: "#6D28D9",
    faceGradient: "bg-gradient-to-br from-violet-600 via-violet-700 to-violet-950",
    textOnFace: "text-violet-50",
  },
  {
    key: "integrated_self",
    label: "Integrated Self",
    emoji: "✨",
    oneLine: "Your final form",
    hex: "#B45309",
    faceGradient: "bg-gradient-to-br from-amber-500 via-amber-700 to-yellow-800",
    textOnFace: "text-amber-50",
  },
];

export function getRelationship(key: RelationshipType): RelationshipMeta | undefined {
  return RELATIONSHIPS.find((r) => r.key === key);
}
