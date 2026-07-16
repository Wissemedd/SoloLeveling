import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import type { GateRank } from "@/features/dungeons/types";

export type CombatHistoryEntry = {
  id: string;
  gateId: string;
  regionId: string;
  rank: GateRank;
  gateCleared: boolean;
  monstersDefeated: number;
  bossDefeated: boolean;
  goldEarned: number;
  itemIds: string[];
  completedAt: string; // ISO datetime
};

const HISTORY_LIMIT = 50;

type CombatHistoryStore = {
  entries: CombatHistoryEntry[];
  addEntry: (entry: Omit<CombatHistoryEntry, "id" | "completedAt">) => CombatHistoryEntry;
};

export const useCombatHistoryStore = create<CombatHistoryStore>()(
  persist(
    (set, get) => ({
      entries: [],
      addEntry: (entry) => {
        const full: CombatHistoryEntry = { ...entry, id: `run-${Date.now()}`, completedAt: new Date().toISOString() };
        set({ entries: [full, ...get().entries].slice(0, HISTORY_LIMIT) });
        return full;
      },
    }),
    {
      name: "solo-leveling.combat-history",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
