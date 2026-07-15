import type { LifetimeStats } from "../types";

type Counters = Omit<LifetimeStats, "level" | "longestStreak">;

export function deriveLifetimeStats(counters: Counters, level: number, longestStreak: number): LifetimeStats {
  return { ...counters, level, longestStreak };
}
