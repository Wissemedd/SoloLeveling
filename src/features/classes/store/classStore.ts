import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { getNode, getRootNode } from "../engine/classEngine";
import type { ClassArchetypeId } from "../types";

type EvolutionRecord = { nodeId: string; evolvedAt: string };

type ClassStore = {
  currentNodeId: string | null;
  chosenBranch: string | null;
  history: EvolutionRecord[];
  /** Grants the tier-E root of the chosen archetype. Called once at hunter creation. */
  initForArchetype: (archetype: ClassArchetypeId) => void;
  /** Confirms a manual evolution choice — locks the branch in on the first fork. */
  evolveTo: (nodeId: string) => void;
};

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      currentNodeId: null,
      chosenBranch: null,
      history: [],

      initForArchetype: (archetype) => {
        const root = getRootNode(archetype);
        set({
          currentNodeId: root.id,
          chosenBranch: null,
          history: [{ nodeId: root.id, evolvedAt: new Date().toISOString() }],
        });
      },

      evolveTo: (nodeId) => {
        const node = getNode(nodeId);
        if (!node) return;
        set({
          currentNodeId: nodeId,
          chosenBranch: get().chosenBranch ?? node.branch,
          history: [...get().history, { nodeId, evolvedAt: new Date().toISOString() }],
        });
      },
    }),
    {
      name: "solo-leveling.class",
      storage: createJSONStorage(() => appStorage),
    },
  ),
);
