import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { grantXp } from "../engine/xpEngine";
import { rankForLevel } from "../engine/rankEngine";
import { applyStatGains, createBaseStats } from "../engine/statsEngine";
import { recordDailyCompletion, applyDailyDecay, todayIso } from "../engine/streakEngine";
import type {
  HunterProfile,
  PlayerState,
  RpgStats,
  StreakState,
  XpGrantResult,
  XpSource,
} from "../types";

const INITIAL_STREAK: StreakState = {
  current: 0,
  longest: 0,
  lastCompletedDate: null,
  shields: 0,
};

type PlayerStore = PlayerState & {
  isOnboarded: boolean;
  createHunter: (profile: HunterProfile) => void;
  grantXpToPlayer: (amount: number, source: XpSource) => XpGrantResult;
  applyStatRewards: (gains: Partial<RpgStats>) => void;
  completeQuestForToday: () => void;
  reconcileStreakOnOpen: () => void;
  spendEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  addGold: (amount: number) => void;
  unlockTitle: (title: string) => void;
  setActiveTitle: (title: string | null) => void;
  resetProgress: () => void;
};

const initialState: PlayerState = {
  profile: null,
  xp: 0,
  level: 1,
  rank: "E",
  stats: createBaseStats(),
  streak: INITIAL_STREAK,
  energy: 100,
  gold: 0,
  unlockedTitles: ["Awakened"],
  activeTitle: "Awakened",
};

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      isOnboarded: false,

      createHunter: (profile) =>
        set({
          profile,
          isOnboarded: true,
          xp: 0,
          level: 1,
          rank: "E",
          stats: createBaseStats(),
          streak: INITIAL_STREAK,
          energy: 100,
          gold: 0,
        }),

      grantXpToPlayer: (amount, _source) => {
        const result = grantXp(get().xp, amount);
        set({
          xp: result.totalXp,
          level: result.newLevel,
          rank: rankForLevel(result.newLevel),
        });
        return result;
      },

      applyStatRewards: (gains) => set({ stats: applyStatGains(get().stats, gains) }),

      completeQuestForToday: () =>
        set({ streak: recordDailyCompletion(get().streak, todayIso()) }),

      reconcileStreakOnOpen: () => set({ streak: applyDailyDecay(get().streak, todayIso()) }),

      spendEnergy: (amount) => {
        const current = get().energy;
        if (current < amount) return false;
        set({ energy: current - amount });
        return true;
      },

      restoreEnergy: (amount) => set({ energy: Math.min(100, get().energy + amount) }),

      addGold: (amount) => set({ gold: Math.max(0, get().gold + amount) }),

      unlockTitle: (title) =>
        set((state) =>
          state.unlockedTitles.includes(title)
            ? state
            : { unlockedTitles: [...state.unlockedTitles, title] },
        ),

      setActiveTitle: (title) => set({ activeTitle: title }),

      resetProgress: () => set({ ...initialState, isOnboarded: false }),
    }),
    {
      name: "solo-leveling.player",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
