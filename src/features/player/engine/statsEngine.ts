import { RPG_STAT_KEYS, RpgStatKey, RpgStats } from "../types";

export function createBaseStats(overrides: Partial<RpgStats> = {}): RpgStats {
  const base: RpgStats = {
    strength: 10,
    agility: 10,
    endurance: 10,
    focus: 10,
    discipline: 10,
    vitality: 10,
  };
  return { ...base, ...overrides };
}

/** Adds partial stat rewards (e.g. from a completed workout) onto the current stat block. */
export function applyStatGains(stats: RpgStats, gains: Partial<RpgStats>): RpgStats {
  const next = { ...stats };
  for (const key of RPG_STAT_KEYS) {
    const gain = gains[key];
    if (gain) next[key] = next[key] + gain;
  }
  return next;
}

/** Single number used for leaderboard sorting and the profile "power level" readout. */
export function powerLevel(stats: RpgStats): number {
  return RPG_STAT_KEYS.reduce((sum, key) => sum + stats[key], 0);
}

export function highestStat(stats: RpgStats): { key: RpgStatKey; value: number } {
  return RPG_STAT_KEYS.reduce(
    (best, key) => (stats[key] > best.value ? { key, value: stats[key] } : best),
    { key: RPG_STAT_KEYS[0], value: stats[RPG_STAT_KEYS[0]] },
  );
}
