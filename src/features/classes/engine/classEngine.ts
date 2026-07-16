import { RPG_STAT_KEYS } from "@/features/player/types";
import type { RpgStats, RpgStatKey } from "@/features/player/types";
import type { LifetimeStats } from "@/features/achievements/types";
import { classTree } from "../data/classTree";
import type { ClassArchetypeId, ClassNode, ClassRequirement } from "../types";

export type ClassEvalContext = {
  level: number;
  stats: RpgStats;
  lifetimeStats: LifetimeStats;
};

export function getNode(id: string): ClassNode | undefined {
  return classTree.find((n) => n.id === id);
}

export function getRootNode(archetype: ClassArchetypeId): ClassNode {
  const root = classTree.find((n) => n.archetype === archetype && n.parentId === null);
  if (!root) throw new Error(`No root class node for archetype "${archetype}"`);
  return root;
}

export function getChildren(nodeId: string): ClassNode[] {
  return classTree.filter((n) => n.parentId === nodeId);
}

/** Root-to-current chain of already-attained classes, for breadcrumb/history UI. */
export function getPath(nodeId: string): ClassNode[] {
  const path: ClassNode[] = [];
  let current = getNode(nodeId);
  while (current) {
    path.unshift(current);
    current = current.parentId ? getNode(current.parentId) : undefined;
  }
  return path;
}

export function topStatKeys(stats: RpgStats, count = 2): RpgStatKey[] {
  return [...RPG_STAT_KEYS].sort((a, b) => stats[b] - stats[a]).slice(0, count);
}

export function isRequirementMet(requirement: ClassRequirement | null, ctx: ClassEvalContext): boolean {
  if (!requirement) return true;
  if (ctx.level < requirement.minLevel) return false;

  if (requirement.dominantStats && requirement.dominantStats.length > 0) {
    const top = topStatKeys(ctx.stats);
    if (!requirement.dominantStats.some((key) => top.includes(key))) return false;
  }

  if (requirement.metric && requirement.metricThreshold !== undefined) {
    if (ctx.lifetimeStats[requirement.metric] < requirement.metricThreshold) return false;
  }

  return true;
}

/** 0..1 readout of how close `requirement` is to being satisfied — for progress bars. */
export function requirementProgress(requirement: ClassRequirement | null, ctx: ClassEvalContext): number {
  if (!requirement) return 1;

  const levelRatio = Math.min(1, ctx.level / requirement.minLevel);
  const metricRatio =
    requirement.metric && requirement.metricThreshold
      ? Math.min(1, ctx.lifetimeStats[requirement.metric] / requirement.metricThreshold)
      : 1;

  return Math.min(levelRatio, metricRatio);
}

/**
 * Children of the current node the hunter can manually evolve into right now.
 * Once a branch is locked in, only that branch's next step is ever offered —
 * the other two branches of the same fork disappear for good.
 */
export function getEligibleEvolutions(
  currentNodeId: string,
  chosenBranch: string | null,
  ctx: ClassEvalContext,
): ClassNode[] {
  return getChildren(currentNodeId)
    .filter((n) => !chosenBranch || !n.branch || n.branch === chosenBranch)
    .filter((n) => isRequirementMet(n.requirement, ctx));
}

/** All children of the current node (eligible or not yet), for previewing a branch fork. */
export function getNextCandidates(currentNodeId: string, chosenBranch: string | null): ClassNode[] {
  return getChildren(currentNodeId).filter((n) => !chosenBranch || !n.branch || n.branch === chosenBranch);
}

export function isWissem(name: string): boolean {
  return name.trim().toLowerCase() === "wissem";
}
