import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useAchievementStore } from "../store/achievementStore";
import { deriveLifetimeStats } from "../engine/deriveLifetimeStats";
import type { Achievement, LifetimeStats } from "../types";

/** A snapshot read (not a hook) — safe to call from inside another hook's returned callback. */
export function getCurrentLifetimeStats(): LifetimeStats {
  const { level, streak } = usePlayerStore.getState();
  const { counters } = useLifetimeStatsStore.getState();
  return deriveLifetimeStats(counters, level, streak.longest);
}

/**
 * Shared tail of every progress-worthy flow (workouts, synced steps, logged
 * activities): re-derive LifetimeStats from current state and check
 * achievements against it. Call after recording lifetime counters. Pass an
 * already-derived `lifetimeStats` if the caller needs that value for
 * something else too (e.g. class-evolution eligibility), to avoid deriving
 * it twice.
 */
export function useEvaluateProgressionRewards() {
  const evaluate = useAchievementStore((s) => s.evaluate);

  return function evaluateProgressionRewards(lifetimeStats?: LifetimeStats): Achievement[] {
    return evaluate(lifetimeStats ?? getCurrentLifetimeStats());
  };
}
