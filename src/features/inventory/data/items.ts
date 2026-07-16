import type { ItemDefinition } from "../types";

/**
 * V1 curated item catalog — reduced content on purpose (see plan). The data
 * shape supports mythic/unique/divine tiers and any category already; more
 * items is purely a data change, same pattern as `achievements.ts`.
 */
export const items: ItemDefinition[] = [
  // Weapons
  { id: "rusted-blade", name: "Rusted Blade", description: "A pitted shortsword that has outlived its first owner.", category: "weapon", rarity: "common", icon: "flash", levelRequirement: 1, baseBonuses: { attackPower: 4 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 20, buyValue: 60 },
  { id: "hunters-shortsword", name: "Hunter's Shortsword", description: "Balanced steel favored by early-rank hunters.", category: "weapon", rarity: "uncommon", icon: "flash", levelRequirement: 5, baseBonuses: { attackPower: 8 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 45, buyValue: 150 },
  { id: "runed-saber", name: "Runed Saber", description: "Faint runes along the fuller hum when it draws blood.", category: "weapon", rarity: "rare", icon: "flash", levelRequirement: 15, baseBonuses: { attackPower: 14, critChance: 0.03 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 120, buyValue: 400 },
  { id: "wraithfang", name: "Wraithfang", description: "Forged from a Veil Wraith's crystallized core.", category: "weapon", rarity: "epic", icon: "flash", levelRequirement: 30, baseBonuses: { attackPower: 22, critChance: 0.06 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 320, buyValue: null },
  { id: "sovereigns-edge", name: "Sovereign's Edge", description: "A blade that remembers every Gate it has closed.", category: "weapon", rarity: "legendary", icon: "flash", levelRequirement: 50, baseBonuses: { attackPower: 34, critChance: 0.1, elementalPower: 10 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 800, buyValue: null },

  // Armor
  { id: "worn-leather-vest", name: "Worn Leather Vest", description: "Cracked but still holding together.", category: "armor", rarity: "common", icon: "shirt", levelRequirement: 1, baseBonuses: { defense: 4 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 20, buyValue: 60 },
  { id: "chainmail-hauberk", name: "Chainmail Hauberk", description: "Standard-issue protection for D-rank expeditions.", category: "armor", rarity: "uncommon", icon: "shirt", levelRequirement: 5, baseBonuses: { defense: 8 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 45, buyValue: 150 },
  { id: "wardens-plate", name: "Warden's Plate", description: "Heavy plate etched with the Gate Warden's sigil.", category: "armor", rarity: "rare", icon: "shirt", levelRequirement: 15, baseBonuses: { defense: 14, dodgeChance: 0.02 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 120, buyValue: 400 },
  { id: "voidsteel-armor", name: "Voidsteel Armor", description: "Plating that drinks in ambient light.", category: "armor", rarity: "epic", icon: "shirt", levelRequirement: 30, baseBonuses: { defense: 22, dodgeChance: 0.04 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 320, buyValue: null },
  { id: "aegis-of-the-fallen-gate", name: "Aegis of the Fallen Gate", description: "Cast from the frame of a Gate that never closed.", category: "armor", rarity: "legendary", icon: "shirt", levelRequirement: 50, baseBonuses: { defense: 32, dodgeChance: 0.06 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 800, buyValue: null },

  // Helmets
  { id: "cracked-helm", name: "Cracked Helm", description: "Better than nothing.", category: "helmet", rarity: "common", icon: "shield-half", levelRequirement: 1, baseBonuses: { defense: 2 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 12, buyValue: 40 },
  { id: "sentinel-helm", name: "Sentinel Helm", description: "Grants a hunter's eye for an opening.", category: "helmet", rarity: "rare", icon: "shield-half", levelRequirement: 15, baseBonuses: { defense: 6, critChance: 0.02 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 90, buyValue: 300 },
  { id: "crown-of-the-gatekeeper", name: "Crown of the Gatekeeper", description: "Once worn by the first hunter to survive an S-rank Gate.", category: "helmet", rarity: "legendary", icon: "shield-half", levelRequirement: 50, baseBonuses: { defense: 12, critChance: 0.05 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 600, buyValue: null },

  // Gloves
  { id: "frayed-gloves", name: "Frayed Gloves", description: "Thin leather, still better grip than bare hands.", category: "gloves", rarity: "common", icon: "hand-left", levelRequirement: 1, baseBonuses: { attackPower: 2 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 10, buyValue: 35 },
  { id: "gripwrap-gauntlets", name: "Gripwrap Gauntlets", description: "Wound tight enough to never slip mid-swing.", category: "gloves", rarity: "rare", icon: "hand-left", levelRequirement: 15, baseBonuses: { attackPower: 5, critChance: 0.02 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 80, buyValue: 260 },
  { id: "talons-of-the-ashbound", name: "Talons of the Ashbound", description: "Clawed gauntlets that still smolder faintly.", category: "gloves", rarity: "legendary", icon: "hand-left", levelRequirement: 50, baseBonuses: { attackPower: 10, critChance: 0.05 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 560, buyValue: null },

  // Boots
  { id: "worn-boots", name: "Worn Boots", description: "Held together by hope and a second sole.", category: "boots", rarity: "common", icon: "footsteps", levelRequirement: 1, baseBonuses: { dodgeChance: 0.01 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 10, buyValue: 35 },
  { id: "swiftstep-greaves", name: "Swiftstep Greaves", description: "Light enough to forget you're wearing them.", category: "boots", rarity: "rare", icon: "footsteps", levelRequirement: 15, baseBonuses: { dodgeChance: 0.03 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 80, buyValue: 260 },
  { id: "boots-of-the-fleeting-wraith", name: "Boots of the Fleeting Wraith", description: "Leaves no footprint, casts no sound.", category: "boots", rarity: "legendary", icon: "footsteps", levelRequirement: 50, baseBonuses: { dodgeChance: 0.06 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 560, buyValue: null },

  // Rings & necklaces
  { id: "band-of-focus", name: "Band of Focus", description: "A plain ring that steadies the hand.", category: "ring", rarity: "rare", icon: "radio-button-on", levelRequirement: 15, baseBonuses: { elementalPower: 5 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 90, buyValue: 300 },
  { id: "signet-of-the-monarch", name: "Signet of the Monarch", description: "Cold to the touch, always.", category: "ring", rarity: "legendary", icon: "radio-button-on", levelRequirement: 50, baseBonuses: { elementalPower: 15, critChance: 0.03 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 700, buyValue: null },
  { id: "pendant-of-vigor", name: "Pendant of Vigor", description: "Warm against the chest, even in the Frozen Wastes.", category: "necklace", rarity: "rare", icon: "medal", levelRequirement: 15, baseBonuses: { defense: 5 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 90, buyValue: 300 },
  { id: "amulet-of-the-hollow-sentinel", name: "Amulet of the Hollow Sentinel", description: "Taken from a boss that no longer needed it.", category: "necklace", rarity: "legendary", icon: "medal", levelRequirement: 50, baseBonuses: { defense: 10, elementalPower: 8 }, upgradeable: true, maxUpgradeLevel: 10, stackable: false, sellValue: 700, buyValue: null },

  // Potions (consumable, collectible in V1 — no active-use mechanic yet)
  { id: "vial-of-vitality", name: "Vial of Vitality", description: "A common restorative brewed by Gate-town alchemists.", category: "potion", rarity: "common", icon: "flask", levelRequirement: 1, baseBonuses: {}, upgradeable: false, maxUpgradeLevel: 0, stackable: true, sellValue: 5, buyValue: 15 },
  { id: "elixir-of-the-deep", name: "Elixir of the Deep", description: "Tastes like static. Works better than it should.", category: "potion", rarity: "rare", icon: "flask", levelRequirement: 15, baseBonuses: {}, upgradeable: false, maxUpgradeLevel: 0, stackable: true, sellValue: 25, buyValue: 80 },

  // Forge materials
  { id: "iron-fragment", name: "Iron Fragment", description: "Base material for early Forge upgrades.", category: "material", rarity: "common", icon: "cube", levelRequirement: 1, baseBonuses: {}, upgradeable: false, maxUpgradeLevel: 0, stackable: true, sellValue: 3, buyValue: 8 },
  { id: "arcane-dust", name: "Arcane Dust", description: "Fine residue left behind by a closed Gate.", category: "material", rarity: "uncommon", icon: "sparkles", levelRequirement: 1, baseBonuses: {}, upgradeable: false, maxUpgradeLevel: 0, stackable: true, sellValue: 10, buyValue: 25 },
  { id: "monarchs-ember", name: "Monarch's Ember", description: "A rare boss drop needed for the Forge's highest tiers.", category: "material", rarity: "rare", icon: "flame", levelRequirement: 1, baseBonuses: {}, upgradeable: false, maxUpgradeLevel: 0, stackable: true, sellValue: 40, buyValue: null },
];

export function getItemDefinition(id: string): ItemDefinition | undefined {
  return items.find((i) => i.id === id);
}
