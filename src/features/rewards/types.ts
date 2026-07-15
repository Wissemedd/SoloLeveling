import type { RarityTier } from "@/design-system/theme";

export type LootKind =
  | "xp"
  | "gold"
  | "title"
  | "badge"
  | "aura"
  | "theme"
  | "avatar_skin"
  | "equipment";

export type LootReward = {
  id: string;
  kind: LootKind;
  rarity: RarityTier;
  label: string;
  /** Populated for xp/gold rewards. */
  amount?: number;
};

export type ChestTier = "standard" | "boss" | "legendary";
