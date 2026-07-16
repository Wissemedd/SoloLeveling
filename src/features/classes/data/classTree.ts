import type { Ionicons } from "@expo/vector-icons";
import type { AchievementMetric } from "@/features/achievements/types";
import type { HunterRank, RpgStatKey } from "@/features/player/types";
import type { ClassArchetypeId, ClassNode } from "../types";

type IconName = keyof typeof Ionicons.glyphMap;

type BranchStep = {
  rank: HunterRank;
  name: string;
  tagline: string;
  minLevel: number;
  metricThreshold?: number;
};

/**
 * Builds one evolution line (tier C -> B -> A -> S) fanning out from the
 * archetype's tier-D trunk node. Every step shares the branch's dominant
 * stats, icon, and achievement-style metric — only the name, tagline, and
 * escalating threshold change per tier.
 */
function buildBranch(
  archetype: ClassArchetypeId,
  branch: string,
  parentId: string,
  icon: IconName,
  dominantStats: RpgStatKey[],
  metric: AchievementMetric | undefined,
  steps: BranchStep[],
): ClassNode[] {
  const nodes: ClassNode[] = [];
  let parent = parentId;
  for (const step of steps) {
    const id = `${archetype}.${branch}.${step.rank.toLowerCase()}`;
    nodes.push({
      id,
      archetype,
      name: step.name,
      tagline: step.tagline,
      rank: step.rank,
      branch,
      parentId: parent,
      icon,
      requirement: {
        minLevel: step.minLevel,
        dominantStats,
        metric,
        metricThreshold: step.metricThreshold,
      },
    });
    parent = id;
  }
  return nodes;
}

function trunk(
  archetype: ClassArchetypeId,
  icon: IconName,
  tierE: { name: string; tagline: string },
  tierD: { name: string; tagline: string },
): ClassNode[] {
  const rootId = `${archetype}.trunk.e`;
  const trunkId = `${archetype}.trunk.d`;
  return [
    {
      id: rootId,
      archetype,
      name: tierE.name,
      tagline: tierE.tagline,
      rank: "E",
      branch: null,
      parentId: null,
      icon,
      requirement: null,
    },
    {
      id: trunkId,
      archetype,
      name: tierD.name,
      tagline: tierD.tagline,
      rank: "D",
      branch: null,
      parentId: rootId,
      icon,
      requirement: { minLevel: 10 },
    },
  ];
}

// ---------------------------------------------------------------------------
// Vanguard — Path of Strength (strength-led)
// ---------------------------------------------------------------------------

const vanguardTrunk = trunk(
  "vanguard",
  "shield",
  { name: "Recruit", tagline: "The first step of a long training." },
  { name: "Warrior", tagline: "The body is forged through repeated effort." },
);
const vanguardTrunkD = vanguardTrunk[1].id;

const vanguardBerserker = buildBranch(
  "vanguard",
  "berserker",
  vanguardTrunkD,
  "flame",
  ["strength"],
  "totalPushups",
  [
    { rank: "C", name: "Berserker", tagline: "Rage becomes a weapon.", minLevel: 20, metricThreshold: 100 },
    { rank: "B", name: "Berserker King", tagline: "No charge makes him yield.", minLevel: 35, metricThreshold: 1000 },
    { rank: "A", name: "Titan", tagline: "His strength alone cracks stone.", minLevel: 50, metricThreshold: 10000 },
    { rank: "S", name: "Infinity Warrior", tagline: "A power that knows no limit anymore.", minLevel: 70, metricThreshold: 50000 },
  ],
);

const vanguardChevalier = buildBranch(
  "vanguard",
  "chevalier",
  vanguardTrunkD,
  "flag",
  ["strength", "vitality"],
  "totalWorkouts",
  [
    { rank: "C", name: "Knight", tagline: "A guard that never yields.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Dragon Knight", tagline: "The armor has taken on the dragon's scale.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Dragon Slayer", tagline: "He has felled what others flee.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Dragon Monarch", tagline: "The dragon no longer fights him — it serves him.", minLevel: 70, metricThreshold: 500 },
  ],
);

const vanguardPaladin = buildBranch(
  "vanguard",
  "paladin",
  vanguardTrunkD,
  "sunny",
  ["discipline"],
  "morningWorkouts",
  [
    { rank: "C", name: "Paladin", tagline: "Discipline before dawn.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Templar", tagline: "A vow kept every morning.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Saint", tagline: "His will lights the way for those who doubt.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Light Bringer", tagline: "Wherever he walks, the night retreats.", minLevel: 70, metricThreshold: 100 },
  ],
);

