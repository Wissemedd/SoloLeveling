import { deriveCombatAttributes } from "../engine/combatAttributes";
import { createBaseStats } from "@/features/player/engine/statsEngine";
import { emptyCombatBonuses } from "@/features/inventory/types";

describe("combatAttributes", () => {
  it("derives sane attributes from base stats with no gear or class bonuses", () => {
    const attrs = deriveCombatAttributes(createBaseStats());
    expect(attrs.attackPower).toBeGreaterThan(0);
    expect(attrs.defense).toBeGreaterThan(0);
    expect(attrs.maxHealth).toBeGreaterThan(0);
    expect(attrs.critChance).toBeGreaterThanOrEqual(0);
    expect(attrs.critChance).toBeLessThanOrEqual(1);
    expect(attrs.dodgeChance).toBeGreaterThanOrEqual(0);
    expect(attrs.dodgeChance).toBeLessThanOrEqual(1);
  });

  it("higher real stats always produce higher combat attributes", () => {
    const weak = deriveCombatAttributes(createBaseStats());
    const strong = deriveCombatAttributes(createBaseStats({ strength: 80, agility: 80, endurance: 80, vitality: 80, focus: 80, discipline: 80 }));
    expect(strong.attackPower).toBeGreaterThan(weak.attackPower);
    expect(strong.defense).toBeGreaterThan(weak.defense);
    expect(strong.maxHealth).toBeGreaterThan(weak.maxHealth);
  });

  it("gear and class bonuses stack additively on top of the stat-derived base", () => {
    const base = deriveCombatAttributes(createBaseStats());
    const geared = deriveCombatAttributes(createBaseStats(), { ...emptyCombatBonuses(), attackPower: 50 }, { ...emptyCombatBonuses(), defense: 20 });
    expect(geared.attackPower).toBe(base.attackPower + 50);
    expect(geared.defense).toBe(base.defense + 20);
  });

  it("clamps crit/dodge chance to [0,1] even with extreme bonuses", () => {
    const attrs = deriveCombatAttributes(createBaseStats(), { ...emptyCombatBonuses(), critChance: 5, dodgeChance: 5 });
    expect(attrs.critChance).toBe(1);
    expect(attrs.dodgeChance).toBe(1);
  });
});
