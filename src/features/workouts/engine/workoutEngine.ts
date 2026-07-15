import type { DifficultyTier, Equipment, Workout, WorkoutFocus, WorkoutSessionLog } from "../types";

export type WorkoutFilters = {
  difficulty?: DifficultyTier[];
  focus?: WorkoutFocus[];
  equipment?: Equipment[];
  maxDurationMinutes?: number;
};

export function isUnlocked(workout: Workout, hunterLevel: number): boolean {
  return hunterLevel >= workout.unlockLevel;
}

export function getAvailableWorkouts(workouts: Workout[], hunterLevel: number): Workout[] {
  return workouts.filter((w) => isUnlocked(w, hunterLevel));
}

export function filterWorkouts(workouts: Workout[], filters: WorkoutFilters): Workout[] {
  return workouts.filter((w) => {
    if (filters.difficulty?.length && !filters.difficulty.includes(w.difficulty)) return false;
    if (filters.focus?.length && !w.focus.some((f) => filters.focus!.includes(f))) return false;
    if (filters.equipment?.length && !w.equipment.some((e) => filters.equipment!.includes(e))) return false;
    if (filters.maxDurationMinutes && w.durationMinutes > filters.maxDurationMinutes) return false;
    return true;
  });
}

export function countSetEntries(workout: Workout): number {
  return workout.blocks.warmup.length + workout.blocks.main.length + workout.blocks.cooldown.length;
}

/** Builds the log entry recorded once a hunter finishes a workout session. */
export function buildSessionLog(workout: Workout, completedAt: string = new Date().toISOString()): WorkoutSessionLog {
  return {
    id: `${workout.id}-${completedAt}`,
    workoutId: workout.id,
    completedAt,
    durationMinutes: workout.durationMinutes,
    caloriesBurned: workout.estimatedCalories,
    xpEarned: workout.xpReward,
    statRewards: workout.statRewards,
  };
}
