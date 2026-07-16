import { stepsToCalories, stepsToDistanceKm, stepsToStatGains, stepsToXp } from "../engine/stepsEngine";

describe("stepsEngine", () => {
  it("returns zero for zero or negative steps", () => {
    expect(stepsToDistanceKm(0)).toBe(0);
    expect(stepsToCalories(-10)).toBe(0);
    expect(stepsToXp(0)).toBe(0);
    expect(stepsToStatGains(0)).toEqual({});
  });

  it("converts steps to distance using a fixed stride length", () => {
    expect(stepsToDistanceKm(10000)).toBeCloseTo(8, 5);
  });

  it("is monotonically increasing — more steps never means less distance, calories, or xp", () => {
    let lastDistance = 0;
    let lastCalories = 0;
    let lastXp = 0;
    for (let steps = 0; steps <= 50000; steps += 1237) {
      const distance = stepsToDistanceKm(steps);
      const calories = stepsToCalories(steps);
      const xp = stepsToXp(steps);
      expect(distance).toBeGreaterThanOrEqual(lastDistance);
      expect(calories).toBeGreaterThanOrEqual(lastCalories);
      expect(xp).toBeGreaterThanOrEqual(lastXp);
      lastDistance = distance;
      lastCalories = calories;
      lastXp = xp;
    }
  });

  it("only grants endurance from passive steps, never other stats", () => {
    const gains = stepsToStatGains(12000);
    expect(Object.keys(gains)).toEqual(["endurance"]);
    expect(gains.endurance).toBeGreaterThan(0);
  });

  it("grants no stat gains below the per-point step threshold", () => {
    expect(stepsToStatGains(100)).toEqual({});
  });
});
