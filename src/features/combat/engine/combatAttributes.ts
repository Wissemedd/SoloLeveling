import type { RpgStats } from "@/features/player/types";
import { emptyCombatBonuses } from "@/features/inventory/types";
import type { CombatBonuses } from "@/features/inventory/types";
import { clamp01 } from "@/lib/utils/math";
import type { CombatAttributes } from "../types";

/**
 * The only bridge between a hunter's real, sport-earned stats and combat.
 * Reads RpgStats — never writes them. Gear/class bonuses only ever affect
 * combat attributes, never the underlying stats themselves. This is the
 * mechanism that keeps the Adventure layer from ever granting progression.
 */
export function deriveCombatAttributes(
  stats: RpgStats,
  gearBonuses: CombatBonuses = emptyCombatBonuses(),
  classBonuses: CombatBonuses = emptyCombatBonuses(),
): CombatAttributes {
  const baseAttack = 5 + stats.strength * 1.2 + stats.focus * 0.3;
  const baseDefense = 3 + stats.endurance * 0.8 + stats.vitality * 0.4;
  const baseCrit = 0.03 + stats.agility * 0.002;
  const baseDodge = 0.02 + stats.agility * 0.0025 + stats.focus * 0.001;
  const baseElemental = stats.focus * 0.6 + stats.discipline * 0.2;
  const maxHealth = 50 + stats.vitality * 6 + stats.endurance * 3;
  const speed = 5 + stats.agility * 0.5;

  return {
    attackPower: Math.round(baseAttack + gearBonuses.attackPower + classBonuses.attackPower),
    defense: Math.round(baseDefense + gearBonuses.defense + classBonuses.defense),
    critChance: clamp01(baseCrit + gearBonuses.critChance + classBonuses.critChance),
    dodgeChance: clamp01(baseDodge + gearBonuses.dodgeChance + classBonuses.dodgeChance),
    elementalPower: Math.round(baseElemental + gearBonuses.elementalPower + classBonuses.elementalPower),
    maxHealth: Math.round(maxHealth),
    speed: Math.round(speed),
  };
}
