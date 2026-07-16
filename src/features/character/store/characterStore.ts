import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { defaultAppearance } from "../data/appearanceOptions";
import type { CharacterAppearance } from "../types";

type CharacterStore = {
  isCreated: boolean;
  name: string;
  appearance: CharacterAppearance;
  createCharacter: (name: string, appearance: CharacterAppearance) => void;
  updateAppearance: (patch: Partial<CharacterAppearance>) => void;
  renameCharacter: (name: string) => void;
};

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      isCreated: false,
      name: "",
      appearance: defaultAppearance(),

      createCharacter: (name, appearance) => set({ isCreated: true, name, appearance }),

      updateAppearance: (patch) => set({ appearance: { ...get().appearance, ...patch } }),

      renameCharacter: (name) => set({ name }),
    }),
    {
      name: "solo-leveling.character",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
