import type { CombatBonuses } from "@/features/inventory/types";
import type { ClassNode } from "@/features/classes/types";
import type { HunterRank } from "@/features/player/types";
import { branchSkillSeeds } from "../data/skillSeeds";
import type { ClassSkillSet, SkillDefinition, SkillKind } from "../types";

const TIER_MULTIPLIER: Record<HunterRank, number> = {
  E: 1,
  D: 1,
  C: 1.3,
  B: 1.7,
  A: 2.3,
  S: 3.2,
  National: 3.2,
};

function scaleBonuses(base: Partial<CombatBonuses>, multiplier: number): Partial<CombatBonuses> {
  const scaled: Partial<CombatBonuses> = {};
  for (const [key, value] of Object.entries(base) as [keyof CombatBonuses, number][]) {
    scaled[key] = Math.round(value * multiplier * 100) / 100;
  }
  return scaled;
}

function toDefinition(id: string, kind: SkillKind, multiplier: number, seed: (typeof branchSkillSeeds)[number]["active"]): SkillDefinition {
  return {
    id,
    name: seed.name,
    description: seed.description,
    kind,
    icon: seed.icon,
    cooldownRounds: seed.cooldownRounds,
    bonuses: scaleBonuses(seed.baseBonuses, multiplier),
  };
}

/** Resolves the active+passive skill pair for a class-tree node, scaled by its rank tier. */
export function getSkillsForNode(node: ClassNode): ClassSkillSet | null {
  const seed = branchSkillSeeds.find((s) => s.archetype === node.archetype && s.branch === node.branch);
  if (!seed) return null;
  const multiplier = TIER_MULTIPLIER[node.rank] ?? 1;
  return {
    active: toDefinition(`${node.id}.active`, "active", multiplier, seed.active),
    passive: toDefinition(`${node.id}.passive`, "passive", multiplier, seed.passive),
  };
}
