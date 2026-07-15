import type { RpgStats } from "@/features/player/types";

export type DifficultyTier = "beginner" | "intermediate" | "advanced" | "elite";

export type Equipment = "bodyweight" | "dumbbells" | "kettlebell" | "gym" | "bench" | "pull_up_bar";

export type WorkoutFocus =
  | "strength"
  | "hypertrophy"
  | "hiit"
  | "mobility"
  | "core"
  | "cardio"
  | "explosive"
  | "calisthenics"
  | "recovery";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core"
  | "full_body"
  | "mobility";

export type ExerciseMetric = "reps" | "time" | "distance";

export type Exercise = {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  metric: ExerciseMetric;
};

export type WorkoutSetEntry = {
  exerciseId: string;
  sets: number;
  /** Only one of reps / durationSeconds / distanceMeters applies, matching the exercise's metric. */
  reps?: number;
  durationSeconds?: number;
  distanceMeters?: number;
  restSeconds: number;
  notes?: string;
};

export type WorkoutBlock = {
  warmup: WorkoutSetEntry[];
  main: WorkoutSetEntry[];
  cooldown: WorkoutSetEntry[];
};

export type Workout = {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyTier;
  focus: WorkoutFocus[];
  equipment: Equipment[];
  durationMinutes: number;
  estimatedCalories: number;
  xpReward: number;
  statRewards: Partial<RpgStats>;
  blocks: WorkoutBlock;
  /** Minimum hunter level required to unlock this workout. */
  unlockLevel: number;
  tags: string[];
};

export type WorkoutSessionLog = {
  id: string;
  workoutId: string;
  completedAt: string; // ISO datetime
  durationMinutes: number;
  caloriesBurned: number;
  xpEarned: number;
  statRewards: Partial<RpgStats>;
};
