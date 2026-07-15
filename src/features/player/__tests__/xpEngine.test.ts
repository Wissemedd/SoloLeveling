import { grantXp, levelForTotalXp, totalXpForLevel, xpProgress } from "../engine/xpEngine";

describe("xpEngine", () => {
  it("starts at level 1 with 0 xp", () => {
    expect(levelForTotalXp(0)).toBe(1);
    expect(totalXpForLevel(1)).toBe(0);
  });

  it("is monotonically increasing — more xp never means a lower level", () => {
    let lastLevel = 1;
    for (let xp = 0; xp <= 200_000; xp += 137) {
      const level = levelForTotalXp(xp);
      expect(level).toBeGreaterThanOrEqual(lastLevel);
      lastLevel = level;
    }
  });

  it("reports xpProgress consistent with totalXpForLevel", () => {
    const progress = xpProgress(totalXpForLevel(10));
    expect(progress.level).toBe(10);
    expect(progress.xpIntoLevel).toBe(0);
  });

  it("grantXp flags a level up only when the level actually changes", () => {
    const startXp = totalXpForLevel(5);
    const smallGain = grantXp(startXp, 1);
    expect(smallGain.leveledUp).toBe(false);
    expect(smallGain.newLevel).toBe(5);

    const bigGain = grantXp(startXp, totalXpForLevel(6) - startXp);
    expect(bigGain.leveledUp).toBe(true);
    expect(bigGain.newLevel).toBe(6);
    expect(bigGain.levelsGained).toBe(1);
  });

  it("never grants a negative total xp", () => {
    const result = grantXp(10, -1000);
    expect(result.totalXp).toBe(0);
  });
});
