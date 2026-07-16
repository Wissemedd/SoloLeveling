import type { Ionicons } from "@expo/vector-icons";
import type { CombatBonuses } from "@/features/inventory/types";

type IconName = keyof typeof Ionicons.glyphMap;

export type SkillKind = "active" | "passive";

export type SkillDefinition = {
  id: string;
  name: string;
  description: string;
  kind: SkillKind;
  icon: IconName;
  /** Active skills only — rounds before it can be triggered again. */
  cooldownRounds?: number;
  /** Passive: added to combatBonuses permanently. Active: added only on the round it fires. */
  bonuses: Partial<CombatBonuses>;
};

export type ClassSkillSet = {
  active: SkillDefinition;
  passive: SkillDefinition;
};
