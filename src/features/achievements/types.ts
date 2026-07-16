export type LifetimeStats = {
  totalWorkouts: number;
  totalPushups: number;
  totalDistanceKm: number;
  longestStreak: number;
  totalCaloriesBurned: number;
  level: number;
  morningWorkouts: number; // completed before 7am
  nightWorkouts: number; // completed after 10pm
  totalSteps: number; // lifetime steps synced from a connected pedometer (e.g. Samsung Health)
  // Adventure-world counters — progress-only (unlock achievements/bestiary),
  // never fed back into XP or RpgStats. See src/features/dungeons, /combat.
  totalDungeonsCleared: number;
  totalMonstersDefeated: number;
  totalBossesDefeated: number;
  totalItemsCrafted: number;
};

export type AchievementMetric = keyof LifetimeStats;

export type Achievement = {
  id: string;
  title: string;
  description: string;
  metric: AchievementMetric;
  targetValue: number;
  tier: "common" | "rare" | "epic" | "legendary";
};

export type UnlockedAchievement = {
  achievementId: string;
  unlockedAt: string;
};
