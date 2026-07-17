import { usePlayerStore } from "@/features/player/store/playerStore";
import { useClassStore } from "@/features/classes/store/classStore";
import { getNode } from "@/features/classes/engine/classEngine";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { getItemDefinition } from "@/features/inventory/data/items";
import { totalEquipmentBonuses } from "@/features/inventory/engine/inventoryEngine";
import { emptyCombatBonuses } from "@/features/inventory/types";
import { getSkillsForNode } from "@/features/skills/engine/skillEngine";
import type { SkillDefinition } from "@/features/skills/types";
import type { Gate } from "@/features/dungeons/types";
import type { CombatAttributes } from "../types";
import { deriveCombatAttributes } from "../engine/combatAttributes";

export type PreparedGateRun =
  | { ok: false; reason: string }
  | { ok: true; attributes: CombatAttributes; activeSkill?: SkillDefinition };

/**
 * The setup half of a Gate run: spends energy and derives the character's
 * combat attributes + active skill, read-only from real stats/gear/class —
 * never writes XP or RpgStats. Pairs with useFinalizeGateRun, which grants
 * rewards once the interactive fight is actually resolved.
 */
export function usePrepareGateRun() {
  const spendEnergy = usePlayerStore((s) => s.spendEnergy);
  const equipped = useInventoryStore((s) => s.equipped);
  const owned = useInventoryStore((s) => s.owned);
  const currentClassNodeId = useClassStore((s) => s.currentNodeId);

  return function prepareGateRun(gate: Gate): PreparedGateRun {
    if (!spendEnergy(gate.energyCost)) {
      return { ok: false, reason: "Not enough energy." };
    }

    const { stats } = usePlayerStore.getState();
    const gearBonuses = totalEquipmentBonuses(equipped, (instanceId) => {
      const instance = owned.find((i) => i.instanceId === instanceId);
      if (!instance) return undefined;
      const def = getItemDefinition(instance.itemId);
      return def ? { def, upgradeLevel: instance.upgradeLevel } : undefined;
    });

    const classNode = currentClassNodeId ? getNode(currentClassNodeId) : undefined;
    const skillSet = classNode ? getSkillsForNode(classNode) : null;
    const classBonuses = skillSet ? { ...emptyCombatBonuses(), ...skillSet.passive.bonuses } : emptyCombatBonuses();

    const attributes = deriveCombatAttributes(stats, gearBonuses, classBonuses);
    return { ok: true, attributes, activeSkill: skillSet?.active };
  };
}
