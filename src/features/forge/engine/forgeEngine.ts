export type ForgeCost = { gold: number; materialItemId: string; materialQuantity: number };

export const FORGE_MAX_LEVEL = 10;

export function forgeCostForLevel(currentLevel: number): ForgeCost {
  const gold = 20 + currentLevel * 30;
  if (currentLevel < 4) return { gold, materialItemId: "iron-fragment", materialQuantity: 2 + currentLevel };
  if (currentLevel < 8) return { gold, materialItemId: "arcane-dust", materialQuantity: 1 + Math.floor((currentLevel - 4) / 2) };
  return { gold, materialItemId: "monarchs-ember", materialQuantity: 1 };
}

/** Guaranteed through +5, then a falling curve — risk is the point past that. */
export function forgeSuccessChance(currentLevel: number): number {
  if (currentLevel < 5) return 1;
  return Math.max(0.2, 1 - (currentLevel - 4) * 0.15);
}

export function attemptForge(currentLevel: number, rng: () => number = Math.random): { success: boolean; newLevel: number } {
  if (currentLevel >= FORGE_MAX_LEVEL) return { success: false, newLevel: currentLevel };
  const success = rng() < forgeSuccessChance(currentLevel);
  return { success, newLevel: success ? currentLevel + 1 : currentLevel };
}
