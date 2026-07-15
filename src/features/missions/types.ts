export type MissionPeriod = "daily" | "weekly" | "monthly" | "legendary";

export type MissionMetric =
  | "workouts_completed"
  | "pushups"
  | "distance_km"
  | "water_liters"
  | "calories_burned"
  | "stretch_minutes"
  | "streak_days"
  | "early_workout"
  | "meditation_minutes";

export type MissionTemplate = {
  id: string;
  title: string;
  description: string;
  period: MissionPeriod;
  metric: MissionMetric;
  targetValue: number;
  xpReward: number;
  goldReward: number;
};

export type MissionInstance = {
  instanceId: string;
  templateId: string;
  title: string;
  description: string;
  period: MissionPeriod;
  metric: MissionMetric;
  targetValue: number;
  progress: number;
  xpReward: number;
  goldReward: number;
  /** ISO datetime after which this mission instance is discarded and regenerated. */
  expiresAt: string;
  completedAt: string | null;
  claimedAt: string | null;
};
