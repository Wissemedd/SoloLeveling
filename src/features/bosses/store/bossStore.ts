import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { currentWeekBoss, damageFromXp, isDefeated, weekId } from "../engine/bossEngine";

type BossStore = {
  weekId: string;
  damageDealt: number;
  defeatedWeekIds: string[];
  /** Reconciles the tracked week against "now" — call on Home mount. Resets damage on a new week. */
  syncWeek: () => void;
  dealDamageFromXp: (xpReward: number) => { defeatedJustNow: boolean };
};

export const useBossStore = create<BossStore>()(
  persist(
    (set, get) => ({
      weekId: weekId(),
      damageDealt: 0,
      defeatedWeekIds: [],

      syncWeek: () => {
        const current = weekId();
        if (current !== get().weekId) {
          set({ weekId: current, damageDealt: 0 });
        }
      },

      dealDamageFromXp: (xpReward) => {
        get().syncWeek();
        const boss = currentWeekBoss();
        const wasDefeated = isDefeated(boss, get().damageDealt);
        const nextDamage = get().damageDealt + damageFromXp(xpReward);
        const defeatedJustNow = !wasDefeated && isDefeated(boss, nextDamage);

        set({
          damageDealt: nextDamage,
          defeatedWeekIds: defeatedJustNow
            ? [...get().defeatedWeekIds, get().weekId]
            : get().defeatedWeekIds,
        });
        return { defeatedJustNow };
      },
    }),
    {
      name: "solo-leveling.boss",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
