export type HunterRank = "E" | "D" | "C" | "B" | "A" | "S" | "National";

export type FitnessGoal =
  | "lose_fat"
  | "build_muscle"
  | "get_stronger"
  | "improve_cardio"
  | "healthy_lifestyle"
  | "hybrid_athlete";

export type FitnessLevel = "beginner" | "intermediate" | "advanced" | "elite";

export type Gender = "male" | "female" | "unspecified";

export type RpgStatKey =
  | "strength"
  | "agility"
  | "endurance"
  | "focus"
  | "discipline"
  | "vitality";

export type RpgStats = Record<RpgStatKey, number>;

export const RPG_STAT_KEYS: RpgStatKey[] = [
  "strength",
  "agility",
  "endurance",
  "focus",
  "discipline",
  "vitality",
];

export const RPG_STAT_LABELS: Record<RpgStatKey, string> = {
  strength: "Strength",
  agility: "Agility",
  endurance: "Endurance",
  focus: "Focus",
  discipline: "Discipline",
  vitality: "Vitality",
};

export type HunterProfile = {
  id: string;
  name: string;
  avatarId: string;
  heightCm: number;
  weightKg: number;
  gender: Gender;
  fitnessLevel: FitnessLevel;
  goals: FitnessGoal[];
  createdAt: string; // ISO date
};

export type StreakState = {
  current: number;
  longest: number;
  /** ISO date (yyyy-mm-dd) of the last day a quest was completed. */
  lastCompletedDate: string | null;
  /** A missed day burns one shield instead of resetting the streak to 0. */
  shields: number;
};

export type XpSource =
  | "workout"
  | "walking"
  | "stretching"
  | "meditation"
  | "hydration"
  | "sleep"
  | "personal_record"
  | "consistency"
  | "mission"
  | "boss";

export type XpGrantResult = {
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  levelsGained: number;
  totalXp: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
};

export type PlayerState = {
  profile: HunterProfile | null;
  xp: number;
  level: number;
  rank: HunterRank;
  stats: RpgStats;
  streak: StreakState;
  energy: number; // 0..100, regenerates daily, spent on workouts
  gold: number;
  unlockedTitles: string[];
  activeTitle: string | null;
};