// ---------------------------------------------------------------------------
// Phantom — Path of Agility (agility-led)
// ---------------------------------------------------------------------------

const phantomTrunk = trunk(
  "phantom",
  "flash",
  { name: "Scout", tagline: "Always one step ahead." },
  { name: "Thief", tagline: "Fast, light, untouchable." },
);
const phantomTrunkD = phantomTrunk[1].id;

const phantomAssassin = buildBranch(
  "phantom",
  "assassin",
  phantomTrunkD,
  "moon",
  ["agility"],
  "nightWorkouts",
  [
    { rank: "C", name: "Assassin", tagline: "He strikes before he's seen.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Master Assassin", tagline: "Even the shadow lags behind him.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Phantom Blade", tagline: "A blade you never see coming.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Void Walker", tagline: "He walks between moments.", minLevel: 70, metricThreshold: 100 },
  ],
);

const phantomChasseur = buildBranch(
  "phantom",
  "chasseur",
  phantomTrunkD,
  "compass",
  ["agility", "endurance"],
  "totalDistanceKm",
  [
    { rank: "C", name: "Hunter", tagline: "No trail escapes him.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Ranger", tagline: "The whole territory is his ground.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Beastmaster", tagline: "Even beasts recognize his stride.", minLevel: 50, metricThreshold: 200 },
    { rank: "S", name: "Beast Monarch", tagline: "He no longer hunts — he reigns.", minLevel: 70, metricThreshold: 500 },
  ],
);

const phantomNinja = buildBranch(
  "phantom",
  "ninja",
  phantomTrunkD,
  "body",
  ["agility", "focus"],
  "totalSteps",
  [
    { rank: "C", name: "Ninja", tagline: "Every step is calculated.", minLevel: 20, metricThreshold: 10000 },
    { rank: "B", name: "Astral Blade", tagline: "Movement itself becomes an edge.", minLevel: 35, metricThreshold: 50000 },
    { rank: "A", name: "Master of Shadows", tagline: "He moves faster than the eye can follow.", minLevel: 50, metricThreshold: 200000 },
    { rank: "S", name: "Storm Monarch", tagline: "A storm that leaves no trace.", minLevel: 70, metricThreshold: 500000 },
  ],
);

// ---------------------------------------------------------------------------
// Mage — Path of Magic (focus-led)
// ---------------------------------------------------------------------------

const mageTrunk = trunk(
  "mage",
  "eye",
  { name: "Apprentice", tagline: "Knowledge begins with humility." },
  { name: "Elementalist", tagline: "The elements finally answer the call." },
);
const mageTrunkD = mageTrunk[1].id;

const mageArchimage = buildBranch(
  "mage",
  "archimage",
  mageTrunkD,
  "sparkles",
  ["focus"],
  "totalWorkouts",
  [
    { rank: "C", name: "Archmage", tagline: "The mind becomes a precise weapon.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Arcane Sage", tagline: "Every session sharpens understanding.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Primordial Mage", tagline: "He touches the first laws of creation.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Reality Bender", tagline: "What he imagines, he shapes.", minLevel: 70, metricThreshold: 500 },
  ],
);

const mageNecromancien = buildBranch(
  "mage",
  "necromancien",
  mageTrunkD,
  "skull",
  ["focus", "discipline"],
  "totalCaloriesBurned",
  [
    { rank: "C", name: "Necromancer", tagline: "He turns exhaustion into power.", minLevel: 20, metricThreshold: 5000 },
    { rank: "B", name: "Grand Necromancer", tagline: "Nothing is lost, everything converts.", minLevel: 35, metricThreshold: 50000 },
    { rank: "A", name: "King of Spirits", tagline: "An army of past efforts follows him.", minLevel: 50, metricThreshold: 150000 },
    { rank: "S", name: "Abyss Monarch", tagline: "He has devoured his own limits.", minLevel: 70, metricThreshold: 500000 },
  ],
);

const mageChronomancien = buildBranch(
  "mage",
  "chronomancien",
  mageTrunkD,
  "hourglass",
  ["focus", "discipline"],
  "longestStreak",
  [
    { rank: "C", name: "Chronomancer", tagline: "Every day counts, none are lost.", minLevel: 20, metricThreshold: 7 },
    { rank: "B", name: "Astromancer", tagline: "His consistency follows that of the stars.", minLevel: 35, metricThreshold: 30 },
    { rank: "A", name: "Master of Time", tagline: "Time never escapes him anymore.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Time Weaver", tagline: "He weaves the days into a single will.", minLevel: 70, metricThreshold: 100 },
  ],
);

