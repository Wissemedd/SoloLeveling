import { rankForLevel, rankProgress } from "../engine/rankEngine";

describe("rankEngine", () => {
  it("maps levels to the correct rank tier", () => {
    expect(rankForLevel(1)).toBe("E");
    expect(rankForLevel(9)).toBe("E");
    expect(rankForLevel(10)).toBe("D");
    expect(rankForLevel(34)).toBe("C");
    expect(rankForLevel(70)).toBe("S");
    expect(rankForLevel(150)).toBe("National");
  });

  it("computes progress toward the next rank between 0 and 1", () => {
    const { current, upcoming, progress } = rankProgress(15);
    expect(current).toBe("D");
    expect(upcoming?.rank).toBe("C");
    expect(progress).toBeGreaterThan(0);
    expect(progress).toBeLessThan(1);
  });

  it("has no upcoming rank at the top of the ladder", () => {
    expect(rankProgress(500).upcoming).toBeNull();
  });
});
