import type { HunterRank } from "@/features/player/types";
import type { ElementalAffinity, MonsterDefinition, MonsterFamily } from "../types";

const NAME_PREFIXES = ["Hollow", "Ashbound", "Ironfang", "Ruined", "Nightborn", "Rimewalker", "Ember", "Wraithbound", "Gravebound", "Stormcaller"];
const NAME_ROOTS = ["Stalker", "Reaver", "Warden", "Husk", "Shade", "Marauder", "Sentinel", "Fiend", "Prowler", "Revenant"];

const FAMILIES: MonsterFamily[] = ["beast", "undead", "demon", "elemental", "construct", "spirit", "humanoid", "dragon"];
const AFFINITIES: ElementalAffinity[] = ["none", "fire", "frost", "shadow", "light", "poison", "storm"];
const ICONS_BY_FAMILY: Record<MonsterFamily, MonsterDefinition["icon"]> = {
  beast: "paw",
  undead: "skull",
  demon: "flame",
  elemental: "snow",
  construct: "cube",
  spirit: "sparkles",
  humanoid: "body",
  dragon: "flame",
};

/** Deterministic pseudo-random in [0,1) from a numeric seed — keeps generation reproducible/testable. */
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(items: T[], seed: number): T {
  return items[Math.floor(seededRandom(seed) * items.length) % items.length];
}

function weaknessFor(affinity: ElementalAffinity, seed: number): ElementalAffinity | null {
  const counters: Partial<Record<ElementalAffinity, ElementalAffinity>> = {
    fire: "frost",
    frost: "fire",
    shadow: "light",
    light: "shadow",
    poison: "frost",
    storm: "none",
  };
  return affinity === "none" ? (seededRandom(seed) < 0.3 ? pick(AFFINITIES.filter((a) => a !== "none"), seed + 1) : null) : (counters[affinity] ?? null);
}

/**
 * Procedurally synthesizes a monster scaled to a rank/level, for filling
 * Gates beyond the curated V1 bestiary. Same MonsterDefinition shape as
 * curated content — the scaffolding the brief's "several hundred monsters"
 * grows into without any architecture change.
 */
export function generateMonster(rank: HunterRank, level: number, seed: number, isBoss = false): MonsterDefinition {
  const family = pick(FAMILIES, seed);
  const affinity = seededRandom(seed + 2) < 0.55 ? pick(AFFINITIES, seed + 3) : "none";
  const bossMultiplier = isBoss ? 6 : 1;

  return {
    id: `generated-${rank.toLowerCase()}-${Math.floor(seededRandom(seed) * 1e6)}`,
    name: `${pick(NAME_PREFIXES, seed + 4)} ${pick(NAME_ROOTS, seed + 5)}`,
    family,
    rank,
    level,
    description: "A creature drawn from the Gate's depths — its lineage is unknown even to the Association.",
    icon: ICONS_BY_FAMILY[family],
    maxHealth: Math.round((20 + level * 7) * bossMultiplier),
    attackPower: Math.round(3 + level * 1.1 * (isBoss ? 1.4 : 1)),
    defense: Math.round(level * 0.5 * (isBoss ? 1.3 : 1)),
    speed: Math.round(3 + seededRandom(seed + 6) * 12),
    critChance: Math.round((0.02 + seededRandom(seed + 7) * 0.08) * 100) / 100,
    affinity,
    weakness: weaknessFor(affinity, seed + 8),
    resistance: affinity !== "none" && seededRandom(seed + 9) < 0.4 ? affinity : null,
    lootTable: [{ itemId: "iron-fragment", weight: 40 }, { itemId: "arcane-dust", weight: 25 }],
    goldRange: [Math.round(level * 0.8), Math.round(level * 1.8)],
    isBoss,
  };
}
