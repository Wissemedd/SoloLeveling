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
// Vanguard — Voie de la Force (strength-led)
// ---------------------------------------------------------------------------

const vanguardTrunk = trunk(
  "vanguard",
  "shield",
  { name: "Recrue", tagline: "Le premier pas d'un long entraînement." },
  { name: "Guerrier", tagline: "Le corps se forge dans l'effort répété." },
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
    { rank: "C", name: "Berserker", tagline: "La rage devient une arme.", minLevel: 20, metricThreshold: 100 },
    { rank: "B", name: "Roi Berserker", tagline: "Aucune charge ne le fait plier.", minLevel: 35, metricThreshold: 1000 },
    { rank: "A", name: "Titan", tagline: "Sa force seule fissure la pierre.", minLevel: 50, metricThreshold: 10000 },
    { rank: "S", name: "Infinity Warrior", tagline: "Une puissance qui ne connaît plus de limite.", minLevel: 70, metricThreshold: 50000 },
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
    { rank: "C", name: "Chevalier", tagline: "Une garde qui ne cède jamais.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Dragon Knight", tagline: "L'armure a pris l'écaille du dragon.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Dragon Slayer", tagline: "Il a terrassé ce que d'autres fuient.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Dragon Monarch", tagline: "Le dragon ne le combat plus — il le sert.", minLevel: 70, metricThreshold: 500 },
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
    { rank: "C", name: "Paladin", tagline: "La discipline avant l'aube.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Templier", tagline: "Un serment tenu chaque matin.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Saint", tagline: "Sa volonté éclaire ceux qui doutent.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Light Bringer", tagline: "Là où il passe, la nuit recule.", minLevel: 70, metricThreshold: 100 },
  ],
);

// ---------------------------------------------------------------------------
// Phantom — Voie de l'Agilité (agility-led)
// ---------------------------------------------------------------------------

const phantomTrunk = trunk(
  "phantom",
  "flash",
  { name: "Éclaireur", tagline: "Toujours un pas devant." },
  { name: "Voleur", tagline: "Rapide, léger, insaisissable." },
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
    { rank: "C", name: "Assassin", tagline: "Il frappe avant d'être vu.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Maître Assassin", tagline: "L'ombre elle-même le suit avec retard.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Épéiste fantôme", tagline: "Une lame qu'on ne voit jamais venir.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Void Walker", tagline: "Il marche entre les instants.", minLevel: 70, metricThreshold: 100 },
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
    { rank: "C", name: "Chasseur", tagline: "Aucune piste ne lui échappe.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Ranger", tagline: "Le territoire entier est son terrain.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Maître des Bêtes", tagline: "Même les fauves reconnaissent sa foulée.", minLevel: 50, metricThreshold: 200 },
    { rank: "S", name: "Beast Monarch", tagline: "Il ne traque plus — il règne.", minLevel: 70, metricThreshold: 500 },
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
    { rank: "C", name: "Ninja", tagline: "Chaque pas est calculé.", minLevel: 20, metricThreshold: 10000 },
    { rank: "B", name: "Lame Astrale", tagline: "Le mouvement devient tranchant.", minLevel: 35, metricThreshold: 50000 },
    { rank: "A", name: "Maître des Ombres", tagline: "Il se déplace plus vite que le regard.", minLevel: 50, metricThreshold: 200000 },
    { rank: "S", name: "Storm Monarch", tagline: "Une tempête qui ne laisse pas de trace.", minLevel: 70, metricThreshold: 500000 },
  ],
);

// ---------------------------------------------------------------------------
// Mage — Voie de la Magie (focus-led)
// ---------------------------------------------------------------------------

