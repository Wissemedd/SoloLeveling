import { exercises } from "../data/exercises";
import type { Exercise, Workout, WorkoutSetEntry } from "../types";

export const exerciseById = new Map<string, Exercise>(exercises.map((e) => [e.id, e]));

export type SessionBlock = "warmup" | "main" | "cooldown";

export type SessionStep = {
  stepIndex: number;
  block: SessionBlock;
  exercise: Exercise;
  entry: WorkoutSetEntry;
  setNumber: number;
  totalSetsForEntry: number;
};

/** Expands a workout's blocks into one flat, per-set list the session screen can step through. */
export function buildSessionSteps(workout: Workout): SessionStep[] {
  const steps: SessionStep[] = [];
  const blocks: [SessionBlock, WorkoutSetEntry[]][] = [
    ["warmup", workout.blocks.warmup],
    ["main", workout.blocks.main],
    ["cooldown", workout.blocks.cooldown],
  ];

  for (const [block, entries] of blocks) {
    for (const entry of entries) {
      const exercise = exerciseById.get(entry.exerciseId);
      if (!exercise) continue;
      for (let setNumber = 1; setNumber <= entry.sets; setNumber++) {
        steps.push({ stepIndex: steps.length, block, exercise, entry, setNumber, totalSetsForEntry: entry.sets });
      }
    }
  }

  return steps;
}

export function targetDescription(entry: WorkoutSetEntry): string {
  if (entry.reps) return `${entry.reps} reps`;
  if (entry.durationSeconds) return `${entry.durationSeconds}s hold`;
  if (entry.distanceMeters) return `${entry.distanceMeters}m`;
  return "";
}
