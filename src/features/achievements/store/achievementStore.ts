import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { evaluateNewlyUnlocked } from "../engine/achievementEngine";
import type { Achievement, LifetimeStats, UnlockedAchievement } from "../types";

type AchievementStore = {
  unlocked: UnlockedAchievement[];
  /** Call after any stat-affecting action; returns newly unlocked achievements for a toast/modal. */
  evaluate: (stats: LifetimeStats) => Achievement[];
  isUnlocked: (achievementId: string) => boolean;
};

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      unlocked: [],

      evaluate: (stats) => {
        const unlockedIds = get().unlocked.map((u) => u.achievementId);
        const newlyUnlocked = evaluateNewlyUnlocked(stats, unlockedIds);
        if (newlyUnlocked.length === 0) return [];

        const now = new Date().toISOString();
        set({
          unlocked: [
            ...get().unlocked,
            ...newlyUnlocked.map((a) => ({ achievementId: a.id, unlockedAt: now })),
          ],
        });
        return newlyUnlocked;
      },

      isUnlocked: (achievementId) => get().unlocked.some((u) => u.achievementId === achievementId),
    }),
    {
      name: "solo-leveling.achievements",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
