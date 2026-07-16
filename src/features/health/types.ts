import type { Achievement } from "@/features/achievements/types";

export type StepsSyncSummary = {
  newSteps: number;
  totalStepsToday: number;
  xpEarned: number;
  distanceKm: number;
  caloriesBurned: number;
  newlyUnlockedAchievements: Achievement[];
};
