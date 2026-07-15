import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import type { LootReward } from "../types";

type RewardsStore = {
  /** Cosmetic pulls only — gold/xp are applied straight to the player store. */
  collection: LootReward[];
  addCosmetics: (rewards: LootReward[]) => void;
};

export const useRewardsStore = create<RewardsStore>()(
  persist(
    (set, get) => ({
      collection: [],
      addCosmetics: (rewards) => {
        const cosmetics = rewards.filter((r) => r.kind !== "gold" && r.kind !== "xp");
        if (cosmetics.length === 0) return;
        set({ collection: [...cosmetics, ...get().collection] });
      },
    }),
    {
      name: "solo-leveling.rewards",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
