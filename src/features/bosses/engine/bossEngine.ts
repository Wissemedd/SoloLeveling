import { bossForWeek } from "../data/bosses";
import type { Boss } from "../types";

/** ISO-ish week id (year + week number, week starts Monday) so the boss rotates every calendar week. */
export function weekId(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo}`;
}

function weekNumber(date: Date = new Date()): number {
  return Number(weekId(date).split("-W")[1]);
}

export function currentWeekBoss(date: Date = new Date()): Boss {
  return bossForWeek(weekNumber(date));
}

/** Every workout's XP reward becomes damage — training harder hits harder. */
export function damageFromXp(xpReward: number): number {
  return xpReward;
}

export function healthRemaining(boss: Boss, damageDealt: number): number {
  return Math.max(0, boss.maxHealth - damageDealt);
}

export function isDefeated(boss: Boss, damageDealt: number): boolean {
  return damageDealt >= boss.maxHealth;
}

/** Next Sunday at 23:59:59 local time — when the current boss cycle ends. */
export function bossCycleEnd(date: Date = new Date()): Date {
  const d = new Date(date);
  const daysUntilSunday = 7 - d.getDay();
  d.setDate(d.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
  d.setHours(23, 59, 59, 999);
  return d;
}
