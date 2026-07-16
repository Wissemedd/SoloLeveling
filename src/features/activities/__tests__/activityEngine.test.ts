import { acceptableUnits, activityStatGains, activityXp, resolveActivityLog } from "../engine/activityEngine";
import { getActivityType } from "../data/activityTypes";
import type { ActivityTypeDef } from "../types";

const reading = getActivityType("reading") as ActivityTypeDef;

describe("activityEngine", () => {
  it("acceptableUnits clamps to the remaining daily headroom", () => {
    expect(acceptableUnits(60, 0, 30)).toBe(30);
    expect(acceptableUnits(60, 50, 30)).toBe(10);
    expect(acceptableUnits(60, 60, 30)).toBe(0);
    expect(acceptableUnits(60, 0, -5)).toBe(0);
  });

  it("activityXp scales linearly with the per-unit rate", () => {
    expect(activityXp(reading, 0)).toBe(0);
    expect(activityXp(reading, 20)).toBe(Math.round(20 * reading.xpPerUnit));
  });

  it("activityStatGains only grants whole points, never fractional stats", () => {
    const gains = activityStatGains(reading, reading.unitsPerStatPoint.focus! - 1);
    expect(gains.focus).toBeUndefined();
    const gains2 = activityStatGains(reading, reading.unitsPerStatPoint.focus!);
    expect(gains2.focus).toBe(1);
  });

  it("resolveActivityLog never exceeds the daily cap even across repeated calls", () => {
    const first = resolveActivityLog(reading, reading.dailyUnitCap - 10, 0);
    expect(first.acceptedUnits).toBe(reading.dailyUnitCap - 10);
    expect(first.capReached).toBe(false);

    const second = resolveActivityLog(reading, 100, first.acceptedUnits);
    expect(second.acceptedUnits).toBe(10);
    expect(second.capReached).toBe(true);

    const third = resolveActivityLog(reading, 5, reading.dailyUnitCap);
    expect(third.acceptedUnits).toBe(0);
    expect(third.xpEarned).toBe(0);
  });
});
