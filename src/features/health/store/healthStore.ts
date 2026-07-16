import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import {
  checkAvailability,
  hasStepsPermission,
  readTodaySteps,
  requestStepsPermission,
} from "../services/healthConnectService";

export type HealthConnectionStatus =
  | "disconnected" // never connected, or permission was revoked
  | "connected" // permission granted, steps are syncing
  | "needs-update" // Health Connect is installed but needs a provider update
  | "unavailable" // not installed, or this build doesn't include the native module yet
  | "unsupported-platform"; // iOS — Health Connect is Android-only

type HealthStore = {
  status: HealthConnectionStatus;
  todaySteps: number;
  lastSyncedAt: string | null;
  /** Steps already converted into XP/lifetime counters, keyed by local date (yyyy-mm-dd) so re-syncing the same day only credits the delta. */
  creditedStepsByDate: Record<string, number>;
  connect: () => Promise<HealthConnectionStatus>;
  disconnect: () => void;
  refreshStatus: () => Promise<void>;
  pullTodaySteps: () => Promise<number>;
  markCredited: (date: string, totalStepsCreditedForDate: number) => void;
  creditedOn: (date: string) => number;
};

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      status: "disconnected",
      todaySteps: 0,
      lastSyncedAt: null,
      creditedStepsByDate: {},

      connect: async () => {
        const availability = await checkAvailability();
        if (availability !== "available") {
          set({ status: availability });
          return availability;
        }
        const granted = await requestStepsPermission();
        const status: HealthConnectionStatus = granted ? "connected" : "disconnected";
        set({ status });
        return status;
      },

      disconnect: () => set({ status: "disconnected", todaySteps: 0 }),

      refreshStatus: async () => {
        const availability = await checkAvailability();
        if (availability !== "available") {
          set({ status: availability });
          return;
        }
        const granted = await hasStepsPermission();
        set({ status: granted ? "connected" : "disconnected" });
      },

      pullTodaySteps: async () => {
        if (get().status !== "connected") return 0;
        const steps = await readTodaySteps();
        set({ todaySteps: steps, lastSyncedAt: new Date().toISOString() });
        return steps;
      },

      markCredited: (date, totalStepsCreditedForDate) =>
        set((state) => ({ creditedStepsByDate: { ...state.creditedStepsByDate, [date]: totalStepsCreditedForDate } })),

      creditedOn: (date) => get().creditedStepsByDate[date] ?? 0,
    }),
    {
      name: "solo-leveling.health",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
