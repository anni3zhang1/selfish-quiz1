import { PoolThinker } from "./types";
import { aiGovernancePool } from "./ai-governance";
import { animalRightsPool } from "./animal-rights";
import { bioethicsPool } from "./bioethics";
import { capitalismPool } from "./capitalism";
import { climatePool } from "./climate";
import { consciousnessPool } from "./consciousness";
import { democracyPool } from "./democracy";
import { drugPolicyPool } from "./drug-policy";
import { economicDisruptionPool } from "./economic-disruption";
import { educationPool } from "./education";
import { endOfLifePool } from "./end-of-life";
import { gazaIsraelPool } from "./gaza-israel";
import { gentrificationPool } from "./gentrification";
import { gunRightsPool } from "./gun-rights";
import { homelessnessPool } from "./homelessness";
import { immigrationPool } from "./immigration";
import { longevityPool } from "./longevity";
import { meaningCrisisPool } from "./meaning-crisis";
import { nuclearDeterrencePool } from "./nuclear-deterrence";
import { reparationsPool } from "./reparations";
import { spaceColonizationPool } from "./space-colonization";
import { surveillancePrivacyPool } from "./surveillance-privacy";
import { taiwanPool } from "./taiwan";
import { transRightsPool } from "./trans-rights";
import { truthMediaPool } from "./truth-media";
import { usForeignPolicyPool } from "./us-foreign-policy";

export type { PoolThinker } from "./types";

export const thinkerPools: Record<string, PoolThinker[]> = {
  ai_governance: aiGovernancePool,
  animal_rights: animalRightsPool,
  bioethics: bioethicsPool,
  capitalism: capitalismPool,
  climate: climatePool,
  consciousness: consciousnessPool,
  democracy: democracyPool,
  drug_policy: drugPolicyPool,
  economic_disruption: economicDisruptionPool,
  education: educationPool,
  end_of_life: endOfLifePool,
  gaza_israel: gazaIsraelPool,
  gentrification: gentrificationPool,
  gun_rights: gunRightsPool,
  homelessness: homelessnessPool,
  immigration: immigrationPool,
  longevity: longevityPool,
  meaning_crisis: meaningCrisisPool,
  nuclear_deterrence: nuclearDeterrencePool,
  reparations: reparationsPool,
  space_colonization: spaceColonizationPool,
  surveillance_privacy: surveillancePrivacyPool,
  taiwan: taiwanPool,
  trans_rights: transRightsPool,
  truth_media: truthMediaPool,
  us_foreign_policy: usForeignPolicyPool,
};
