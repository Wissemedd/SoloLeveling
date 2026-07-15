import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { applyProgress, claim, generateMissions, isExpired } from "../engine/missionGenerator";
import type { MissionInstance, MissionMetric, MissionPeriod } from "../types";

const PERIODS: MissionPeriod[] = ["daily", "weekly", "monthly", "legendary"];

type MissionStore = {
  active: MissionInstance[];
  /** Drops expired missions and tops each period back up to its quota. Call on app open. */
  refreshBoard: () => void;
  incrementProgress: (metric: MissionMetric, amount: number) => MissionInstance[];
  claimMission: (instanceId: string) => MissionInstance | null;
};

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      active: [],

      refreshBoard: () => {
        const now = new Date();
        const kept = get().active.filter((m) => !isExpired(m, now));
        const next = [...kept];
        for (const period of PERIODS) {
          if (!kept.some((m) => m.period === period)) {
            next.push(...generateMissions(period, now));
          }
        }
        set({ active: next });
      },

      incrementProgress: (metric, amount) => {
        const now = new Date();
        const updated = get().active.map((m) => (m.metric === metric ? applyProgress(m, amount, now) : m));
        set({ active: updated });
        return updated.filter((m) => m.metric === metric);
      },

      claimMission: (instanceId) => {
        const current = get().active.find((m) => m.instanceId === instanceId);
        if (!current) return null;
        const claimed = claim(current);
        set({ active: get().active.map((m) => (m.instanceId === instanceId ? claimed : m)) });
        return claimed;
      },
    }),
    {
      name: "solo-leveling.missions",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
