import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useEvaluateProgressionRewards } from "@/features/achievements/hooks/useEvaluateProgressionRewards";
import { localDateIso } from "@/lib/utils/date";
import { logWarning } from "@/lib/logger";
import { useHealthStore } from "../store/healthStore";
import { stepsToCalories, stepsToDistanceKm, stepsToStatGains, stepsToXp } from "../engine/stepsEngine";
import type { StepsSyncSummary } from "../types";

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
  const evaluateProgressionRewards = useEvaluateProgressionRewards();

  return async function syncSteps(): Promise<StepsSyncSummary | null> {
    if (status !== "connected") return null;

    try {
      const totalStepsToday = await pullTodaySteps();
      const date = localDateIso();
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

      const newlyUnlockedAchievements = evaluateProgressionRewards();

      return { newSteps, totalStepsToday, xpEarned, distanceKm, caloriesBurned, newlyUnlockedAchievements };
    } catch (error) {
      logWarning("useSyncSteps", error);
      return null;
    }
  };
}
