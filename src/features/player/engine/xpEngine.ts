import type { XpGrantResult } from "../types";

/** Tune these two to reshape the entire level curve. */
const BASE_XP = 100;
const GROWTH = 1.55;
export const LEVEL_CAP = 200;

/** XP required to advance FROM `level` TO `level + 1`. */
function xpToReachNextLevel(level: number): number {
  if (level < 1) return 0;
  return Math.round(BASE_XP * Math.pow(level, GROWTH));
}

/** Cumulative XP needed to reach each level, precomputed once at module load. */
const cumulativeXpForLevel: number[] = (() => {
  const table: number[] = [0, 0]; // index 0 unused, level 1 starts at 0 xp
  let total = 0;
  for (let level = 1; level < LEVEL_CAP; level++) {
    total += xpToReachNextLevel(level);
    table.push(total);
  }
  return table;
})();

export function totalXpForLevel(level: number): number {
  const clamped = Math.min(Math.max(level, 1), LEVEL_CAP);
  return cumulativeXpForLevel[clamped];
}

export function levelForTotalXp(totalXp: number): number {
  let level = 1;
  for (let l = LEVEL_CAP; l >= 1; l--) {
    if (totalXp >= cumulativeXpForLevel[l]) {
      level = l;
      break;
    }
  }
  return level;
}

export function xpProgress(totalXp: number) {
  const level = levelForTotalXp(totalXp);
  const currentFloor = totalXpForLevel(level);
  const nextCeiling = level >= LEVEL_CAP ? currentFloor : totalXpForLevel(level + 1);
  return {
    level,
    xpIntoLevel: totalXp - currentFloor,
    xpForNextLevel: nextCeiling - currentFloor,
  };
}

/** Applies an XP gain to a running total and reports whether the hunter leveled up. */
export function grantXp(currentTotalXp: number, amount: number): XpGrantResult {
  const previous = xpProgress(currentTotalXp);
  const newTotalXp = Math.max(0, currentTotalXp + amount);
  const next = xpProgress(newTotalXp);

  return {
    previousLevel: previous.level,
    newLevel: next.level,
    leveledUp: next.level > previous.level,
    levelsGained: next.level - previous.level,
    totalXp: newTotalXp,
    xpIntoLevel: next.xpIntoLevel,
    xpForNextLevel: next.xpForNextLevel,
  };
}
