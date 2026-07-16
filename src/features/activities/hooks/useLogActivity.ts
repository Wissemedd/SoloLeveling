import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import type { Achievement } from "@/features/achievements/types";
import type { XpSource } from "@/features/player/types";
import { getActivityType } from "../data/activityTypes";
import { resolveActivityLog } from "../engine/activityEngine";
import { useActivityStore, type ActivityLogEntry } from "../store/activityStore";
import type { ActivityTypeId } from "../types";

function localDateIso(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export type LogActivitySummary = {
  acceptedUnits: number;
  requestedUnits: number;
  capReached: boolean;
  xpEarned: number;
  newlyUnlockedAchievements: Achievement[];
};

/**
 * Real-world activity logging (reading, manga, chores, stretching,
 * meditation, hydration, sleep). Mirrors useCompleteWorkout/useSyncSteps
 * exactly: the only difference is the source of the raw quantity is a
 * manual user entry instead of a workout session or a pedometer.
 */
export function useLogActivity() {
  const grantXpToPlayer = usePlayerStore((s) => s.grantXpToPlayer);
  const applyStatRewards = usePlayerStore((s) => s.applyStatRewards);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const incrementMissionProgress = useMissionStore((s) => s.incrementProgress);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);
  const loggedToday = useActivityStore((s) => s.loggedToday);
  const recordLog = useActivityStore((s) => s.recordLog);

  return function logActivity(activityId: ActivityTypeId, requestedUnits: number): LogActivitySummary | null {
    const def = getActivityType(activityId);
    if (!def) return null;

    const date = localDateIso(new Date());
    const alreadyLoggedToday = loggedToday(date, activityId);
    const result = resolveActivityLog(def, requestedUnits, alreadyLoggedToday);

    if (result.acceptedUnits <= 0) {
      return { acceptedUnits: 0, requestedUnits, capReached: result.capReached, xpEarned: 0, newlyUnlockedAchievements: [] };
    }

    grantXpToPlayer(result.xpEarned, activityId as XpSource);
    if (Object.keys(result.statGains).length > 0) applyStatRewards(result.statGains);

    const entry: ActivityLogEntry = {
      id: `${activityId}-${Date.now()}`,
      activityId,
      units: result.acceptedUnits,
      loggedAt: new Date().toISOString(),
      xpEarned: result.xpEarned,
    };
    recordLog(date, entry);

    if (def.missionMetric) incrementMissionProgress(def.missionMetric, result.acceptedUnits);

    const { level, streak } = usePlayerStore.getState();
    const { counters } = useLifetimeStatsStore.getState();
    const newlyUnlockedAchievements = evaluateAchievements(deriveLifetimeStats(counters, level, streak.longest));

    return {
      acceptedUnits: result.acceptedUnits,
      requestedUnits,
      capReached: result.capReached,
      xpEarned: result.xpEarned,
      newlyUnlockedAchievements,
    };
  };
}
