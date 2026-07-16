import { classTree } from "../data/classTree";
import {
  getEligibleEvolutions,
  getChildren,
  getPath,
  getRootNode,
  isRequirementMet,
  isWissem,
} from "../engine/classEngine";
import { createBaseStats } from "@/features/player/engine/statsEngine";
import type { LifetimeStats } from "@/features/achievements/types";
import type { ClassArchetypeId } from "../types";

const ARCHETYPES: ClassArchetypeId[] = ["vanguard", "phantom", "priest", "mage", "monarch"];

const emptyLifetimeStats: LifetimeStats = {
  totalWorkouts: 0,
  totalPushups: 0,
  totalDistanceKm: 0,
  longestStreak: 0,
  totalCaloriesBurned: 0,
  level: 1,
  morningWorkouts: 0,
  nightWorkouts: 0,
  totalSteps: 0,
  totalDungeonsCleared: 0,
  totalMonstersDefeated: 0,
  totalBossesDefeated: 0,
  totalItemsCrafted: 0,
};

describe("classTree data integrity", () => {
  it("has unique node ids", () => {
    const ids = classTree.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has exactly one root per archetype, and every other node resolves its parent", () => {
    for (const archetype of ARCHETYPES) {
      const nodesInTree = classTree.filter((n) => n.archetype === archetype);
      const roots = nodesInTree.filter((n) => n.parentId === null);
      expect(roots).toHaveLength(1);
      expect(roots[0].requirement).toBeNull();

      for (const node of nodesInTree) {
        if (node.parentId === null) continue;
        const parent = classTree.find((n) => n.id === node.parentId);
        expect(parent).toBeDefined();
        expect(parent?.archetype).toBe(archetype);
      }
    }
  });

  it("reserves Shadow Monarch exclusively for the monarch archetype", () => {
    const shadowMonarchNodes = classTree.filter((n) => n.name === "Shadow Monarch");
    expect(shadowMonarchNodes).toHaveLength(1);
    expect(shadowMonarchNodes[0].archetype).toBe("monarch");
  });

  it("gives every non-monarch archetype exactly 3 branches of 4 tiers each", () => {
    for (const archetype of ARCHETYPES.filter((a) => a !== "monarch")) {
      const branches = new Set(classTree.filter((n) => n.archetype === archetype && n.branch).map((n) => n.branch));
      expect(branches.size).toBe(3);
      for (const branch of branches) {
        const branchNodes = classTree.filter((n) => n.archetype === archetype && n.branch === branch);
        expect(branchNodes).toHaveLength(4);
        expect(branchNodes.map((n) => n.rank).sort()).toEqual(["A", "B", "C", "S"]);
      }
    }
  });
});

describe("getPath / getChildren", () => {
  it("walks root-to-current for a deep node", () => {
    const leaf = classTree.find((n) => n.id === "vanguard.chevalier.s")!;
    const path = getPath(leaf.id);
    expect(path.map((n) => n.name)).toEqual(["Recrue", "Guerrier", "Chevalier", "Dragon Knight", "Dragon Slayer", "Dragon Monarch"]);
  });

  it("returns no children for a max-tier leaf", () => {
    const leaf = getRootNode("mage");
    expect(getChildren("mage.chronomancien.s")).toHaveLength(0);
    expect(leaf.parentId).toBeNull();
  });
});

describe("isRequirementMet / getEligibleEvolutions", () => {
  it("auto-passes the root node (null requirement)", () => {
    expect(isRequirementMet(null, { level: 1, stats: createBaseStats(), lifetimeStats: emptyLifetimeStats })).toBe(true);
  });

  it("gates the tier-D trunk purely on level", () => {
    const trunkD = classTree.find((n) => n.id === "vanguard.trunk.d")!;
    const ctxLow = { level: 5, stats: createBaseStats(), lifetimeStats: emptyLifetimeStats };
    const ctxHigh = { level: 10, stats: createBaseStats(), lifetimeStats: emptyLifetimeStats };
    expect(isRequirementMet(trunkD.requirement, ctxLow)).toBe(false);
    expect(isRequirementMet(trunkD.requirement, ctxHigh)).toBe(true);
  });

  it("offers all 3 branch heads at the fork until one is chosen, then locks to it", () => {
    const ctx = {
      level: 70,
      stats: { ...createBaseStats(), strength: 999, discipline: 999 },
      lifetimeStats: { ...emptyLifetimeStats, totalPushups: 999999, totalWorkouts: 999999, morningWorkouts: 999999 },
    };

    const forkOptions = getEligibleEvolutions("vanguard.trunk.d", null, ctx);
    expect(forkOptions.map((n) => n.branch).sort()).toEqual(["berserker", "chevalier", "paladin"]);

    const lockedOptions = getEligibleEvolutions("vanguard.berserker.c", "berserker", ctx);
    expect(lockedOptions.map((n) => n.id)).toEqual(["vanguard.berserker.b"]);
  });

  it("requires the dominant stat and metric threshold, not just level", () => {
    const berserkerC = classTree.find((n) => n.id === "vanguard.berserker.c")!;
    const highLevelWrongStat = {
      level: 70,
      stats: { ...createBaseStats(), focus: 999 },
      lifetimeStats: emptyLifetimeStats,
    };
    expect(isRequirementMet(berserkerC.requirement, highLevelWrongStat)).toBe(false);

    const rightStatNoMetric = {
      level: 70,
      stats: { ...createBaseStats(), strength: 999 },
      lifetimeStats: emptyLifetimeStats,
    };
    expect(isRequirementMet(berserkerC.requirement, rightStatNoMetric)).toBe(false);

    const everythingMet = {
      level: 70,
      stats: { ...createBaseStats(), strength: 999 },
      lifetimeStats: { ...emptyLifetimeStats, totalPushups: 100 },
    };
    expect(isRequirementMet(berserkerC.requirement, everythingMet)).toBe(true);
  });
});

describe("isWissem", () => {
  it("matches case- and whitespace-insensitively", () => {
    expect(isWissem("Wissem")).toBe(true);
    expect(isWissem("  wissem  ")).toBe(true);
    expect(isWissem("WISSEM")).toBe(true);
    expect(isWissem("Wissam")).toBe(false);
    expect(isWissem("")).toBe(false);
  });
});
