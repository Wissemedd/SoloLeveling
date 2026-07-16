import type { Ionicons } from "@expo/vector-icons";
import type { HunterRank, RpgStatKey } from "@/features/player/types";
import type { AchievementMetric } from "@/features/achievements/types";

/** Ties a class tree to the archetype picked at hunter creation ("monarch" is the Wissem-only secret root). */
export type ClassArchetypeId = "vanguard" | "phantom" | "priest" | "mage" | "monarch";

export type ClassRequirement = {
  minLevel: number;
  /** Satisfied if any of these stats is currently among the hunter's top-2 RPG stats. */
  dominantStats?: RpgStatKey[];
  metric?: AchievementMetric;
  metricThreshold?: number;
};

export type ClassNode = {
  id: string;
  archetype: ClassArchetypeId;
  name: string;
  tagline: string;
  /** Reuses the hunter rank ladder (E..S) as the class evolution tier. */
  rank: HunterRank;
  /** null on the shared trunk (tier E/D); set once a branch fork is taken. */
  branch: string | null;
  parentId: string | null;
  icon: keyof typeof Ionicons.glyphMap;
  /** null only on the tier-E root, which is granted automatically at hunter creation. */
  requirement: ClassRequirement | null;
};
