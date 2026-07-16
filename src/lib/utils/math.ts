/** Clamps a value to the [0, 1] range — used for probabilities and animated progress. */
export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
