import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { buildSessionLog } from "../engine/workoutEngine";
import type { Workout, WorkoutSessionLog } from "../types";

type WorkoutStore = {
  history: WorkoutSessionLog[];
  logCompletion: (workout: Workout) => WorkoutSessionLog;
  historyForWorkout: (workoutId: string) => WorkoutSessionLog[];
  totalWorkoutsCompleted: () => number;
};

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      history: [],

      logCompletion: (workout) => {
        const log = buildSessionLog(workout);
        set((state) => ({ history: [log, ...state.history] }));
        return log;
      },

      historyForWorkout: (workoutId) => get().history.filter((h) => h.workoutId === workoutId),

      totalWorkoutsCompleted: () => get().history.length,
    }),
    {
      name: "solo-leveling.workouts",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
