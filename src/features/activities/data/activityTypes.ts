import type { ActivityTypeDef } from "../types";

/**
 * Seed list of manually-loggable real-world activities. Reading/manga/chores
 * are new; stretching/meditation/hydration/sleep close a pre-existing gap —
 * `XpSource` and mission metrics already anticipated them but nothing in the
 * app ever granted XP or progressed those mission metrics until this module.
 */
export const activityTypes: ActivityTypeDef[] = [
  {
    id: "reading",
    label: "Reading",
    description: "Focused reading time — books, articles, study material.",
    unit: "minutes",
    icon: "book",
    xpPerUnit: 1.5,
    unitsPerStatPoint: { focus: 15 },
    dailyUnitCap: 60,
  },
  {
    id: "manga",
    label: "Manga",
    description: "Manga or light reading — a lighter dose of the same focus training.",
    unit: "minutes",
    icon: "reader",
    xpPerUnit: 1,
    unitsPerStatPoint: { focus: 25 },
    dailyUnitCap: 45,
  },
  {
    id: "chores",
    label: "Chores",
    description: "Housework and errands — unglamorous, but it builds real discipline.",
    unit: "minutes",
    icon: "home",
    xpPerUnit: 1.2,
    unitsPerStatPoint: { discipline: 20, vitality: 40 },
    dailyUnitCap: 60,
  },
  {
    id: "stretching",
    label: "Stretching",
    description: "Dedicated mobility and stretching work.",
    unit: "minutes",
    icon: "body",
    xpPerUnit: 1.5,
    unitsPerStatPoint: { agility: 15 },
    dailyUnitCap: 30,
    missionMetric: "stretch_minutes",
  },
  {
    id: "meditation",
    label: "Meditation",
    description: "Still-mind training — breathing, meditation, mental recovery.",
    unit: "minutes",
    icon: "leaf",
    xpPerUnit: 1.5,
    unitsPerStatPoint: { focus: 15, discipline: 20 },
    dailyUnitCap: 30,
    missionMetric: "meditation_minutes",
  },
  {
    id: "hydration",
    label: "Hydration",
    description: "Water intake, logged in liters.",
    unit: "liters",
    icon: "water",
    xpPerUnit: 10,
    unitsPerStatPoint: { vitality: 1.5 },
    dailyUnitCap: 4,
    missionMetric: "water_liters",
  },
  {
    id: "sleep",
    label: "Sleep",
    description: "Hours of sleep logged the morning after.",
    unit: "hours",
    icon: "moon",
    xpPerUnit: 8,
    unitsPerStatPoint: { vitality: 2, discipline: 3 },
    dailyUnitCap: 9,
  },
];

export function getActivityType(id: string): ActivityTypeDef | undefined {
  return activityTypes.find((a) => a.id === id);
}
