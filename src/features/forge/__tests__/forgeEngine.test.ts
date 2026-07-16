import { attemptForge, forgeSuccessChance, FORGE_MAX_LEVEL } from "../engine/forgeEngine";

describe("forgeEngine", () => {
  it("guarantees success for levels below +5", () => {
    for (let level = 0; level < 5; level++) {
      expect(forgeSuccessChance(level)).toBe(1);
    }
  });

  it("success chance falls as the level climbs past +5, never below 20%", () => {
    expect(forgeSuccessChance(9)).toBeCloseTo(0.25);
    expect(forgeSuccessChance(20)).toBe(0.2);
  });

  it("attemptForge always succeeds under +5 and increments the level", () => {
    const result = attemptForge(2, () => 0.99);
    expect(result.success).toBe(true);
    expect(result.newLevel).toBe(3);
  });

  it("attemptForge can fail at higher levels and keeps the level unchanged on failure", () => {
    const result = attemptForge(9, () => 0.99); // 0.99 >= 25% chance -> failure
    expect(result.success).toBe(false);
    expect(result.newLevel).toBe(9);
  });

  it("refuses to upgrade past the max level", () => {
    const result = attemptForge(FORGE_MAX_LEVEL, () => 0);
    expect(result.success).toBe(false);
    expect(result.newLevel).toBe(FORGE_MAX_LEVEL);
  });
});
