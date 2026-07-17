import { colors } from "@/design-system/theme";
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

/**
 * Distinct frame/glow color per item rarity tier — used by ItemIcon, where
 * (unlike <Chip>) there's room to give mythic/unique/divine their own look
 * instead of collapsing onto "legendary" gold.
 */
const FRAME_COLOR_BY_ITEM_RARITY: Record<ItemRarity, string> = {
  common: colors.slate,
  uncommon: colors.toxic[300],
  rare: colors.neon[300],
  epic: colors.arcane[300],
  legendary: colors.gold[300],
  mythic: colors.danger[300],
  unique: colors.gold[100],
  divine: colors.white,
};

export function frameColorForItemRarity(rarity: ItemRarity): string {
  return FRAME_COLOR_BY_ITEM_RARITY[rarity];
}
