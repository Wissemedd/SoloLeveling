import type { RpgStats } from "@/features/player/types";

/** Average stride length used to convert a step count into distance covered. */
const KM_PER_STEP = 0.0008; // ~0.8m stride
/** Rough calorie burn per step for a typical adult walking pace. */
const CALORIES_PER_STEP = 0.04;
/** XP per km — a fraction of an active workout's rate, since syncing steps takes no deliberate training time. */
const XP_PER_KM = 8;
/** Steps required to bank one endurance point, mirroring a workout's stat-reward scale. */
const STEPS_PER_ENDURANCE_POINT = 2500;

export function stepsToDistanceKm(steps: number): number {
  if (steps <= 0) return 0;
  return Math.round(steps * KM_PER_STEP * 100) / 100;
}

export function stepsToCalories(steps: number): number {
  if (steps <= 0) return 0;
  return Math.round(steps * CALORIES_PER_STEP);
}

export function stepsToXp(steps: number): number {
  if (steps <= 0) return 0;
  return Math.round(stepsToDistanceKm(steps) * XP_PER_KM);
}

/** Passive walking trains endurance only — dedicated workouts remain the way to grow every other stat. */
export function stepsToStatGains(steps: number): Partial<RpgStats> {
  const points = Math.floor(steps / STEPS_PER_ENDURANCE_POINT);
  return points > 0 ? { endurance: points } : {};
}
