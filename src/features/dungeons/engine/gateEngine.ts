import type { ItemRarity } from "@/features/inventory/types";
import { monsters } from "@/features/monsters/data/monsters";
import { generateMonster } from "@/features/monsters/engine/monsterGenerator";
import type { Gate, GateRank } from "../types";

// B and A are always force-included as the two featured boss gates (see
// generateGatesForRegion) — keeping them out of this pool avoids drawing
// a duplicate "B" gate on top of the guaranteed one.
const REGULAR_RANKS: GateRank[] = ["E", "D", "C"];

const ENERGY_COST: Record<GateRank, number> = { E: 10, D: 15, C: 20, B: 30, A: 45, S: 60, National: 80 };
const ESTIMATED_MINUTES: Record<GateRank, number> = { E: 3, D: 5, C: 8, B: 12, A: 18, S: 25, National: 35 };
const LOOT_PREVIEW: Record<GateRank, { rarity: ItemRarity; chance: number }[]> = {
  E: [{ rarity: "common", chance: 0.75 }, { rarity: "uncommon", chance: 0.22 }, { rarity: "rare", chance: 0.03 }],
  D: [{ rarity: "common", chance: 0.55 }, { rarity: "uncommon", chance: 0.32 }, { rarity: "rare", chance: 0.12 }, { rarity: "epic", chance: 0.01 }],
  C: [{ rarity: "uncommon", chance: 0.4 }, { rarity: "rare", chance: 0.38 }, { rarity: "epic", chance: 0.2 }, { rarity: "legendary", chance: 0.02 }],
  B: [{ rarity: "rare", chance: 0.4 }, { rarity: "epic", chance: 0.42 }, { rarity: "legendary", chance: 0.18 }],
  A: [{ rarity: "epic", chance: 0.45 }, { rarity: "legendary", chance: 0.5 }, { rarity: "mythic", chance: 0.05 }],
  S: [{ rarity: "legendary", chance: 0.6 }, { rarity: "mythic", chance: 0.35 }, { rarity: "unique", chance: 0.05 }],
  National: [{ rarity: "unique", chance: 0.6 }, { rarity: "divine", chance: 0.4 }],
};

const REFRESH_HOURS = 6;
const GATE_QUOTA = 5;

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function encounterPoolForRank(rank: GateRank) {
  return monsters.filter((m) => !m.isBoss && m.rank === rank);
}

function averageLevel(pool: ReturnType<typeof encounterPoolForRank>): number {
  if (pool.length === 0) return 1;
  return Math.round(pool.reduce((sum, m) => sum + m.level, 0) / pool.length);
}

function buildGate(regionId: string, rank: GateRank, now: Date, index: number): Gate | null {
  // The A-rank gate is the curated region-boss encounter — there's no
  // dedicated A-rank trash pool yet, so it draws its escort from the B-rank
  // pool (elite versions of familiar threats guarding the boss).
  const pool = rank === "A" ? encounterPoolForRank("B") : encounterPoolForRank(rank);
  if (pool.length === 0) return null;

  const isFeaturedBossGate = rank === "B" || rank === "A";
  const recommendedLevel = averageLevel(pool);
  const seed = now.getTime() + index * 97;

  // Only B (mini-boss) and A (region boss) have a curated boss today —
  // E/D/C draw a procedurally-generated one scaled to the gate's own rank
  // instead of reusing a mismatched curated boss (see monsterGenerator.ts,
  // built exactly for this "beyond the curated content" case).
  const boss =
    rank === "B"
      ? monsters.find((m) => m.id === "rootless-king")!
      : rank === "A"
        ? monsters.find((m) => m.id === "maw-of-the-hollow")!
        : generateMonster(rank, recommendedLevel, seed, true);

  const count = Math.min(pool.length, 3 + Math.floor(Math.random() * 3));
  const encounterMonsters = shuffle(pool).slice(0, count);

  return {
    id: `gate-${regionId}-${rank.toLowerCase()}-${now.getTime()}-${index}`,
    regionId,
    rank,
    recommendedLevel: rank === "A" ? boss.level : recommendedLevel,
    encounterMonsters,
    boss,
    isFeaturedBossGate,
    energyCost: ENERGY_COST[rank],
    estimatedMinutes: ESTIMATED_MINUTES[rank],
    lootPreview: LOOT_PREVIEW[rank],
    expiresAt: new Date(now.getTime() + REFRESH_HOURS * 60 * 60 * 1000).toISOString(),
  };
}

/** Generates a fresh batch of active Gates for a region — regular ranks plus the two featured boss gates. */
export function generateGatesForRegion(regionId: string, now: Date = new Date()): Gate[] {
  const ranks: GateRank[] = [...shuffle(REGULAR_RANKS).slice(0, GATE_QUOTA - 2), "B", "A"];
  return ranks
    .map((rank, i) => buildGate(regionId, rank, now, i))
    .filter((gate): gate is Gate => gate !== null);
}

export function isGateExpired(gate: Gate, now: Date = new Date()): boolean {
  return now.getTime() > new Date(gate.expiresAt).getTime();
}

export const GATE_REFRESH_HOURS = REFRESH_HOURS;
