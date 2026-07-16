import type { Region } from "../types";

/**
 * The 8 regions from the design brief, declared up front so the World Map
 * is complete — only the first is playable in V1 ("réduit mais extensible").
 * Unlocking the rest later is a data change (unlocked: true), not new code.
 */
export const regions: Region[] = [
  {
    id: "hollow-wilds",
    name: "The Hollow Wilds",
    theme: "forest",
    description: "A sprawling, half-tamed forest where the oldest Gates in the region first opened.",
    unlocked: true,
    recommendedLevelRange: [1, 45],
  },
  { id: "ashfall-peaks", name: "Ashfall Peaks", theme: "mountains", description: "Jagged mountains scarred by Gates that never fully closed.", unlocked: false, recommendedLevelRange: [40, 80] },
  { id: "the-bleached-expanse", name: "The Bleached Expanse", theme: "desert", description: "A desert of glassed sand, said to be the site of a Monarch's first fall.", unlocked: false, recommendedLevelRange: [70, 110] },
  { id: "sunken-ruins", name: "Sunken Ruins", theme: "ruins", description: "A city older than the Gates, half-swallowed by whatever came after it.", unlocked: false, recommendedLevelRange: [90, 130] },
  { id: "gatewatch-spire", name: "Gatewatch Spire", theme: "city", description: "The Hunter Association's fortified capital — and its busiest Gate cluster.", unlocked: false, recommendedLevelRange: [100, 140] },
  { id: "the-drowned-mire", name: "The Drowned Mire", theme: "marsh", description: "A marsh that swallows sound before it swallows hunters.", unlocked: false, recommendedLevelRange: [110, 150] },
  { id: "frostbound-reach", name: "Frostbound Reach", theme: "frozen_lands", description: "Frozen wastes where a Gate's cold never fully dissipates.", unlocked: false, recommendedLevelRange: [130, 170] },
  { id: "cinderfall-caldera", name: "Cinderfall Caldera", theme: "volcano", description: "A volcanic crater hiding the deepest Gates ever recorded.", unlocked: false, recommendedLevelRange: [150, 200] },
];

export function getRegion(id: string): Region | undefined {
  return regions.find((r) => r.id === id);
}
