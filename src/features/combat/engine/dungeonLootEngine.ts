import type { MonsterDefinition } from "@/features/monsters/types";

export type GateLootResult = {
  gold: number;
  itemIds: string[];
};

function rollGold(range: [number, number]): number {
  return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
}

function rollLootTable(lootTable: MonsterDefinition["lootTable"]): string | null {
  const total = lootTable.reduce((sum, drop) => sum + drop.weight, 0);
  if (total <= 0) return null;
  let roll = Math.random() * 100; // weights are per-100 drop chance, not a full pie
  for (const drop of lootTable) {
    if (roll < drop.weight) return drop.itemId;
    roll -= drop.weight;
  }
  return null;
}

/**
 * Gold + item drops only — this module must NEVER touch XP or RpgStats
 * (see the "Aventure" stat-separation rule). Gold is a shared economy
 * currency (sport + adventure both feed it); items only affect combat
 * attributes, never the underlying stats.
 */
export function rollGateLoot(defeatedMonsters: MonsterDefinition[], defeatedBoss: MonsterDefinition | null): GateLootResult {
  let gold = 0;
  const itemIds: string[] = [];

  for (const monster of defeatedMonsters) {
    gold += rollGold(monster.goldRange);
    const drop = rollLootTable(monster.lootTable);
    if (drop) itemIds.push(drop);
  }

  if (defeatedBoss) {
    gold += rollGold(defeatedBoss.goldRange);
    const drop = rollLootTable(defeatedBoss.lootTable);
    if (drop) itemIds.push(drop);
    // Bosses get a second, near-guaranteed roll.
    if (Math.random() < 0.85) {
      const bonusDrop = rollLootTable(defeatedBoss.lootTable);
      if (bonusDrop) itemIds.push(bonusDrop);
    }
  }

  return { gold, itemIds };
}
