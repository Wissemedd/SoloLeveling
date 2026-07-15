export type CoachTipCategory =
  | "streak_warning"
  | "recovery_suggestion"
  | "intensity_adjustment"
  | "comeback_encouragement"
  | "celebration";

export type CoachTip = {
  category: CoachTipCategory;
  message: string;
};

export type CoachContext = {
  isStreakAtRisk: boolean;
  energy: number; // 0..100
  daysSinceLastWorkout: number | null;
  workoutsInLast7Days: number;
  justLeveledUp: boolean;
};
