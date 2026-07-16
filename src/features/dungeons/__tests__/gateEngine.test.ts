import { generateGatesForRegion, isGateExpired } from "../engine/gateEngine";

describe("gateEngine.generateGatesForRegion", () => {
  it("generates a batch of Gates with valid encounters and a boss", () => {
    const gates = generateGatesForRegion("hollow-wilds", new Date("2026-01-01T00:00:00Z"));
    expect(gates.length).toBeGreaterThan(0);
    for (const gate of gates) {
      expect(gate.encounterMonsters.length).toBeGreaterThan(0);
      expect(gate.boss).toBeDefined();
      expect(gate.boss.isBoss).toBe(true);
      expect(gate.energyCost).toBeGreaterThan(0);
      // The A-rank region-boss gate deliberately draws its escort from the
      // B-rank pool (no dedicated A-rank trash tier yet) — see gateEngine.ts.
      const expectedEscortRank = gate.rank === "A" ? "B" : gate.rank;
      expect(gate.encounterMonsters.every((m) => m.rank === expectedEscortRank)).toBe(true);
    }
  });

  it("always includes the two featured boss gates (B and A rank)", () => {
    const gates = generateGatesForRegion("hollow-wilds", new Date());
    expect(gates.some((g) => g.rank === "B" && g.isFeaturedBossGate)).toBe(true);
    expect(gates.some((g) => g.rank === "A" && g.isFeaturedBossGate)).toBe(true);
  });

  it("isGateExpired is false right after generation and true well past the refresh window", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    const gates = generateGatesForRegion("hollow-wilds", now);
    expect(isGateExpired(gates[0], now)).toBe(false);
    expect(isGateExpired(gates[0], new Date(now.getTime() + 24 * 60 * 60 * 1000))).toBe(true);
  });
});
