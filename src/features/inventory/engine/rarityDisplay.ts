import type { RarityTier } from "@/design-system/theme";
import type { ItemRarity } from "../types";

/**
 * Collapses the 8-tier item rarity ladder onto the 4-tier RarityTier the
 * design system's <Chip> understands. Mythic/unique/divine (reserved for
 * future content, see inventory/types.ts) all render as legendary until
 * the shared theme grows its own tiers to match.
 */
const CHIP_TIER_BY_ITEM_RARITY: Record<ItemRarity, RarityTier> = {
  common: "common",
  uncommon: "common",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
  mythic: "legendary",
  unique: "legendary",
  divine: "legendary",
};

export function chipTierForItemRarity(rarity: ItemRarity): RarityTier {
  return CHIP_TIER_BY_ITEM_RARITY[rarity];
}
