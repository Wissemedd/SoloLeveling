export type Gender = "male" | "female" | "androgynous";
export type HairStyle = "short" | "long" | "shaved" | "ponytail" | "spiky";
export type BeardStyle = "none" | "stubble" | "full";
export type SkinTone = "pale" | "light" | "tan" | "deep" | "dark";
export type OutfitId = "recruit_garb" | "scoutwrap" | "sentinel_plate" | "arcane_robes";

/**
 * Everything a hunter can customize about their Aventure silhouette.
 * Rendered by AvatarSilhouette as layered original SVG shapes — no
 * illustrated/licensed art, same rule as GateEmblem/ShadowSigil.
 */
export type CharacterAppearance = {
  gender: Gender;
  hairStyle: HairStyle;
  hairColor: string; // hex
  eyeColor: string; // hex
  skinTone: SkinTone;
  beard: BeardStyle;
  outfitId: OutfitId;
};
