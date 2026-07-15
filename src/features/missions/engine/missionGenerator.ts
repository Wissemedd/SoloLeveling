import { missionTemplates } from "../data/missionTemplates";
import type { MissionInstance, MissionPeriod, MissionTemplate } from "../types";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function endOfDay(from: Date): Date {
  const d = new Date(from);
  d.setHours(23, 59, 59, 999);
  return d;
}

function endOfWeek(from: Date): Date {
  const d = new Date(from);
  const daysUntilSunday = 7 - d.getDay();
  d.setDate(d.getDate() + (daysUntilSunday === 7 ? 0 : daysUntilSunday));
  return endOfDay(d);
}

function endOfMonth(from: Date): Date {
  return new Date(from.getFullYear(), from.getMonth() + 1, 0, 23, 59, 59, 999);
}

const EXPIRY_BY_PERIOD: Record<MissionPeriod, (from: Date) => Date> = {
  daily: endOfDay,
  weekly: endOfWeek,
  monthly: endOfMonth,
  legendary: endOfMonth,
};

function instantiate(template: MissionTemplate, now: Date): MissionInstance {
  return {
    instanceId: `${template.id}-${now.toISOString().slice(0, 10)}`,
    templateId: template.id,
    title: template.title,
    description: template.description,
    period: template.period,
    metric: template.metric,
    targetValue: template.targetValue,
    progress: 0,
    xpReward: template.xpReward,
    goldReward: template.goldReward,
    expiresAt: EXPIRY_BY_PERIOD[template.period](now).toISOString(),
    completedAt: null,
    claimedAt: null,
  };
}

const COUNT_BY_PERIOD: Record<MissionPeriod, number> = {
  daily: 3,
  weekly: 2,
  monthly: 1,
  legendary: 1,
};

/** Draws a fresh, random set of missions for a given period. */
export function generateMissions(period: MissionPeriod, now: Date = new Date()): MissionInstance[] {
  const pool = missionTemplates.filter((t) => t.period === period);
  const count = Math.min(COUNT_BY_PERIOD[period], pool.length);
  return shuffle(pool)
    .slice(0, count)
    .map((template) => instantiate(template, now));
}

export function applyProgress(instance: MissionInstance, amount: number, now: Date = new Date()): MissionInstance {
  if (instance.completedAt) return instance;
  const progress = Math.min(instance.targetValue, instance.progress + amount);
  const completedAt = progress >= instance.targetValue ? now.toISOString() : null;
  return { ...instance, progress, completedAt };
}

export function claim(instance: MissionInstance, now: Date = new Date()): MissionInstance {
  if (!instance.completedAt || instance.claimedAt) return instance;
  return { ...instance, claimedAt: now.toISOString() };
}

export function isExpired(instance: MissionInstance, now: Date = new Date()): boolean {
  return now.getTime() > new Date(instance.expiresAt).getTime();
}
