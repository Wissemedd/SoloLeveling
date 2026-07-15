import type { Boss } from "../types";

/** Original creatures, rotated weekly — no resemblance to any licensed property intended. */
export const bosses: Boss[] = [
  { id: "hollow-sentinel", name: "Hollow Sentinel", title: "Guardian of the First Gate", description: "A husk of armor animated by pure inertia. It only falls to sustained effort.", maxHealth: 1200, accent: "arcane" },
  { id: "ashbound-colossus", name: "Ashbound Colossus", title: "The Weight of Excuses", description: "Grown heavier with every skipped day. Every rep chips it down.", maxHealth: 1500, accent: "danger" },
  { id: "gate-warden", name: "Gate Warden", title: "Keeper of the Threshold", description: "Blocks hunters who train without discipline. Consistency is its only weakness.", maxHealth: 1350, accent: "gold" },
  { id: "veil-wraith", name: "Veil Wraith", title: "Echo of Comfort", description: "Feeds on rest days taken too easily. Fades only under real intensity.", maxHealth: 1100, accent: "arcane" },
  { id: "iron-tyrant", name: "Iron Tyrant", title: "Sovereign of Stagnation", description: "The final test before a new rank. Rewards the relentless.", maxHealth: 1800, accent: "danger" },
];

export function bossForWeek(weekIndex: number): Boss {
  return bosses[weekIndex % bosses.length];
}
