import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { getItemDefinition } from "../data/items";
import { useInventoryStore } from "../store/inventoryStore";
import { slotForCategory } from "../engine/inventoryEngine";
import type { ItemCategory, ItemRarity } from "../types";
import type { RarityTier } from "@/design-system/theme";

const CHIP_TIER_BY_ITEM_RARITY: Record<ItemRarity, RarityTier> = {
  common: "common",
  uncommon: "common",
  rare: "rare",
  epic: "epic",
  legendary: "legendary",
  mythic: "legendary",
  unique: "legendary",
  divine: "legendary",
};

const CATEGORY_LABELS: Record<ItemCategory, string> = {
  weapon: "Weapons",
  armor: "Armor",
  helmet: "Helmets",
  gloves: "Gloves",
  boots: "Boots",
  ring: "Rings",
  necklace: "Necklaces",
  potion: "Potions",
  material: "Materials",
  rune: "Runes",
  quest: "Quest Items",
  misc: "Misc",
};

export function InventoryScreen() {
  const level = usePlayerStore((s) => s.level);
  const owned = useInventoryStore((s) => s.owned);
  const equipped = useInventoryStore((s) => s.equipped);
  const equip = useInventoryStore((s) => s.equip);
  const [feedback, setFeedback] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const groups: Partial<Record<ItemCategory, typeof owned>> = {};
    for (const instance of owned) {
      const def = getItemDefinition(instance.itemId);
      if (!def) continue;
      groups[def.category] = [...(groups[def.category] ?? []), instance];
    }
    return groups;
  }, [owned]);

  const handleEquip = (instanceId: string) => {
    const result = equip(instanceId, level);
    setFeedback(result.ok ? "Equipped." : result.reason ?? "Can't equip that.");
  };

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Inventory" subtitle={`${owned.length} items owned`} />
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        {owned.length === 0 ? <Text style={styles.emptyText}>Clear a Gate to start earning loot.</Text> : null}

        {(Object.keys(grouped) as ItemCategory[]).map((category) => (
          <View key={category} style={styles.group}>
            <Text style={styles.groupTitle}>{CATEGORY_LABELS[category]}</Text>
            {grouped[category]!.map((instance) => {
              const def = getItemDefinition(instance.itemId)!;
              const slot = slotForCategory(def.category);
              const isEquipped = slot ? equipped[slot] === instance.instanceId : false;
              return (
                <GlassPanel key={instance.instanceId} glow={isEquipped ? "arcane" : "none"} style={styles.row}>
                  <Ionicons name={def.icon} size={18} color={isEquipped ? colors.arcane[200] : colors.slate} />
                  <View style={styles.rowText}>
                    <View style={styles.rowTitleLine}>
                      <Text style={styles.rowTitle}>
                        {def.name}
                        {instance.upgradeLevel > 0 ? ` +${instance.upgradeLevel}` : ""}
                        {instance.quantity > 1 ? ` ×${instance.quantity}` : ""}
                      </Text>
                      <Chip label={def.rarity} tier={CHIP_TIER_BY_ITEM_RARITY[def.rarity]} />
                    </View>
                    <Text style={styles.rowDescription}>{def.description}</Text>
                  </View>
                  {slot ? (
                    <Pressable onPress={() => handleEquip(instance.instanceId)} style={styles.equipButton}>
                      <Text style={styles.equipLabel}>{isEquipped ? "Equipped" : "Equip"}</Text>
                    </Pressable>
                  ) : null}
                </GlassPanel>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 12 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300] },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  group: { gap: 8 },
  groupTitle: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.slate, textTransform: "uppercase", letterSpacing: 0.6 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  rowText: { flex: 1, gap: 2 },
  rowTitleLine: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white },
  rowDescription: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  equipButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "rgba(157,78,255,0.14)", borderWidth: 1, borderColor: "rgba(157,78,255,0.35)" },
  equipLabel: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.arcane[200] },
});
