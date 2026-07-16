import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { GATE_REFRESH_HOURS, generateGatesForRegion, isGateExpired } from "../engine/gateEngine";
import type { Gate } from "../types";

type DungeonStore = {
  gatesByRegion: Record<string, Gate[]>;
  lastRefreshedAt: Record<string, string>;
  getActiveGates: (regionId: string) => Gate[];
  /** Regenerates a region's Gates once the current batch is empty/expired AND the refresh cooldown has passed — the anti-farming throttle alongside the energy cost. */
  refreshGates: (regionId: string) => void;
  consumeGate: (regionId: string, gateId: string) => void;
};

export const useDungeonStore = create<DungeonStore>()(
  persist(
    (set, get) => ({
      gatesByRegion: {},
      lastRefreshedAt: {},

      getActiveGates: (regionId) => (get().gatesByRegion[regionId] ?? []).filter((g) => !isGateExpired(g)),

      refreshGates: (regionId) => {
        const now = new Date();
        const active = get().getActiveGates(regionId);
        if (active.length > 0) return;

        const lastRefresh = get().lastRefreshedAt[regionId];
        if (lastRefresh) {
          const hoursSince = (now.getTime() - new Date(lastRefresh).getTime()) / (1000 * 60 * 60);
          if (hoursSince < GATE_REFRESH_HOURS) return;
        }

        set({
          gatesByRegion: { ...get().gatesByRegion, [regionId]: generateGatesForRegion(regionId, now) },
          lastRefreshedAt: { ...get().lastRefreshedAt, [regionId]: now.toISOString() },
        });
      },

      consumeGate: (regionId, gateId) => {
        const remaining = (get().gatesByRegion[regionId] ?? []).filter((g) => g.id !== gateId);
        set({ gatesByRegion: { ...get().gatesByRegion, [regionId]: remaining } });
      },
    }),
    {
      name: "solo-leveling.dungeons",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
