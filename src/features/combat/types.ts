export type CombatAttributes = {
  attackPower: number;
  defense: number;
  critChance: number; // 0..1
  dodgeChance: number; // 0..1
  elementalPower: number;
  maxHealth: number;
  speed: number;
};

export type CombatSide = "character" | "enemy";
export type CombatEventType = "attack" | "crit" | "dodge" | "skill" | "defeat" | "victory";

export type CombatEvent = {
  round: number;
  actor: CombatSide;
  type: CombatEventType;
  damage?: number;
  skillName?: string;
  targetHpAfter: number;
};

export type EncounterResult = {
  monsterId: string;
  monsterName: string;
  won: boolean;
  events: CombatEvent[];
};

export type CombatLog = {
  encounters: EncounterResult[];
  bossEncounter: EncounterResult | null;
  /** True only if every regular monster AND the boss were defeated. */
  gateCleared: boolean;
  finalCharacterHp: number;
};
