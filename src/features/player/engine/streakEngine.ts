import type { StreakState } from "../types";

function toUtcDays(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
}

function daysBetween(fromIso: string, toIso: string): number {
  return toUtcDays(toIso) - toUtcDays(fromIso);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export type StreakStatus = {
  /** True the day after a completion, before today's quest is done — streak is on the line. */
  isAtRisk: boolean;
  /** True once two or more full days have passed with no completion. */
  isBroken: boolean;
  daysSinceLastCompletion: number | null;
};

export function getStreakStatus(streak: StreakState, today: string = todayIso()): StreakStatus {
  if (!streak.lastCompletedDate) {
    return { isAtRisk: false, isBroken: false, daysSinceLastCompletion: null };
  }
  const gap = daysBetween(streak.lastCompletedDate, today);
  return {
    isAtRisk: gap === 1,
    isBroken: gap >= 2,
    daysSinceLastCompletion: gap,
  };
}

/**
 * Run once per app session (e.g. on Home mount) to reconcile a streak against
 * missed days. A missed day burns a shield if one is banked; only an
 * unshielded miss decays the streak, and it decays by half rather than to
 * zero — an off day shouldn't erase weeks of consistency.
 */
export function applyDailyDecay(streak: StreakState, today: string = todayIso()): StreakState {
  const status = getStreakStatus(streak, today);
  if (!status.isBroken) return streak;

  if (streak.shields > 0) {
    return { ...streak, shields: streak.shields - 1, lastCompletedDate: today };
  }

  return {
    ...streak,
    current: Math.floor(streak.current / 2),
    lastCompletedDate: today,
  };
}

/** Call when the hunter completes their first quest of the day. Idempotent per day. */
export function recordDailyCompletion(streak: StreakState, today: string = todayIso()): StreakState {
  if (streak.lastCompletedDate === today) return streak;

  const decayed = applyDailyDecay(streak, today);
  const next = decayed.current + 1;

  return {
    ...decayed,
    current: next,
    longest: Math.max(decayed.longest, next),
    lastCompletedDate: today,
  };
}
