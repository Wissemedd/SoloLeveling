import { items } from "@/features/inventory/data/items";
import type { ItemDefinition } from "@/features/inventory/types";

/**
 * Only common/uncommon/rare gear (plus potions/materials) is ever sold —
 * epic and above (buyValue: null in the item data) can only be earned from
 * Gates/bosses/Forge. This is the mechanical anti-pay-to-win guarantee: gold
 * buys convenience, never top-tier power.
 */
export function getShopCatalog(): ItemDefinition[] {
  return items.filter((item) => item.buyValue !== null);
}

export function purchaseItem(currentGold: number, def: ItemDefinition): { ok: boolean; reason?: string; cost: number } {
  if (def.buyValue === null) return { ok: false, reason: "Not for sale.", cost: 0 };
  if (currentGold < def.buyValue) return { ok: false, reason: "Not enough gold.", cost: def.buyValue };
  return { ok: true, cost: def.buyValue };
}
