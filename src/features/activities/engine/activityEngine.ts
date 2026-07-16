import type { RpgStatKey, RpgStats } from "@/features/player/types";
import type { ActivityLogResult, ActivityTypeDef } from "../types";

/** Clamps a requested amount to whatever headroom remains under today's cap. */
export function acceptableUnits(dailyUnitCap: number, alreadyLoggedToday: number, requested: number): number {
  if (requested <= 0) return 0;
  return Math.max(0, Math.min(requested, dailyUnitCap - alreadyLoggedToday));
}

export function activityXp(def: ActivityTypeDef, units: number): number {
  if (units <= 0) return 0;
  return Math.round(units * def.xpPerUnit);
}

/** Whole stat points only — mirrors stepsEngine's divisor pattern, no fractional stats. */
export function activityStatGains(def: ActivityTypeDef, units: number): Partial<RpgStats> {
  if (units <= 0) return {};
  const gains: Partial<RpgStats> = {};
  for (const [key, unitsPerPoint] of Object.entries(def.unitsPerStatPoint) as [RpgStatKey, number][]) {
    if (!unitsPerPoint) continue;
    const points = Math.floor(units / unitsPerPoint);
    if (points > 0) gains[key] = points;
  }
  return gains;
}

/** Pure resolution of one log action against today's already-logged units. */
export function resolveActivityLog(def: ActivityTypeDef, requestedUnits: number, alreadyLoggedToday: number): ActivityLogResult {
  const acceptedUnits = acceptableUnits(def.dailyUnitCap, alreadyLoggedToday, requestedUnits);
  return {
    acceptedUnits,
    xpEarned: activityXp(def, acceptedUnits),
    statGains: activityStatGains(def, acceptedUnits),
    capReached: alreadyLoggedToday + acceptedUnits >= def.dailyUnitCap,
  };
}
