export interface PoolThinker {
  name: string;
  slug: string;
  domain: string;
  corePosition: string;
  recognitionTier: "anchor" | "depth" | "surprise";
}
