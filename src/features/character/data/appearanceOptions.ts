import type { BeardStyle, CharacterAppearance, Gender, HairStyle, OutfitId, SkinTone } from "../types";

export const GENDER_OPTIONS: { id: Gender; label: string }[] = [
  { id: "male", label: "Male" },
  { id: "female", label: "Female" },
  { id: "androgynous", label: "Androgynous" },
];

export const HAIR_STYLE_OPTIONS: { id: HairStyle; label: string }[] = [
  { id: "short", label: "Short" },
  { id: "long", label: "Long" },
  { id: "shaved", label: "Shaved" },
  { id: "ponytail", label: "Ponytail" },
  { id: "spiky", label: "Spiky" },
];

export const BEARD_OPTIONS: { id: BeardStyle; label: string }[] = [
  { id: "none", label: "None" },
  { id: "stubble", label: "Stubble" },
  { id: "full", label: "Full" },
];

export const SKIN_TONE_OPTIONS: { id: SkinTone; hex: string }[] = [
  { id: "pale", hex: "#F2D6C0" },
  { id: "light", hex: "#E3B792" },
  { id: "tan", hex: "#C68A5E" },
  { id: "deep", hex: "#8C5A3A" },
  { id: "dark", hex: "#5A3925" },
];

export const HAIR_COLOR_SWATCHES: string[] = ["#1B1B22", "#3A2A1E", "#8A5A2E", "#D9B34A", "#B8452E", "#9D4EFF", "#22D9F5"];

export const EYE_COLOR_SWATCHES: string[] = ["#3A2A1E", "#2E5C3A", "#2E6FB8", "#9D4EFF", "#22D9F5", "#B8452E"];

export const OUTFIT_OPTIONS: { id: OutfitId; label: string; accentHex: string }[] = [
  { id: "recruit_garb", label: "Recruit Garb", accentHex: "#8991B8" },
  { id: "scoutwrap", label: "Scoutwrap", accentHex: "#22D9F5" },
  { id: "sentinel_plate", label: "Sentinel Plate", accentHex: "#9D4EFF" },
  { id: "arcane_robes", label: "Arcane Robes", accentHex: "#F5B94D" },
];

export function defaultAppearance(): CharacterAppearance {
  return {
    gender: "androgynous",
    hairStyle: "short",
    hairColor: HAIR_COLOR_SWATCHES[0],
    eyeColor: EYE_COLOR_SWATCHES[0],
    skinTone: "light",
    beard: "none",
    outfitId: "recruit_garb",
  };
}
