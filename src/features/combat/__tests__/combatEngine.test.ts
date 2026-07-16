import { simulateCombat } from "../engine/combatEngine";
import type { CombatAttributes } from "../types";
import type { MonsterDefinition } from "@/features/monsters/types";

function makeMonster(overrides: Partial<MonsterDefinition> = {}): MonsterDefinition {
  return {
    id: "test-monster",
    name: "Test Monster",
    family: "beast",
    rank: "E",
    level: 1,
    description: "",
    icon: "paw",
    maxHealth: 30,
    attackPower: 5,
    defense: 1,
    speed: 5,
    critChance: 0.05,
    affinity: "none",
    weakness: null,
    resistance: null,
    lootTable: [{ itemId: "iron-fragment", weight: 50 }],
    goldRange: [1, 5],
    isBoss: false,
    ...overrides,
  };
}

const strongCharacter: CombatAttributes = {
  attackPower: 200,
  defense: 200,
  critChance: 0.1,
  dodgeChance: 0.5,
  elementalPower: 0,
  maxHealth: 500,
  speed: 50,
};

const weakCharacter: CombatAttributes = {
  attackPower: 2,
  defense: 0,
  critChance: 0,
  dodgeChance: 0,
  elementalPower: 0,
  maxHealth: 10,
  speed: 1,
};

describe("combatEngine.simulateCombat", () => {
  it("a vastly stronger character clears every monster and the boss", () => {
    const monsters = [makeMonster({ id: "m1" }), makeMonster({ id: "m2" })];
    const boss = makeMonster({ id: "boss", isBoss: true, maxHealth: 60 });
    const log = simulateCombat(strongCharacter, monsters, boss, { seed: 1 });

    expect(log.gateCleared).toBe(true);
    expect(log.encounters).toHaveLength(2);
    expect(log.encounters.every((e) => e.won)).toBe(true);
    expect(log.bossEncounter?.won).toBe(true);
  });

  it("a vastly weaker character loses and stops the run", () => {
    const monsters = [makeMonster({ id: "m1", attackPower: 500, maxHealth: 500 })];
    const boss = makeMonster({ id: "boss", isBoss: true, attackPower: 500, maxHealth: 500 });
    const log = simulateCombat(weakCharacter, monsters, boss, { seed: 2 });

    expect(log.gateCleared).toBe(false);
    expect(log.bossEncounter).toBeNull();
    expect(log.finalCharacterHp).toBe(0);
  });

  it("is deterministic for a given seed", () => {
    const monsters = [makeMonster()];
    const boss = makeMonster({ id: "boss", isBoss: true });
    const logA = simulateCombat({ ...strongCharacter, dodgeChance: 0.3 }, monsters, boss, { seed: 42 });
    const logB = simulateCombat({ ...strongCharacter, dodgeChance: 0.3 }, monsters, boss, { seed: 42 });
    expect(logA).toEqual(logB);
  });

  it("never lets damage drop to zero or below (always at least 1)", () => {
    const tankyMonster = makeMonster({ defense: 10_000, maxHealth: 5 });
    const log = simulateCombat(strongCharacter, [tankyMonster], makeMonster({ id: "boss", isBoss: true }), { seed: 3 });
    const characterHits = log.encounters[0].events.filter((e) => e.actor === "character" && e.damage !== undefined);
    expect(characterHits.every((e) => (e.damage ?? 0) >= 1)).toBe(true);
  });
});
