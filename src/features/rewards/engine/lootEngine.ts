import type { ChestTier, LootReward } from "../types";
import type { RarityTier } from "@/design-system/theme";

const RARITY_WEIGHTS: Record<RarityTier, number> = {
  common: 60,
  rare: 28,
  epic: 10,
  legendary: 2,
};

const BOSS_RARITY_WEIGHTS: Record<RarityTier, number> = {
  common: 25,
  rare: 40,
  epic: 27,
  legendary: 8,
};

const COSMETIC_POOL: Record<RarityTier, Omit<LootReward, "id" | "rarity">[]> = {
  common: [
    { kind: "badge", label: "First Steps Badge" },
    { kind: "equipment", label: "Worn Training Boots" },
  ],
  rare: [
    { kind: "aura", label: "Cyan Ember Aura" },
    { kind: "equipment", label: "Reinforced Grip Gloves" },
    { kind: "theme", label: "Midnight Circuit Theme" },
  ],
  epic: [
    { kind: "avatar_skin", label: "Voidwalker Silhouette" },
    { kind: "equipment", label: "Vanguard Plate Armor" },
    { kind: "title", label: "Relentless" },
  ],
  legendary: [
    { kind: "aura", label: "Sovereign's Radiance" },
    { kind: "avatar_skin", label: "Ascended Hunter Skin" },
    { kind: "title", label: "Unbroken" },
    { kind: "equipment", label: "Genesis Weapon" },
  ],
};

function rollRarity(weights: Record<RarityTier, number>): RarityTier {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (const [rarity, weight] of Object.entries(weights) as [RarityTier, number][]) {
    if (roll < weight) return rarity;
    roll -= weight;
  }
  return "common";
}

function pickCosmetic(rarity: RarityTier): LootReward {
  const pool = COSMETIC_POOL[rarity];
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return { id: `${pick.kind}-${Date.now()}-${Math.floor(Math.random() * 1000)}`, rarity, ...pick };
}

/** Every workout chest guarantees gold, plus a chance at a cosmetic drop. */
export function rollChest(tier: ChestTier = "standard"): LootReward[] {
  const weights = tier === "standard" ? RARITY_WEIGHTS : BOSS_RARITY_WEIGHTS;
  const goldRarity = rollRarity(weights);
  const goldAmount =
    tier === "legendary" ? 200 + Math.floor(Math.random() * 300) : tier === "boss" ? 80 + Math.floor(Math.random() * 120) : 15 + Math.floor(Math.random() * 35);

  const rewards: LootReward[] = [
    { id: `gold-${Date.now()}`, kind: "gold", rarity: goldRarity, label: "Gold", amount: goldAmount },
  ];

  const cosmeticChance = tier === "legendary" ? 1 : tier === "boss" ? 0.6 : 0.35;
  if (Math.random() < cosmeticChance) {
    rewards.push(pickCosmetic(rollRarity(weights)));
  }

  return rewards;
}
