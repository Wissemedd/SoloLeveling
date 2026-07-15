import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useRewardsStore } from "@/features/rewards/store/rewardsStore";
import { rollChest } from "@/features/rewards/engine/lootEngine";
import { useBossStore } from "@/features/bosses/store/bossStore";
import type { Achievement } from "@/features/achievements/types";
import type { LootReward } from "@/features/rewards/types";
import type { XpGrantResult } from "@/features/player/types";
import { useWorkoutStore } from "../store/workoutStore";
import type { Workout, WorkoutSessionLog } from "../types";

export type CompleteWorkoutSummary = {
  sessionLog: WorkoutSessionLog;
  xpResult: XpGrantResult;
  loot: LootReward[];
  goldEarned: number;
  newlyUnlockedAchievements: Achievement[];
  bossDefeated: boolean;
};

/**
 * The single seam where finishing a workout fans out into every other
 * system: XP/level/rank, RPG stats, streak, lifetime counters, mission
 * progress, loot, and achievement checks. Screens should call this instead
 * of touching the individual stores directly.
 */
export function useCompleteWorkout() {
  const grantXpToPlayer = usePlayerStore((s) => s.grantXpToPlayer);
  const applyStatRewards = usePlayerStore((s) => s.applyStatRewards);
  const completeQuestForToday = usePlayerStore((s) => s.completeQuestForToday);
  const addGold = usePlayerStore((s) => s.addGold);

  const logCompletion = useWorkoutStore((s) => s.logCompletion);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const incrementMissionProgress = useMissionStore((s) => s.incrementProgress);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);
  const addCosmetics = useRewardsStore((s) => s.addCosmetics);
  const dealDamageFromXp = useBossStore((s) => s.dealDamageFromXp);

  return function completeWorkout(workout: Workout): CompleteWorkoutSummary {
    const now = new Date();
    const hour = now.getHours();
    const isMorning = hour < 7;
    const isNight = hour >= 22;

    const sessionLog = logCompletion(workout);
    const xpResult = grantXpToPlayer(workout.xpReward, "workout");
    applyStatRewards(workout.statRewards);
    completeQuestForToday();

    recordLifetime({
      totalWorkouts: 1,
      totalCaloriesBurned: workout.estimatedCalories,
      morningWorkouts: isMorning ? 1 : 0,
      nightWorkouts: isNight ? 1 : 0,
    });

    incrementMissionProgress("workouts_completed", 1);
    incrementMissionProgress("calories_burned", workout.estimatedCalories);
    if (isMorning) incrementMissionProgress("early_workout", 1);

    const { defeatedJustNow } = dealDamageFromXp(workout.xpReward);
    const loot = rollChest(defeatedJustNow ? "boss" : "standard");
    const goldEarned = loot.filter((r) => r.kind === "gold").reduce((sum, r) => sum + (r.amount ?? 0), 0);
    addGold(goldEarned);
    addCosmetics(loot);

    const { level } = usePlayerStore.getState();
    const { streak } = usePlayerStore.getState();
    const { counters } = useLifetimeStatsStore.getState();
    const newlyUnlockedAchievements = evaluateAchievements(
      deriveLifetimeStats(counters, level, streak.longest),
    );

    return { sessionLog, xpResult, loot, goldEarned, newlyUnlockedAchievements, bossDefeated: defeatedJustNow };
  };
}
