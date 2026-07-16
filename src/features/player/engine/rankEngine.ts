import { clamp01 } from "@/lib/utils/math";
import type { HunterRank } from "../types";

/** Level thresholds for the hunter rank ladder — mirrors rankColors in the theme. */
const RANK_THRESHOLDS: { rank: HunterRank; minLevel: number }[] = [
  { rank: "National", minLevel: 100 },
  { rank: "S", minLevel: 70 },
  { rank: "A", minLevel: 50 },
  { rank: "B", minLevel: 35 },
  { rank: "C", minLevel: 20 },
  { rank: "D", minLevel: 10 },
  { rank: "E", minLevel: 1 },
];

export function rankForLevel(level: number): HunterRank {
  const match = RANK_THRESHOLDS.find((t) => level >= t.minLevel);
  return match?.rank ?? "E";
}

export function nextRank(rank: HunterRank): { rank: HunterRank; minLevel: number } | null {
  const idx = RANK_THRESHOLDS.findIndex((t) => t.rank === rank);
  return idx > 0 ? RANK_THRESHOLDS[idx - 1] : null;
}

export function rankProgress(level: number) {
  const current = rankForLevel(level);
  const upcoming = nextRank(current);
  if (!upcoming) return { current, upcoming: null, progress: 1 };

  const currentFloor = RANK_THRESHOLDS.find((t) => t.rank === current)!.minLevel;
  const span = upcoming.minLevel - currentFloor;
  const progress = span > 0 ? (level - currentFloor) / span : 1;
  return { current, upcoming, progress: clamp01(progress) };
}