// ---------------------------------------------------------------------------
// Priest — Path of Support (vitality/discipline-led)
// ---------------------------------------------------------------------------

const priestTrunk = trunk(
  "priest",
  "fitness",
  { name: "Disciple", tagline: "Serving others begins with forging yourself." },
  { name: "Cleric", tagline: "A healthy body carries a greater will." },
);
const priestTrunkD = priestTrunk[1].id;

const priestGuerisseur = buildBranch(
  "priest",
  "guerisseur",
  priestTrunkD,
  "heart",
  ["vitality"],
  "totalWorkouts",
  [
    { rank: "C", name: "Healer", tagline: "Every effort repairs as much as it builds.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Grand Druid", tagline: "His vitality overflows onto those around him.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Divine Emissary", tagline: "An inexhaustible breath of life.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Celestial Monarch", tagline: "His presence alone lifts others up.", minLevel: 70, metricThreshold: 500 },
  ],
);

const priestMoine = buildBranch(
  "priest",
  "moine",
  priestTrunkD,
  "leaf",
  ["focus", "vitality"],
  "morningWorkouts",
  [
    { rank: "C", name: "Monk", tagline: "Calm before effort, effort before dawn.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Master of Ki", tagline: "Breath and body become one.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Archon", tagline: "His discipline becomes an example.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "World Guardian", tagline: "A pillar that nothing can shake.", minLevel: 70, metricThreshold: 100 },
  ],
);

const priestExorciste = buildBranch(
  "priest",
  "exorciste",
  priestTrunkD,
  "flame",
  ["discipline", "vitality"],
  "totalPushups",
  [
    { rank: "C", name: "Exorcist", tagline: "He casts out doubt with every repetition.", minLevel: 20, metricThreshold: 100 },
    { rank: "B", name: "Sacred Executioner", tagline: "His rigor lets nothing slip by.", minLevel: 35, metricThreshold: 1000 },
    { rank: "A", name: "Guardian Angel", tagline: "He watches over his own progress without fail.", minLevel: 50, metricThreshold: 10000 },
    { rank: "S", name: "Eternal Knight", tagline: "A vigil that time never wearies.", minLevel: 70, metricThreshold: 50000 },
  ],
);

// ---------------------------------------------------------------------------
// Monarch — Path of the Shadow Monarch (secret, "Wissem" only)
// ---------------------------------------------------------------------------

const monarchLine: ClassNode[] = (() => {
  const steps: (BranchStep & { id: string })[] = [
    { id: "monarch.trunk.e", rank: "E", name: "Awakened Shadow", tagline: "A power that only waits to awaken.", minLevel: 1 },
    { id: "monarch.trunk.d", rank: "D", name: "Shadow Hunter", tagline: "He already commands what others fear.", minLevel: 10 },
    { id: "monarch.trunk.c", rank: "C", name: "Sovereign of Shadows", tagline: "A silent army rises behind him.", minLevel: 20 },
    { id: "monarch.trunk.b", rank: "B", name: "Rising Monarch", tagline: "The throne of shadows awaits him.", minLevel: 35 },
    { id: "monarch.trunk.a", rank: "A", name: "Regent of Shadows", tagline: "Only one step remains to the summit.", minLevel: 50 },
    { id: "monarch.trunk.s", rank: "S", name: "Shadow Monarch", tagline: "Arise. The one, the only Shadow Monarch.", minLevel: 70 },
  ];

  return steps.map((step, i) => ({
    id: step.id,
    archetype: "monarch" as ClassArchetypeId,
    name: step.name,
    tagline: step.tagline,
    rank: step.rank,
    branch: null,
    parentId: i === 0 ? null : steps[i - 1].id,
    icon: "skull" as IconName,
    requirement: i === 0 ? null : { minLevel: step.minLevel },
  }));
})();

export const classTree: ClassNode[] = [
  ...vanguardTrunk,
  ...vanguardBerserker,
  ...vanguardChevalier,
  ...vanguardPaladin,
  ...phantomTrunk,
  ...phantomAssassin,
  ...phantomChasseur,
  ...phantomNinja,
  ...mageTrunk,
  ...mageArchimage,
  ...mageNecromancien,
  ...mageChronomancien,
  ...priestTrunk,
  ...priestGuerisseur,
  ...priestMoine,
  ...priestExorciste,
  ...monarchLine,
];
