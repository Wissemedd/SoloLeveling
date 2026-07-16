import type { Ionicons } from "@expo/vector-icons";
import type { CombatBonuses } from "@/features/inventory/types";
import type { ClassArchetypeId } from "@/features/classes/types";

type IconName = keyof typeof Ionicons.glyphMap;

export type SkillSeed = {
  name: string;
  description: string;
  icon: IconName;
  cooldownRounds?: number;
  baseBonuses: Partial<CombatBonuses>;
};

export type BranchSkillSeed = {
  archetype: ClassArchetypeId;
  /** null matches the shared trunk (tier E/D, before the branch fork). */
  branch: string | null;
  active: SkillSeed;
  passive: SkillSeed;
};

/**
 * One seed per archetype trunk + per branch (12 branches + 4 trunks + the
 * single-line Monarch path = 17 total) — not per class-tree node. The
 * engine scales these by tier (see skillEngine.ts), so evolving within a
 * branch strengthens the same two skills instead of granting brand new
 * ones every tier. Reduced-content V1; more seeds is a data-only change.
 */
export const branchSkillSeeds: BranchSkillSeed[] = [
  // Vanguard — Voie de la Force
  {
    archetype: "vanguard",
    branch: null,
    active: { name: "Guard Break", description: "A heavy overhand blow that shatters an enemy's stance.", icon: "hammer", cooldownRounds: 3, baseBonuses: { attackPower: 10 } },
    passive: { name: "Iron Skin", description: "Years of taking hits have hardened the body itself.", icon: "shield", baseBonuses: { defense: 4 } },
  },
  {
    archetype: "vanguard",
    branch: "berserker",
    active: { name: "Reckless Slam", description: "Abandons all defense for a devastating strike.", icon: "flame", cooldownRounds: 3, baseBonuses: { attackPower: 18, critChance: 0.05 } },
    passive: { name: "Berserker's Fury", description: "Rage compounds with every exchange.", icon: "flame", baseBonuses: { attackPower: 6 } },
  },
  {
    archetype: "vanguard",
    branch: "chevalier",
    active: { name: "Shield Bash", description: "Slams a foe off-balance, opening a window to strike.", icon: "shield-half", cooldownRounds: 3, baseBonuses: { attackPower: 10, defense: 6 } },
    passive: { name: "Knight's Resolve", description: "Discipline turns armor into a second skin.", icon: "shield-checkmark", baseBonuses: { defense: 8 } },
  },
  {
    archetype: "vanguard",
    branch: "paladin",
    active: { name: "Radiant Strike", description: "A blessed blow that burns through defenses.", icon: "sunny", cooldownRounds: 4, baseBonuses: { attackPower: 12, elementalPower: 8 } },
    passive: { name: "Aura of Protection", description: "A faint light that turns aside the killing blow.", icon: "shield", baseBonuses: { defense: 6, dodgeChance: 0.02 } },
  },

  // Phantom — Voie de l'Agilité
  {
    archetype: "phantom",
    branch: null,
    active: { name: "Quickstrike", description: "A blur of motion faster than the eye can track.", icon: "flash", cooldownRounds: 2, baseBonuses: { attackPower: 8, critChance: 0.04 } },
    passive: { name: "Light Step", description: "Footwork honed to never be caught flat-footed.", icon: "footsteps", baseBonuses: { dodgeChance: 0.03 } },
  },
  {
    archetype: "phantom",
    branch: "assassin",
    active: { name: "Shadow Step Strike", description: "Closes the distance in an instant, blade first.", icon: "eye-off", cooldownRounds: 3, baseBonuses: { attackPower: 16, critChance: 0.08 } },
    passive: { name: "Killer Instinct", description: "Always finds the gap in an enemy's guard.", icon: "eye", baseBonuses: { critChance: 0.05 } },
  },
  {
    archetype: "phantom",
    branch: "chasseur",
    active: { name: "Piercing Shot", description: "A single arrow aimed at the weakest point.", icon: "locate", cooldownRounds: 3, baseBonuses: { attackPower: 12, elementalPower: 6 } },
    passive: { name: "Predator's Eye", description: "Reads an opponent's next move before they make it.", icon: "eye", baseBonuses: { critChance: 0.03, dodgeChance: 0.02 } },
  },
  {
    archetype: "phantom",
    branch: "ninja",
    active: { name: "Vanishing Slash", description: "Strikes and is gone before the counter lands.", icon: "contract", cooldownRounds: 3, baseBonuses: { attackPower: 10, dodgeChance: 0.05 } },
    passive: { name: "Silent Movement", description: "Never quite where the enemy expects.", icon: "footsteps", baseBonuses: { dodgeChance: 0.06 } },
  },

  // Mage — Voie de la Magie
  {
    archetype: "mage",
    branch: null,
    active: { name: "Spark Bolt", description: "A crackling bolt of raw mana.", icon: "sparkles", cooldownRounds: 2, baseBonuses: { elementalPower: 10 } },
    passive: { name: "Mana Focus", description: "A steadier well of power to draw from.", icon: "water", baseBonuses: { elementalPower: 4 } },
  },
  {
    archetype: "mage",
    branch: "archimage",
    active: { name: "Arcane Burst", description: "Unleashes a concentrated pulse of raw magic.", icon: "sparkles", cooldownRounds: 4, baseBonuses: { elementalPower: 20 } },
    passive: { name: "Deep Reservoir", description: "A well of mana that never quite runs dry.", icon: "water", baseBonuses: { elementalPower: 8 } },
  },
  {
    archetype: "mage",
    branch: "necromancien",
    active: { name: "Withering Curse", description: "Saps an enemy's strength before the blow even lands.", icon: "skull", cooldownRounds: 3, baseBonuses: { elementalPower: 12, attackPower: 6 } },
    passive: { name: "Soul Siphon", description: "Draws a sliver of resilience from every kill.", icon: "skull", baseBonuses: { elementalPower: 6, defense: 3 } },
  },
  {
    archetype: "mage",
    branch: "chronomancien",
    active: { name: "Time Fracture", description: "Bends a fraction of a second in the caster's favor.", icon: "time", cooldownRounds: 4, baseBonuses: { dodgeChance: 0.06, critChance: 0.04 } },
    passive: { name: "Foresight", description: "Sees the blow coming a moment before it does.", icon: "time", baseBonuses: { dodgeChance: 0.03, critChance: 0.02 } },
  },

  // Priest — Voie du Soutien
  {
    archetype: "priest",
    branch: null,
    active: { name: "Rallying Cry", description: "A shout that steels the body for what's next.", icon: "megaphone", cooldownRounds: 3, baseBonuses: { attackPower: 6, defense: 4 } },
    passive: { name: "Steady Heart", description: "A calm mind that never panics under pressure.", icon: "heart", baseBonuses: { defense: 3, dodgeChance: 0.01 } },
  },
  {
    archetype: "priest",
    branch: "guerisseur",
    active: { name: "Sanctified Strike", description: "A blow wrapped in restorative light.", icon: "medkit", cooldownRounds: 3, baseBonuses: { attackPower: 8, defense: 8 } },
    passive: { name: "Blessed Vitality", description: "A body that shrugs off what should have broken it.", icon: "heart", baseBonuses: { defense: 10 } },
  },
  {
    archetype: "priest",
    branch: "moine",
    active: { name: "Palm Strike Combo", description: "A flurry of strikes, each faster than the last.", icon: "hand-left", cooldownRounds: 3, baseBonuses: { attackPower: 14, critChance: 0.03 } },
    passive: { name: "Disciplined Body", description: "Total command over one's own physical limits.", icon: "body", baseBonuses: { defense: 5, critChance: 0.02 } },
  },
  {
    archetype: "priest",
    branch: "exorciste",
    active: { name: "Banish", description: "A rite that burns hardest against unnatural foes.", icon: "flame", cooldownRounds: 4, baseBonuses: { elementalPower: 16 } },
    passive: { name: "Wardward Sigil", description: "A ward that never quite fades.", icon: "shield", baseBonuses: { defense: 5, elementalPower: 4 } },
  },

  // Monarch — secret, single line
  {
    archetype: "monarch",
    branch: null,
    active: { name: "Shadow Extraction", description: "Bends a defeated enemy's power to the Monarch's will.", icon: "skull", cooldownRounds: 3, baseBonuses: { attackPower: 22, critChance: 0.08 } },
    passive: { name: "Monarch's Domain", description: "Every shadow in reach answers to one authority.", icon: "skull", baseBonuses: { attackPower: 6, defense: 6, elementalPower: 6 } },
  },
];
