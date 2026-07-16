import type { Ionicons } from "@expo/vector-icons";
import type { RpgStatKey, RpgStats } from "@/features/player/types";
import type { MissionMetric } from "@/features/missions/types";

type IconName = keyof typeof Ionicons.glyphMap;

/**
 * Real-world, manually-logged activities beyond structured workouts and
 * synced steps. This is the ONLY place outside `workouts`/`health` allowed
 * to grant XP/RpgStats — the Adventure/RPG layer never does (see
 * src/features/dungeons, /combat: they only ever read stats, never write).
 */
export type ActivityTypeId =
  | "reading"
  | "manga"
  | "chores"
  | "stretching"
  | "meditation"
  | "hydration"
  | "sleep";

export type ActivityUnit = "minutes" | "liters" | "hours";

export type ActivityTypeDef = {
  id: ActivityTypeId;
  label: string;
  description: string;
  unit: ActivityUnit;
  icon: IconName;
  xpPerUnit: number;
  /** Units required to bank one point in a stat — mirrors stepsEngine's STEPS_PER_ENDURANCE_POINT divisor pattern. */
  unitsPerStatPoint: Partial<Record<RpgStatKey, number>>;
  /** Anti-farming ceiling: units beyond this per calendar day earn nothing. */
  dailyUnitCap: number;
  /** Optional hookup into the existing mission-progress metric of the same shape. */
  missionMetric?: MissionMetric;
};

export type ActivityLogResult = {
  acceptedUnits: number;
  xpEarned: number;
  statGains: Partial<RpgStats>;
  capReached: boolean;
};
