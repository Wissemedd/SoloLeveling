import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useHealthStore } from "../store/healthStore";
import { stepsToCalories, stepsToDistanceKm, stepsToStatGains, stepsToXp } from "../engine/stepsEngine";
import type { StepsSyncSummary } from "../types";

function localDateIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Pulls today's step count from Health Connect (Samsung Health's data
 * flows into it automatically) and fans the *new* steps since the last
 * sync into every system a workout would touch: XP, RPG stats, lifetime
 * counters, mission progress, and achievements. Mirrors
 * `useCompleteWorkout` — passive steps are counted as real exercise, not a
 * cosmetic-only counter.
 */
export function useSyncSteps() {
  const status = useHealthStore((s) => s.status);
  const pullTodaySteps = useHealthStore((s) => s.pullTodaySteps);
  const creditedOn = useHealthStore((s) => s.creditedOn);
  const markCredited = useHealthStore((s) => s.markCredited);

  const grantXpToPlayer = usePlayerStore((s) => s.grantXpToPlayer);
  const applyStatRewards = usePlayerStore((s) => s.applyStatRewards);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const incrementMissionProgress = useMissionStore((s) => s.incrementProgress);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);

  return async function syncSteps(): Promise<StepsSyncSummary | null> {
    if (status !== "connected") return null;

    const totalStepsToday = await pullTodaySteps();
    const date = localDateIso(new Date());
    const alreadyCredited = creditedOn(date);
    const newSteps = Math.max(0, totalStepsToday - alreadyCredited);

    if (newSteps === 0) {
      return { newSteps: 0, totalStepsToday, xpEarned: 0, distanceKm: 0, caloriesBurned: 0, newlyUnlockedAchievements: [] };
    }

    const distanceKm = stepsToDistanceKm(newSteps);
    const caloriesBurned = stepsToCalories(newSteps);
    const xpEarned = stepsToXp(newSteps);
    const statGains = stepsToStatGains(newSteps);

    grantXpToPlayer(xpEarned, "walking");
    if (Object.keys(statGains).length > 0) applyStatRewards(statGains);

    recordLifetime({
      totalDistanceKm: distanceKm,
      totalCaloriesBurned: caloriesBurned,
      totalSteps: newSteps,
    });

    incrementMissionProgress("distance_km", distanceKm);
    markCredited(date, totalStepsToday);

    const { level, streak } = usePlayerStore.getState();
    const { counters } = useLifetimeStatsStore.getState();
    const newlyUnlockedAchievements = evaluateAchievements(deriveLifetimeStats(counters, level, streak.longest));

    return { newSteps, totalStepsToday, xpEarned, distanceKm, caloriesBurned, newlyUnlockedAchievements };
  };
}
