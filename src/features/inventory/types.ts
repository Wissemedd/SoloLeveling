import type { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

export type ItemCategory =
  | "weapon"
  | "armor"
  | "helmet"
  | "gloves"
  | "boots"
  | "ring"
  | "necklace"
  | "potion"
  | "material"
  | "rune"
  | "quest"
  | "misc";

/**
 * Item rarity ladder from the design brief — deliberately its OWN type,
 * separate from the shared `RarityTier` in design-system/theme (used by
 * sport loot and rank badges). Keeping them apart means item content can
 * grow into mythic/unique/divine tiers later without touching UI that
 * already depends on the 4-tier RarityTier everywhere else in the app.
 */
export type ItemRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "mythic"
  | "unique"
  | "divine";

export const ITEM_RARITY_ORDER: ItemRarity[] = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "unique",
  "divine",
];

export type EquipmentSlotId = "weapon" | "helmet" | "armor" | "gloves" | "boots" | "ring" | "necklace";

export const EQUIPMENT_SLOT_IDS: EquipmentSlotId[] = ["weapon", "helmet", "armor", "gloves", "boots", "ring", "necklace"];

/** Equipment ids per slot — null when empty. */
export type EquipmentSlots = Record<EquipmentSlotId, string | null>;

/**
 * Combat-only power granted by gear/class passives. Deliberately distinct
 * from `RpgStats` (player/types.ts) — items and class tiers never touch a
 * hunter's real strength/agility/etc, only these derived combat attributes.
 * See src/features/combat/engine/combatAttributes.ts.
 */
export type CombatBonuses = {
  attackPower: number;
  defense: number;
  critChance: number; // 0..1
  dodgeChance: number; // 0..1
  elementalPower: number;
};

export function emptyCombatBonuses(): CombatBonuses {
  return { attackPower: 0, defense: 0, critChance: 0, dodgeChance: 0, elementalPower: 0 };
}

export function addCombatBonuses(a: CombatBonuses, b: Partial<CombatBonuses>): CombatBonuses {
  return {
    attackPower: a.attackPower + (b.attackPower ?? 0),
    defense: a.defense + (b.defense ?? 0),
    critChance: a.critChance + (b.critChance ?? 0),
    dodgeChance: a.dodgeChance + (b.dodgeChance ?? 0),
    elementalPower: a.elementalPower + (b.elementalPower ?? 0),
  };
}

/** Static content definition for an item — the "template" every owned instance points back to. */
export type ItemDefinition = {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  rarity: ItemRarity;
  icon: IconName;
  levelRequirement: number;
  baseBonuses: Partial<CombatBonuses>;
  /** Only equipment (weapon/armor/.../necklace) can be forged. */
  upgradeable: boolean;
  maxUpgradeLevel: number;
  stackable: boolean;
  sellValue: number;
  buyValue: number | null; // null = not sold in the shop
};

/** An item a hunter actually owns. */
export type InventoryItemInstance = {
  instanceId: string;
  itemId: string;
  quantity: number;
  upgradeLevel: number;
  acquiredAt: string; // ISO datetime
  source: "dungeon" | "shop" | "forge" | "boss" | "achievement";
};
