import type { RelationshipType } from "./types";

export type RelationshipMeta = {
  key: RelationshipType;
  label: string;
  emoji: string;
  oneLine: string;
  hex: string; // accent color for modal and badges
  faceGradient: string; // tailwind classes for card face
  textOnFace: string; // tailwind text color for the card face
  faceUpBg: string; // light tint background for revealed card
  faceUpTag: string; // darker accent for the tag pill on revealed card
};

export const RELATIONSHIPS: RelationshipMeta[] = [
  {
    key: "mirror",
    label: "Your Mirror",
    emoji: "🪞",
    oneLine: "Thinks like you",
    hex: "#9CA3AF",
    faceGradient: "bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400",
    textOnFace: "text-gray-800",
    faceUpBg: "bg-gray-50",
    faceUpTag: "text-gray-600 border-gray-300 bg-gray-100",
  },
  {
    key: "complement",
    label: "Your Complement",
    emoji: "🧩",
    oneLine: "Fills your gaps",
    hex: "#0D9488",
    faceGradient: "bg-gradient-to-br from-teal-200 via-teal-300 to-teal-400",
    textOnFace: "text-teal-900",
    faceUpBg: "bg-teal-50",
    faceUpTag: "text-teal-700 border-teal-200 bg-teal-100",
  },
  {
    key: "precursor",
    label: "Your Precursor",
    emoji: "🌱",
    oneLine: "Built your foundation",
    hex: "#92400E",
    faceGradient: "bg-gradient-to-br from-amber-200 via-amber-300 to-stone-400",
    textOnFace: "text-amber-900",
    faceUpBg: "bg-amber-50",
    faceUpTag: "text-amber-800 border-amber-200 bg-amber-100",
  },
  {
    key: "antagonist",
    label: "Your Antagonist",
    emoji: "⚔️",
    oneLine: "Challenges you",
    hex: "#B91C1C",
    faceGradient: "bg-gradient-to-br from-red-200 via-red-300 to-red-400",
    textOnFace: "text-red-900",
    faceUpBg: "bg-red-50",
    faceUpTag: "text-red-700 border-red-200 bg-red-100",
  },
  {
    key: "horizon",
    label: "Your Horizon",
    emoji: "🌅",
    oneLine: "Where you're headed",
    hex: "#EA580C",
    faceGradient: "bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400",
    textOnFace: "text-orange-900",
    faceUpBg: "bg-orange-50",
    faceUpTag: "text-orange-700 border-orange-200 bg-orange-100",
  },
  {
    key: "shadow",
    label: "Your Shadow",
    emoji: "🌑",
    oneLine: "What you've buried",
    hex: "#6D28D9",
    faceGradient: "bg-gradient-to-br from-violet-200 via-violet-300 to-violet-400",
    textOnFace: "text-violet-900",
    faceUpBg: "bg-violet-50",
    faceUpTag: "text-violet-700 border-violet-200 bg-violet-100",
  },
  {
    key: "integrated_self",
    label: "Your Integrated Self",
    emoji: "✨",
    oneLine: "Your final form",
    hex: "#B45309",
    faceGradient: "bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-400",
    textOnFace: "text-amber-900",
    faceUpBg: "bg-amber-50",
    faceUpTag: "text-amber-800 border-amber-200 bg-amber-100",
  },
];

export function getRelationship(key: RelationshipType): RelationshipMeta | undefined {
  return RELATIONSHIPS.find((r) => r.key === key);
}