const mageTrunk = trunk(
  "mage",
  "eye",
  { name: "Apprenti", tagline: "Le savoir commence par l'humilité." },
  { name: "Élémentaliste", tagline: "Les éléments répondent enfin à l'appel." },
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
    { rank: "C", name: "Archimage", tagline: "L'esprit devient une arme précise.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Sage Arcane", tagline: "Chaque séance affine la compréhension.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Primordial Mage", tagline: "Il touche aux lois premières.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Reality Bender", tagline: "Ce qu'il imagine, il le façonne.", minLevel: 70, metricThreshold: 500 },
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
    { rank: "C", name: "Nécromancien", tagline: "Il transforme l'épuisement en pouvoir.", minLevel: 20, metricThreshold: 5000 },
    { rank: "B", name: "Grand Nécromancien", tagline: "Rien ne se perd, tout se convertit.", minLevel: 35, metricThreshold: 50000 },
    { rank: "A", name: "Roi des Esprits", tagline: "Une armée d'efforts passés le suit.", minLevel: 50, metricThreshold: 150000 },
    { rank: "S", name: "Abyss Monarch", tagline: "Il a dévoré ses propres limites.", minLevel: 70, metricThreshold: 500000 },
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
    { rank: "C", name: "Chronomancien", tagline: "Chaque jour compte, aucun n'est perdu.", minLevel: 20, metricThreshold: 7 },
    { rank: "B", name: "Astromancien", tagline: "Sa régularité suit celle des astres.", minLevel: 35, metricThreshold: 30 },
    { rank: "A", name: "Maître du Temps", tagline: "Le temps ne lui échappe plus jamais.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "Time Weaver", tagline: "Il tisse les jours en une seule volonté.", minLevel: 70, metricThreshold: 100 },
  ],
);

// ---------------------------------------------------------------------------
// Priest — Voie du Soutien (vitality/discipline-led)
// ---------------------------------------------------------------------------

const priestTrunk = trunk(
  "priest",
  "fitness",
  { name: "Disciple", tagline: "Servir les autres commence par se forger soi-même." },
  { name: "Clerc", tagline: "Un corps sain porte une volonté plus grande." },
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
    { rank: "C", name: "Guérisseur", tagline: "Chaque effort répare autant qu'il construit.", minLevel: 20, metricThreshold: 10 },
    { rank: "B", name: "Grand Druide", tagline: "Sa vitalité déborde sur son entourage.", minLevel: 35, metricThreshold: 50 },
    { rank: "A", name: "Émissaire Divin", tagline: "Un souffle de vie inépuisable.", minLevel: 50, metricThreshold: 100 },
    { rank: "S", name: "Celestial Monarch", tagline: "Sa présence seule relève les autres.", minLevel: 70, metricThreshold: 500 },
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
    { rank: "C", name: "Moine", tagline: "Le calme avant l'effort, l'effort avant l'aube.", minLevel: 20, metricThreshold: 5 },
    { rank: "B", name: "Maître du Ki", tagline: "Le souffle et le corps ne font plus qu'un.", minLevel: 35, metricThreshold: 25 },
    { rank: "A", name: "Archonte", tagline: "Sa discipline devient un exemple.", minLevel: 50, metricThreshold: 60 },
    { rank: "S", name: "World Guardian", tagline: "Un pilier que rien ne fait vaciller.", minLevel: 70, metricThreshold: 100 },
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
    { rank: "C", name: "Exorciste", tagline: "Il chasse le doute à chaque répétition.", minLevel: 20, metricThreshold: 100 },
    { rank: "B", name: "Bourreau Sacré", tagline: "Sa rigueur ne laisse rien passer.", minLevel: 35, metricThreshold: 1000 },
    { rank: "A", name: "Ange Gardien", tagline: "Il veille sur sa propre progression sans faillir.", minLevel: 50, metricThreshold: 10000 },
    { rank: "S", name: "Eternal Knight", tagline: "Une garde que le temps ne lasse jamais.", minLevel: 70, metricThreshold: 50000 },
  ],
);

// ---------------------------------------------------------------------------
// Monarch — Voie du Monarque des Ombres (secret, "Wissem" only)
// ---------------------------------------------------------------------------

const monarchLine: ClassNode[] = (() => {
  const steps: (BranchStep & { id: string })[] = [
    { id: "monarch.trunk.e", rank: "E", name: "Ombre Éveillée", tagline: "Une puissance qui ne demande qu'à s'éveiller.", minLevel: 1 },
    { id: "monarch.trunk.d", rank: "D", name: "Chasseur d'Ombres", tagline: "Il commande déjà ce que les autres craignent.", minLevel: 10 },
    { id: "monarch.trunk.c", rank: "C", name: "Souverain des Ombres", tagline: "Une armée silencieuse se lève derrière lui.", minLevel: 20 },
    { id: "monarch.trunk.b", rank: "B", name: "Monarque Naissant", tagline: "Le trône des ombres l'attend.", minLevel: 35 },
    { id: "monarch.trunk.a", rank: "A", name: "Régent des Ombres", tagline: "Il ne reste plus qu'un pas vers le sommet.", minLevel: 50 },
    { id: "monarch.trunk.s", rank: "S", name: "Shadow Monarch", tagline: "Arise. Le seul, l'unique Monarque des Ombres.", minLevel: 70 },
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
