import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { useBestiaryStore } from "@/features/monsters/store/bestiaryStore";
import { useDungeonStore } from "@/features/dungeons/store/dungeonStore";
import type { Gate } from "@/features/dungeons/types";
import type { Achievement } from "@/features/achievements/types";
import type { CombatLog } from "../types";
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
 * The reward half of a Gate run, given a CombatLog already resolved by the
 * interactive fight (see useInteractiveCombat). Only ever writes to
 * inventory/gold/bestiary/achievements/combat-history — never grantXpToPlayer
 * or applyStatRewards, since Gates are a rewards/visualization layer on top
 * of the real progression in player/workouts/activities.
 */
export function useFinalizeGateRun() {
  const addGold = usePlayerStore((s) => s.addGold);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);
  const addItem = useInventoryStore((s) => s.addItem);
  const recordEncounter = useBestiaryStore((s) => s.recordEncounter);
  const consumeGate = useDungeonStore((s) => s.consumeGate);
  const addHistoryEntry = useCombatHistoryStore((s) => s.addEntry);

  return function finalizeGateRun(gate: Gate, log: CombatLog, characterMaxHealth: number): RunGateSummary {
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
      characterMaxHealth,
      goldEarned: loot.gold,
      itemIdsEarned: loot.itemIds,
      newlyUnlockedAchievements,
    };
  };
}
