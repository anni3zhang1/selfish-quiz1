import type { RelationshipType } from "./types";

export type RelationshipMeta = {
  key: RelationshipType;
  label: string;
  emoji: string;
  oneLine: string;
  faceGradient: string; // tailwind classes
  textOnFace: string; // tailwind text color for the face
};

export const RELATIONSHIPS: RelationshipMeta[] = [
  {
    key: "mirror",
    label: "Mirror",
    emoji: "🪞",
    oneLine: "Same way of seeing, different world.",
    faceGradient: "bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400",
    textOnFace: "text-slate-900",
  },
  {
    key: "twin",
    label: "Twin",
    emoji: "👯",
    oneLine: "Same structure, further along in time.",
    faceGradient: "bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600",
    textOnFace: "text-amber-950",
  },
  {
    key: "complement",
    label: "Complement",
    emoji: "🧩",
    oneLine: "Fills what you don't naturally carry.",
    faceGradient: "bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900",
    textOnFace: "text-teal-50",
  },
  {
    key: "precursor",
    label: "Precursor",
    emoji: "🌱",
    oneLine: "Who formed you — still working through.",
    faceGradient: "bg-gradient-to-br from-yellow-700 via-amber-800 to-stone-700",
    textOnFace: "text-amber-50",
  },
  {
    key: "antagonist",
    label: "Antagonist",
    emoji: "⚔️",
    oneLine: "The fight that sharpens your thinking.",
    faceGradient: "bg-gradient-to-br from-red-700 via-red-800 to-red-950",
    textOnFace: "text-red-50",
  },
  {
    key: "horizon",
    label: "Horizon",
    emoji: "🌅",
    oneLine: "One step ahead, currently a stretch.",
    faceGradient:
      "bg-gradient-to-br from-purple-800 via-pink-600 to-orange-500",
    textOnFace: "text-purple-50",
  },
  {
    key: "shadow",
    label: "Shadow",
    emoji: "🌑",
    oneLine: "A way of thinking you've suppressed but recognize.",
    faceGradient: "bg-gradient-to-br from-violet-950 via-violet-900 to-black",
    textOnFace: "text-violet-100",
  },
  {
    key: "integrated_self",
    label: "Integrated Self",
    emoji: "✨",
    oneLine: "Who you're becoming at your best.",
    faceGradient:
      "bg-gradient-to-br from-yellow-100 via-yellow-300 to-amber-400",
    textOnFace: "text-amber-900",
  },
];
