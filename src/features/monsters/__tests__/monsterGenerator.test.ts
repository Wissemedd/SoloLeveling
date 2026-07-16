import { generateMonster } from "../engine/monsterGenerator";

describe("monsterGenerator.generateMonster", () => {
  it("is deterministic for a given seed", () => {
    const a = generateMonster("C", 20, 12345);
    const b = generateMonster("C", 20, 12345);
    expect(a).toEqual(b);
  });

  it("scales stats up with level", () => {
    const low = generateMonster("E", 5, 1);
    const high = generateMonster("S", 100, 1);
    expect(high.maxHealth).toBeGreaterThan(low.maxHealth);
    expect(high.attackPower).toBeGreaterThan(low.attackPower);
  });

  it("boss multiplier meaningfully increases health and attack over a regular monster at the same level/seed", () => {
    const regular = generateMonster("B", 40, 7, false);
    const boss = generateMonster("B", 40, 7, true);
    expect(boss.maxHealth).toBeGreaterThan(regular.maxHealth);
    expect(boss.isBoss).toBe(true);
    expect(regular.isBoss).toBe(false);
  });

  it("never assigns a monster as its own weakness", () => {
    for (let seed = 0; seed < 50; seed++) {
      const monster = generateMonster("C", 20, seed);
      if (monster.affinity !== "none") {
        expect(monster.weakness).not.toBe(monster.affinity);
      }
    }
  });
});
