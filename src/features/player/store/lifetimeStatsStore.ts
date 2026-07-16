import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import type { LifetimeStats } from "@/features/achievements/types";

type Counters = Omit<LifetimeStats, "level" | "longestStreak">;

type LifetimeStatsStore = {
  counters: Counters;
  record: (delta: Partial<Counters>) => void;
};

const initialCounters: Counters = {
  totalWorkouts: 0,
  totalPushups: 0,
  totalDistanceKm: 0,
  totalCaloriesBurned: 0,
  morningWorkouts: 0,
  nightWorkouts: 0,
  totalSteps: 0,
  totalDungeonsCleared: 0,
  totalMonstersDefeated: 0,
  totalBossesDefeated: 0,
  totalItemsCrafted: 0,
};

/**
 * Lifetime counters that only ever go up — fed by workout completions and
 * manual quick-log actions (water/steps/etc). Kept separate from the player
 * store because these are cumulative history, not current-state.
 */
export const useLifetimeStatsStore = create<LifetimeStatsStore>()(
  persist(
    (set, get) => ({
      counters: initialCounters,
      record: (delta) => {
        const current = get().counters;
        const next = { ...current };
        for (const key of Object.keys(delta) as (keyof Counters)[]) {
          next[key] = current[key] + (delta[key] ?? 0);
        }
        set({ counters: next });
      },
    }),
    {
      name: "solo-leveling.lifetime-stats",
      storage: createJSONStorage(() => appStorage),
      // Deep-merge counters so a newly added field (e.g. totalSteps) defaults
      // to 0 for devices with an older persisted blob instead of `undefined`.
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<LifetimeStatsStore> | undefined;
        return {
          ...current,
          ...persistedState,
          counters: { ...current.counters, ...persistedState?.counters },
        };
      },
    },
  ),
);
