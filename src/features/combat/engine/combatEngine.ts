import type { MonsterDefinition } from "@/features/monsters/types";
import type { SkillDefinition } from "@/features/skills/types";
import type { CombatAttributes, CombatEvent, CombatLog, EncounterResult } from "../types";

const MAX_ROUNDS_PER_FIGHT = 40;

/** Mulberry32 — small, fast, deterministic PRNG so a fight is reproducible/testable from a seed. */
export function createRng(seed: number) {
  let a = seed >>> 0;
  return function rng(): number {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function elementalMultiplier(attackerAffinity: MonsterDefinition["affinity"] | "none", defenderWeakness?: MonsterDefinition["weakness"], defenderResistance?: MonsterDefinition["resistance"]): number {
  if (attackerAffinity === "none") return 1;
  if (defenderWeakness === attackerAffinity) return 1.5;
  if (defenderResistance === attackerAffinity) return 0.6;
  return 1;
}

export type Fighter = {
  hp: number;
  maxHp: number;
  attackPower: number;
  defense: number;
  critChance: number;
  dodgeChance: number;
  elementalPower: number;
};

export function createFighter(attributes: CombatAttributes): Fighter {
  return {
    hp: attributes.maxHealth,
    maxHp: attributes.maxHealth,
    attackPower: attributes.attackPower,
    defense: attributes.defense,
    critChance: attributes.critChance,
    dodgeChance: attributes.dodgeChance,
    elementalPower: attributes.elementalPower,
  };
}

/** The action the player chose for their turn this round; "skill" silently falls back to a normal attack if the skill is on cooldown. */
export type CombatAction = { type: "attack" } | { type: "skill" };

export type RoundOutcome = {
  events: CombatEvent[];
  monsterHp: number;
  characterHp: number;
  encounterOver: boolean;
  won: boolean;
};

/**
 * Resolves a single round (both sides act once, in speed order) of a
 * character-vs-monster encounter. Mutates `character.hp` and
 * `skillCooldown.remaining` in place. Forces a loss if the fight runs past
 * MAX_ROUNDS_PER_FIGHT, mirroring the old batch simulator's stalemate cap.
 */
export function resolveRound(
  round: number,
  character: Fighter,
  monster: MonsterDefinition,
  monsterHp: number,
  rng: () => number,
  action: CombatAction,
  activeSkill: SkillDefinition | undefined,
  skillCooldown: { remaining: number },
): RoundOutcome {
  const events: CombatEvent[] = [];
  const characterGoesFirst = character.attackPower + 5 >= monster.speed;
  const order: Array<"character" | "enemy"> = characterGoesFirst ? ["character", "enemy"] : ["enemy", "character"];

  for (const actor of order) {
    if (character.hp <= 0 || monsterHp <= 0) break;

    if (actor === "character") {
      let damage = character.attackPower + character.elementalPower * 0.3;
      let type: CombatEvent["type"] = "attack";
      let skillName: string | undefined;
      const canUseSkill = !!activeSkill && skillCooldown.remaining <= 0;
      const useSkill = action.type === "skill" && canUseSkill;

      if (useSkill && activeSkill) {
        damage += activeSkill.bonuses.attackPower ?? 0;
        damage += activeSkill.bonuses.elementalPower ?? 0;
        skillName = activeSkill.name;
        type = "skill";
        skillCooldown.remaining = activeSkill.cooldownRounds ?? 3;
      } else if (skillCooldown.remaining > 0) {
        skillCooldown.remaining -= 1;
      }

      const isCrit = rng() < character.critChance;
      damage = Math.max(1, Math.round((damage - monster.defense * 0.5) * (isCrit ? 1.6 : 1)));
      monsterHp = Math.max(0, monsterHp - damage);
      events.push({ round, actor: "character", type: isCrit && type === "attack" ? "crit" : type, damage, skillName, targetHpAfter: monsterHp });
    } else {
      const isDodge = rng() < character.dodgeChance;
      if (isDodge) {
        events.push({ round, actor: "enemy", type: "dodge", targetHpAfter: character.hp });
        continue;
      }
      const isCrit = rng() < monster.critChance;
      const elemMult = elementalMultiplier(monster.affinity, undefined, undefined);
      const damage = Math.max(1, Math.round((monster.attackPower - character.defense * 0.5) * (isCrit ? 1.5 : 1) * elemMult));
      character.hp = Math.max(0, character.hp - damage);
      events.push({ round, actor: "enemy", type: isCrit ? "crit" : "attack", damage, targetHpAfter: character.hp });
    }
  }

  let encounterOver = character.hp <= 0 || monsterHp <= 0;
  let won = monsterHp <= 0 && character.hp > 0;
  if (!encounterOver && round >= MAX_ROUNDS_PER_FIGHT) {
    encounterOver = true;
    won = false;
  }
  if (encounterOver) {
    events.push({ round, actor: won ? "character" : "enemy", type: won ? "victory" : "defeat", targetHpAfter: won ? monsterHp : character.hp });
  }

  return { events, monsterHp, characterHp: character.hp, encounterOver, won };
}

/**
 * Resolves an entire encounter in one shot by having the character
 * auto-act (fire the active skill whenever it's off cooldown, otherwise
 * attack) every round. Used for the full deterministic batch simulation
 * and for the in-combat "Auto" option that fast-resolves a fight.
 */
export function resolveFight(
  character: Fighter,
  monster: MonsterDefinition,
  rng: () => number,
  activeSkill: SkillDefinition | undefined,
  skillCooldown: { remaining: number },
  startingMonsterHp: number = monster.maxHealth,
  startingRound: number = 1,
): { won: boolean; events: CombatEvent[]; characterHpAfter: number } {
  const events: CombatEvent[] = [];
  let monsterHp = startingMonsterHp;

  for (let round = startingRound; round <= MAX_ROUNDS_PER_FIGHT; round++) {
    const canUseSkill = !!activeSkill && skillCooldown.remaining <= 0;
    const outcome = resolveRound(round, character, monster, monsterHp, rng, canUseSkill ? { type: "skill" } : { type: "attack" }, activeSkill, skillCooldown);
    events.push(...outcome.events);
    monsterHp = outcome.monsterHp;
    if (outcome.encounterOver) return { won: outcome.won, events, characterHpAfter: character.hp };
  }

  return { won: false, events, characterHpAfter: character.hp };
}

/**
 * Resolves a full Gate run: every regular monster in sequence, then the
 * boss, sharing one HP pool and one active-skill cooldown across the whole
 * run. Pure and seedable — never touches any store. Character attributes
 * come from deriveCombatAttributes (stats read-only + gear + class), so
 * this function can only ever affect inventory/gold/bestiary outcomes
 * downstream, never XP or RpgStats.
 */
export function simulateCombat(
  characterAttributes: CombatAttributes,
  encounterMonsters: MonsterDefinition[],
  boss: MonsterDefinition,
  options: { activeSkill?: SkillDefinition; seed?: number } = {},
): CombatLog {
  const rng = createRng(options.seed ?? Date.now());
  const fighter = createFighter(characterAttributes);
  const skillCooldown = { remaining: 0 };

  const encounters: EncounterResult[] = [];
  let alive = true;

  for (const monster of encounterMonsters) {
    if (!alive) break;
    const result = resolveFight(fighter, monster, rng, options.activeSkill, skillCooldown);
    encounters.push({ monsterId: monster.id, monsterName: monster.name, won: result.won, events: result.events });
    if (!result.won) alive = false;
  }

  let bossEncounter: EncounterResult | null = null;
  if (alive) {
    const result = resolveFight(fighter, boss, rng, options.activeSkill, skillCooldown);
    bossEncounter = { monsterId: boss.id, monsterName: boss.name, won: result.won, events: result.events };
    if (!result.won) alive = false;
  }

  return {
    encounters,
    bossEncounter,
    gateCleared: alive,
    finalCharacterHp: fighter.hp,
  };
}
