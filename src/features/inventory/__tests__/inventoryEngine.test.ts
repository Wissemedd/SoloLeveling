import { bonusesAtUpgradeLevel, canEquip, slotForCategory, totalEquipmentBonuses } from "../engine/inventoryEngine";
import { getItemDefinition } from "../data/items";
import type { EquipmentSlots } from "../types";

const rustedBlade = getItemDefinition("rusted-blade")!;

describe("inventoryEngine", () => {
  it("bonusesAtUpgradeLevel adds 10% per level on top of the base bonus", () => {
    const base = bonusesAtUpgradeLevel(rustedBlade, 0);
    const upgraded = bonusesAtUpgradeLevel(rustedBlade, 5);
    expect(base.attackPower).toBe(rustedBlade.baseBonuses.attackPower);
    expect(upgraded.attackPower).toBeGreaterThan(base.attackPower!);
  });

  it("slotForCategory maps equipment categories and rejects non-equipment categories", () => {
    expect(slotForCategory("weapon")).toBe("weapon");
    expect(slotForCategory("potion")).toBeNull();
    expect(slotForCategory("material")).toBeNull();
  });

  it("canEquip enforces the level requirement", () => {
    expect(canEquip(rustedBlade, 1).ok).toBe(true);
    const highLevelItem = getItemDefinition("sovereigns-edge")!;
    expect(canEquip(highLevelItem, 1).ok).toBe(false);
    expect(canEquip(highLevelItem, 60).ok).toBe(true);
  });

  it("totalEquipmentBonuses sums bonuses across every equipped slot", () => {
    const slots: EquipmentSlots = { weapon: "instance-1", helmet: null, armor: null, gloves: null, boots: null, ring: null, necklace: null };
    const total = totalEquipmentBonuses(slots, (instanceId) =>
      instanceId === "instance-1" ? { def: rustedBlade, upgradeLevel: 0 } : undefined,
    );
    expect(total.attackPower).toBe(rustedBlade.baseBonuses.attackPower);
  });
});
