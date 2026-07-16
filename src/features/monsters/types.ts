import type { Ionicons } from "@expo/vector-icons";
import type { HunterRank } from "@/features/player/types";

type IconName = keyof typeof Ionicons.glyphMap;

export type MonsterFamily = "beast" | "undead" | "demon" | "elemental" | "construct" | "spirit" | "humanoid" | "dragon";

export type ElementalAffinity = "none" | "fire" | "frost" | "shadow" | "light" | "poison" | "storm";

export type LootDrop = { itemId: string; weight: number };

export type MonsterDefinition = {
  id: string;
  name: string;
  family: MonsterFamily;
  /** Reuses the hunter rank ladder as a difficulty tier. */
  rank: HunterRank;
  level: number;
  description: string;
  icon: IconName;
  maxHealth: number;
  attackPower: number;
  defense: number;
  speed: number;
  critChance: number;
  affinity: ElementalAffinity;
  weakness: ElementalAffinity | null;
  resistance: ElementalAffinity | null;
  lootTable: LootDrop[];
  goldRange: [number, number];
  isBoss: boolean;
};
