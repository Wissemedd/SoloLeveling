import { applyDailyDecay, getStreakStatus, recordDailyCompletion } from "../engine/streakEngine";
import type { StreakState } from "../types";

const base: StreakState = { current: 0, longest: 0, lastCompletedDate: null, shields: 0 };

describe("streakEngine", () => {
  it("starts a fresh streak at 1 on first completion", () => {
    const next = recordDailyCompletion(base, "2026-07-15");
    expect(next.current).toBe(1);
    expect(next.longest).toBe(1);
    expect(next.lastCompletedDate).toBe("2026-07-15");
  });

  it("is idempotent for repeat completions on the same day", () => {
    const once = recordDailyCompletion(base, "2026-07-15");
    const twice = recordDailyCompletion(once, "2026-07-15");
    expect(twice.current).toBe(1);
  });

  it("increments on consecutive days", () => {
    let state = recordDailyCompletion(base, "2026-07-15");
    state = recordDailyCompletion(state, "2026-07-16");
    state = recordDailyCompletion(state, "2026-07-17");
    expect(state.current).toBe(3);
    expect(state.longest).toBe(3);
  });

  it("flags at-risk exactly one day after the last completion", () => {
    const state: StreakState = { ...base, current: 5, lastCompletedDate: "2026-07-15" };
    expect(getStreakStatus(state, "2026-07-16").isAtRisk).toBe(true);
    expect(getStreakStatus(state, "2026-07-16").isBroken).toBe(false);
    expect(getStreakStatus(state, "2026-07-17").isBroken).toBe(true);
  });

  it("spends a shield instead of decaying when one is banked", () => {
    const state: StreakState = { current: 10, longest: 10, lastCompletedDate: "2026-07-10", shields: 1 };
    const decayed = applyDailyDecay(state, "2026-07-13");
    expect(decayed.shields).toBe(0);
    expect(decayed.current).toBe(10);
  });

  it("halves (not zeroes) the streak on an unshielded miss", () => {
    const state: StreakState = { current: 10, longest: 10, lastCompletedDate: "2026-07-10", shields: 0 };
    const decayed = applyDailyDecay(state, "2026-07-13");
    expect(decayed.current).toBe(5);
  });
});
