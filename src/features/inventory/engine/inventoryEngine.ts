import { addCombatBonuses, emptyCombatBonuses } from "../types";
import type { CombatBonuses, EquipmentSlotId, EquipmentSlots, ItemDefinition } from "../types";

const CATEGORY_TO_SLOT: Partial<Record<ItemDefinition["category"], EquipmentSlotId>> = {
  weapon: "weapon",
  helmet: "helmet",
  armor: "armor",
  gloves: "gloves",
  boots: "boots",
  ring: "ring",
  necklace: "necklace",
};

/** Each Forge upgrade level adds +10% of the item's base bonuses (linear, capped by maxUpgradeLevel). */
export function bonusesAtUpgradeLevel(def: ItemDefinition, upgradeLevel: number): Partial<CombatBonuses> {
  const multiplier = 1 + Math.max(0, upgradeLevel) * 0.1;
  const scaled: Partial<CombatBonuses> = {};
  for (const [key, value] of Object.entries(def.baseBonuses) as [keyof CombatBonuses, number][]) {
    scaled[key] = Math.round(value * multiplier * 100) / 100;
  }
  return scaled;
}

export function slotForCategory(category: ItemDefinition["category"]): EquipmentSlotId | null {
  return CATEGORY_TO_SLOT[category] ?? null;
}

export function canEquip(def: ItemDefinition, hunterLevel: number): { ok: boolean; reason?: string } {
  const slot = slotForCategory(def.category);
  if (!slot) return { ok: false, reason: "This item can't be equipped." };
  if (hunterLevel < def.levelRequirement) return { ok: false, reason: `Requires level ${def.levelRequirement}.` };
  return { ok: true };
}

/** Sums the combat bonuses of every currently-equipped item, accounting for Forge upgrade levels. */
export function totalEquipmentBonuses(
  slots: EquipmentSlots,
  resolveInstance: (itemInstanceId: string) => { def: ItemDefinition; upgradeLevel: number } | undefined,
): CombatBonuses {
  let total = emptyCombatBonuses();
  for (const instanceId of Object.values(slots)) {
    if (!instanceId) continue;
    const resolved = resolveInstance(instanceId);
    if (!resolved) continue;
    total = addCombatBonuses(total, bonusesAtUpgradeLevel(resolved.def, resolved.upgradeLevel));
  }
  return total;
}
