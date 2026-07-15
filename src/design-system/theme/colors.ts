/**
 * Single source of truth for the palette also declared in tailwind.config.js.
 * Anything that can't consume a Tailwind className (SVG props, Reanimated
 * interpolateColor, LinearGradient stops) reads from here instead.
 */
export const colors = {
  void: {
    DEFAULT: "#05060A",
    50: "#14161F",
    100: "#0F111A",
    200: "#0B0D15",
    300: "#05060A",
  },
  abyss: {
    50: "#3A4A8C",
    100: "#2A3670",
    200: "#1B2452",
    300: "#131A3D",
    400: "#0C1129",
    500: "#080B1C",
  },
  arcane: {
    50: "#EDE2FF",
    100: "#D6B8FF",
    200: "#B87BFF",
    300: "#9D4EFF",
    400: "#7B2FF7",
    500: "#5B1FC2",
    600: "#3E1489",
  },
  neon: {
    50: "#DFFCFF",
    100: "#A9F6FF",
    200: "#5CEBFF",
    300: "#22D9F5",
    400: "#0FB8D9",
    500: "#0A8FAD",
  },
  gold: {
    50: "#FFF6DF",
    100: "#FFE6A8",
    200: "#FFD874",
    300: "#F5B94D",
    400: "#E09B26",
    500: "#A8720F",
  },
  danger: {
    50: "#FFE1E5",
    300: "#FF5C6C",
    400: "#FF3B4E",
    500: "#C2202F",
  },
  white: "#F5F7FF",
  slate: "#8991B8",
} as const;

/** Rarity/tier colors reused across loot, equipment, and rank badges. */
export const rarity = {
  common: colors.slate,
  rare: colors.neon[300],
  epic: colors.arcane[300],
  legendary: colors.gold[300],
} as const;

export type RarityTier = keyof typeof rarity;

/** Hunter rank ladder — reused by rankEngine and RankBadge. */
export const rankColors = {
  E: colors.slate,
  D: colors.neon[400],
  C: colors.neon[300],
  B: colors.arcane[300],
  A: colors.arcane[200],
  S: colors.gold[300],
  National: colors.gold[100],
} as const;

export const glow = {
  neon: "rgba(34, 217, 245, 0.45)",
  arcane: "rgba(157, 78, 255, 0.45)",
  gold: "rgba(245, 185, 77, 0.5)",
  danger: "rgba(255, 59, 78, 0.45)",
} as const;
