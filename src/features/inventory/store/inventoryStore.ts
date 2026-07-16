import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { appStorage } from "@/lib/storage/storage";
import { getItemDefinition } from "../data/items";
import { canEquip, slotForCategory } from "../engine/inventoryEngine";
import { EQUIPMENT_SLOT_IDS } from "../types";
import type { EquipmentSlotId, EquipmentSlots, InventoryItemInstance } from "../types";

const EMPTY_SLOTS: EquipmentSlots = EQUIPMENT_SLOT_IDS.reduce(
  (acc, slot) => ({ ...acc, [slot]: null }),
  {} as EquipmentSlots,
);

type InventoryStore = {
  owned: InventoryItemInstance[];
  equipped: EquipmentSlots;
  addItem: (itemId: string, quantity: number, source: InventoryItemInstance["source"]) => InventoryItemInstance | null;
  removeInstance: (instanceId: string, quantity?: number) => void;
  setUpgradeLevel: (instanceId: string, upgradeLevel: number) => void;
  equip: (instanceId: string, hunterLevel: number) => { ok: boolean; reason?: string };
  unequip: (slot: EquipmentSlotId) => void;
  getInstance: (instanceId: string) => InventoryItemInstance | undefined;
};

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      owned: [],
      equipped: EMPTY_SLOTS,

      addItem: (itemId, quantity, source) => {
        const def = getItemDefinition(itemId);
        if (!def || quantity <= 0) return null;

        if (def.stackable) {
          const existing = get().owned.find((i) => i.itemId === itemId);
          if (existing) {
            const updated: InventoryItemInstance = { ...existing, quantity: existing.quantity + quantity };
            set({ owned: get().owned.map((i) => (i.instanceId === existing.instanceId ? updated : i)) });
            return updated;
          }
        }

        const instance: InventoryItemInstance = {
          instanceId: `${itemId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          itemId,
          quantity: def.stackable ? quantity : 1,
          upgradeLevel: 0,
          acquiredAt: new Date().toISOString(),
          source,
        };
        set({ owned: [instance, ...get().owned] });
        return instance;
      },

      removeInstance: (instanceId, quantity) => {
        const instance = get().owned.find((i) => i.instanceId === instanceId);
        if (!instance) return;
        if (quantity && quantity < instance.quantity) {
          set({
            owned: get().owned.map((i) => (i.instanceId === instanceId ? { ...i, quantity: i.quantity - quantity } : i)),
          });
          return;
        }
        set({
          owned: get().owned.filter((i) => i.instanceId !== instanceId),
          equipped: (Object.fromEntries(
            Object.entries(get().equipped).map(([slot, id]) => [slot, id === instanceId ? null : id]),
          ) as EquipmentSlots),
        });
      },

      setUpgradeLevel: (instanceId, upgradeLevel) =>
        set({ owned: get().owned.map((i) => (i.instanceId === instanceId ? { ...i, upgradeLevel } : i)) }),

      equip: (instanceId, hunterLevel) => {
        const instance = get().owned.find((i) => i.instanceId === instanceId);
        if (!instance) return { ok: false, reason: "Item not owned." };
        const def = getItemDefinition(instance.itemId);
        if (!def) return { ok: false, reason: "Unknown item." };
        const check = canEquip(def, hunterLevel);
        if (!check.ok) return check;
        const slot = slotForCategory(def.category) as EquipmentSlotId;
        set({ equipped: { ...get().equipped, [slot]: instanceId } });
        return { ok: true };
      },

      unequip: (slot) => set({ equipped: { ...get().equipped, [slot]: null } }),

      getInstance: (instanceId) => get().owned.find((i) => i.instanceId === instanceId),
    }),
    {
      name: "solo-leveling.inventory",
      storage: createJSONStorage(() => appStorage),
      merge: (persisted, current) => {
        const persistedState = persisted as Partial<InventoryStore> | undefined;
        return {
          ...current,
          ...persistedState,
          equipped: { ...current.equipped, ...persistedState?.equipped },
        };
      },
    },
  ),
);
