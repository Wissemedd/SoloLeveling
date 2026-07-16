import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";

export type BestiaryEntry = {
  monsterId: string;
  encounters: number;
  victories: number;
  firstSeenAt: string;
  lastSeenAt: string;
};

type BestiaryStore = {
  entries: Record<string, BestiaryEntry>;
  recordEncounter: (monsterId: string, won: boolean) => void;
  isDiscovered: (monsterId: string) => boolean;
};

export const useBestiaryStore = create<BestiaryStore>()(
  persist(
    (set, get) => ({
      entries: {},

      recordEncounter: (monsterId, won) => {
        const now = new Date().toISOString();
        const existing = get().entries[monsterId];
        const entry: BestiaryEntry = existing
          ? { ...existing, encounters: existing.encounters + 1, victories: existing.victories + (won ? 1 : 0), lastSeenAt: now }
          : { monsterId, encounters: 1, victories: won ? 1 : 0, firstSeenAt: now, lastSeenAt: now };
        set({ entries: { ...get().entries, [monsterId]: entry } });
      },

      isDiscovered: (monsterId) => !!get().entries[monsterId],
    }),
    {
      name: "solo-leveling.bestiary",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
