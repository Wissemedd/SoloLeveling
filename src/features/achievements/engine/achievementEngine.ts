import { achievements } from "../data/achievements";
import type { Achievement, LifetimeStats } from "../types";

/** Returns achievements whose threshold is met by `stats` but aren't in `unlockedIds` yet. */
export function evaluateNewlyUnlocked(stats: LifetimeStats, unlockedIds: string[]): Achievement[] {
  return achievements.filter(
    (a) => !unlockedIds.includes(a.id) && stats[a.metric] >= a.targetValue,
  );
}

export function achievementProgress(stats: LifetimeStats, achievement: Achievement): number {
  return Math.min(1, stats[achievement.metric] / achievement.targetValue);
}
