/**
 * Shared turn-based-combat animation contract for the player avatar and
 * monster sprites. Lives in design-system (not the character or combat
 * feature) so both can depend on it without creating a cross-feature cycle
 * (combat already depends on character for AvatarSilhouette).
 */
export type CombatVisualPhase = "idle" | "attack" | "hit" | "crit-hit" | "dodge" | "cast" | "victory" | "defeat";

export type CombatVisualState = {
  phase: CombatVisualPhase;
  /** Bump this on every event, even if `phase` repeats, to retrigger the animation. */
  nonce: number;
};
