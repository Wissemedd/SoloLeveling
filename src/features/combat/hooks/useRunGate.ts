import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useClassStore } from "@/features/classes/store/classStore";
import { getNode } from "@/features/classes/engine/classEngine";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { getItemDefinition } from "@/features/inventory/data/items";
import { totalEquipmentBonuses } from "@/features/inventory/engine/inventoryEngine";
import { emptyCombatBonuses } from "@/features/inventory/types";
import { useBestiaryStore } from "@/features/monsters/store/bestiaryStore";
import { useDungeonStore } from "@/features/dungeons/store/dungeonStore";
import type { Gate } from "@/features/dungeons/types";
import { getSkillsForNode } from "@/features/skills/engine/skillEngine";
import type { Achievement } from "@/features/achievements/types";
import type { CombatLog } from "../types";
import { deriveCombatAttributes } from "../engine/combatAttributes";
import { simulateCombat } from "../engine/combatEngine";
import { rollGateLoot } from "../engine/dungeonLootEngine";
import { useCombatHistoryStore } from "../store/combatHistoryStore";

export type RunGateSummary = {
  ok: boolean;
  reason?: string;
  log?: CombatLog;
  characterMaxHealth?: number;
  goldEarned: number;
  itemIdsEarned: string[];
  newlyUnlockedAchievements: Achievement[];
};

/**
 * The Adventure-side counterpart to useCompleteWorkout — except it only
 * ever writes to inventory/gold/bestiary/achievements/combat-history. It
 * never calls grantXpToPlayer or applyStatRewards; combat attributes are
 * derived read-only from the hunter's real stats (see combatAttributes.ts).
 */
export function useRunGate() {
  const spendEnergy = usePlayerStore((s) => s.spendEnergy);
  const addGold = usePlayerStore((s) => s.addGold);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);
  const addItem = useInventoryStore((s) => s.addItem);
  const equipped = useInventoryStore((s) => s.equipped);
  const owned = useInventoryStore((s) => s.owned);
  const currentClassNodeId = useClassStore((s) => s.currentNodeId);
  const recordEncounter = useBestiaryStore((s) => s.recordEncounter);
  const consumeGate = useDungeonStore((s) => s.consumeGate);
  const addHistoryEntry = useCombatHistoryStore((s) => s.addEntry);

  return function runGate(gate: Gate): RunGateSummary {
    if (!spendEnergy(gate.energyCost)) {
      return { ok: false, reason: "Not enough energy.", goldEarned: 0, itemIdsEarned: [], newlyUnlockedAchievements: [] };
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
    const log = simulateCombat(attributes, gate.encounterMonsters, gate.boss, { activeSkill: skillSet?.active });

    const wonEncounters = log.encounters.filter((e) => e.won);
    const defeatedMonsters = gate.encounterMonsters.filter((m) => wonEncounters.some((e) => e.monsterId === m.id));
    const bossDefeated = log.bossEncounter?.won ?? false;

    for (const encounter of log.encounters) recordEncounter(encounter.monsterId, encounter.won);
    if (log.bossEncounter) recordEncounter(log.bossEncounter.monsterId, log.bossEncounter.won);

    const loot = rollGateLoot(defeatedMonsters, bossDefeated ? gate.boss : null);
    addGold(loot.gold);
    for (const itemId of loot.itemIds) addItem(itemId, 1, bossDefeated && itemId === loot.itemIds[loot.itemIds.length - 1] ? "boss" : "dungeon");

    recordLifetime({
      totalDungeonsCleared: log.gateCleared ? 1 : 0,
      totalMonstersDefeated: wonEncounters.length,
      totalBossesDefeated: bossDefeated ? 1 : 0,
    });

    consumeGate(gate.regionId, gate.id);

    addHistoryEntry({
      gateId: gate.id,
      regionId: gate.regionId,
      rank: gate.rank,
      gateCleared: log.gateCleared,
      monstersDefeated: wonEncounters.length,
      bossDefeated,
      goldEarned: loot.gold,
      itemIds: loot.itemIds,
    });

    const { level, streak } = usePlayerStore.getState();
    const { counters } = useLifetimeStatsStore.getState();
    const newlyUnlockedAchievements = evaluateAchievements(deriveLifetimeStats(counters, level, streak.longest));

    return {
      ok: true,
      log,
      characterMaxHealth: attributes.maxHealth,
      goldEarned: loot.gold,
      itemIdsEarned: loot.itemIds,
      newlyUnlockedAchievements,
    };
  };
}
