import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import type { ActivityTypeId } from "../types";

export type ActivityLogEntry = {
  id: string;
  activityId: ActivityTypeId;
  units: number;
  loggedAt: string; // ISO datetime
  xpEarned: number;
};

const HISTORY_LIMIT = 100;

type ActivityStore = {
  /** date (yyyy-mm-dd) -> activityId -> units already logged that day, for the daily-cap check. */
  loggedUnitsByDate: Record<string, Partial<Record<ActivityTypeId, number>>>;
  history: ActivityLogEntry[];
  loggedToday: (date: string, activityId: ActivityTypeId) => number;
  recordLog: (date: string, entry: ActivityLogEntry) => void;
};

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      loggedUnitsByDate: {},
      history: [],

      loggedToday: (date, activityId) => get().loggedUnitsByDate[date]?.[activityId] ?? 0,

      recordLog: (date, entry) => {
        const day = get().loggedUnitsByDate[date] ?? {};
        set({
          loggedUnitsByDate: {
            ...get().loggedUnitsByDate,
            [date]: { ...day, [entry.activityId]: (day[entry.activityId] ?? 0) + entry.units },
          },
          history: [entry, ...get().history].slice(0, HISTORY_LIMIT),
        });
      },
    }),
    {
      name: "solo-leveling.activities",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
