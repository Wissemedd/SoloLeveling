import { create } from "zustand";

/**
 * Ephemeral, per-combat-run cooldown tracking — intentionally NOT persisted
 * (resetAll is called at the start of every dungeon run, see combat module).
 */
type SkillCooldownStore = {
  cooldowns: Record<string, number>;
  isReady: (skillId: string) => boolean;
  setCooldown: (skillId: string, rounds: number) => void;
  tick: () => void;
  resetAll: () => void;
};

export const useSkillCooldownStore = create<SkillCooldownStore>((set, get) => ({
  cooldowns: {},

  isReady: (skillId) => (get().cooldowns[skillId] ?? 0) <= 0,

  setCooldown: (skillId, rounds) => set({ cooldowns: { ...get().cooldowns, [skillId]: rounds } }),

  tick: () =>
    set({
      cooldowns: Object.fromEntries(
        Object.entries(get().cooldowns).map(([id, remaining]) => [id, Math.max(0, remaining - 1)]),
      ),
    }),

  resetAll: () => set({ cooldowns: {} }),
}));
