import type { HunterRank } from "@/features/player/types";
import type { ItemRarity } from "@/features/inventory/types";
import type { MonsterDefinition } from "@/features/monsters/types";

export type RegionTheme = "forest" | "mountains" | "desert" | "ruins" | "city" | "marsh" | "frozen_lands" | "volcano";

export type Region = {
  id: string;
  name: string;
  theme: RegionTheme;
  description: string;
  unlocked: boolean;
  recommendedLevelRange: [number, number];
};

/** Reuses the hunter rank ladder as the Gate danger tier (SS/Monarch tiers land here once the ladder grows past S). */
export type GateRank = HunterRank;

export type LootPreviewEntry = { rarity: ItemRarity; chance: number };

/**
 * Encounter monsters are resolved MonsterDefinition objects (not ids) so a
 * Gate can freely mix curated bestiary entries with procedurally-generated
 * ones (see monsters/engine/monsterGenerator.ts) — the latter have no
 * static record to look up later, so the Gate carries the resolved data.
 */
export type Gate = {
  id: string;
  regionId: string;
  rank: GateRank;
  recommendedLevel: number;
  encounterMonsters: MonsterDefinition[];
  boss: MonsterDefinition;
  isFeaturedBossGate: boolean;
  energyCost: number;
  estimatedMinutes: number;
  lootPreview: LootPreviewEntry[];
  expiresAt: string; // ISO datetime
};
