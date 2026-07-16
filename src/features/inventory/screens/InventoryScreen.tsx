import React, { useCallback, useMemo, useState } from "react";
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { getItemDefinition } from "../data/items";
import { useInventoryStore } from "../store/inventoryStore";
import { slotForCategory } from "../engine/inventoryEngine";
import { chipTierForItemRarity } from "../engine/rarityDisplay";
import type { EquipmentSlotId, ItemCategory, ItemDefinition, InventoryItemInstance } from "../types";

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

  // `owned` grows unboundedly over a save's lifetime (every Gate/workout
  // chest appends to it) — SectionList virtualizes rendering instead of a
  // ScrollView rendering every row up front.
  const sections = useMemo(() => {
    const groups: Partial<Record<ItemCategory, InventoryItemInstance[]>> = {};
    for (const instance of owned) {
      const def = getItemDefinition(instance.itemId);
      if (!def) continue;
      groups[def.category] = [...(groups[def.category] ?? []), instance];
    }
    return (Object.keys(groups) as ItemCategory[]).map((category) => ({
      title: CATEGORY_LABELS[category],
      data: groups[category]!,
    }));
  }, [owned]);

  const handleEquip = useCallback(
    (instanceId: string) => {
      const result = equip(instanceId, level);
      setFeedback(result.ok ? "Equipped." : result.reason ?? "Can't equip that.");
    },
    [equip, level],
  );

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <SectionList
        contentContainerStyle={styles.content}
        sections={sections}
        keyExtractor={(item) => item.instanceId}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SectionHeader title="Inventory" subtitle={`${owned.length} items owned`} />
            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
            {owned.length === 0 ? <Text style={styles.emptyText}>Clear a Gate to start earning loot.</Text> : null}
          </>
        }
        renderSectionHeader={({ section }) => <Text style={styles.groupTitle}>{section.title}</Text>}
        renderItem={({ item }) => {
          const def = getItemDefinition(item.itemId)!;
          const slot = slotForCategory(def.category);
          const isEquipped = slot ? equipped[slot] === item.instanceId : false;
          return <InventoryRow instance={item} def={def} slot={slot} isEquipped={isEquipped} onEquip={handleEquip} />;
        }}
      />
    </ScreenBackground>
  );
}

const InventoryRow = React.memo(function InventoryRow({
  instance,
  def,
  slot,
  isEquipped,
  onEquip,
}: {
  instance: InventoryItemInstance;
  def: ItemDefinition;
  slot: EquipmentSlotId | null;
  isEquipped: boolean;
  onEquip: (instanceId: string) => void;
}) {
  return (
    <GlassPanel glow={isEquipped ? "arcane" : "none"} style={styles.row}>
      <Ionicons name={def.icon} size={18} color={isEquipped ? colors.arcane[200] : colors.slate} />
      <View style={styles.rowText}>
        <View style={styles.rowTitleLine}>
          <Text style={styles.rowTitle}>
            {def.name}
            {instance.upgradeLevel > 0 ? ` +${instance.upgradeLevel}` : ""}
            {instance.quantity > 1 ? ` ×${instance.quantity}` : ""}
          </Text>
          <Chip label={def.rarity} tier={chipTierForItemRarity(def.rarity)} />
        </View>
        <Text style={styles.rowDescription}>{def.description}</Text>
      </View>
      {slot ? (
        <Pressable onPress={() => onEquip(instance.instanceId)} style={styles.equipButton}>
          <Text style={styles.equipLabel}>{isEquipped ? "Equipped" : "Equip"}</Text>
        </Pressable>
      ) : null}
    </GlassPanel>
  );
});

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 8 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300] },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  groupTitle: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.slate, textTransform: "uppercase", letterSpacing: 0.6 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  rowText: { flex: 1, gap: 2 },
  rowTitleLine: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white },
  rowDescription: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  equipButton: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: "rgba(157,78,255,0.14)", borderWidth: 1, borderColor: "rgba(157,78,255,0.35)" },
  equipLabel: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.arcane[200] },
});
