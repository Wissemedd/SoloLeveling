import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import type { ItemRarity } from "@/features/inventory/types";
import type { RarityTier } from "@/design-system/theme";
import { getShopCatalog, purchaseItem } from "../engine/shopEngine";

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

export function ShopScreen() {
  const gold = usePlayerStore((s) => s.gold);
  const addGold = usePlayerStore((s) => s.addGold);
  const addItem = useInventoryStore((s) => s.addItem);
  const [feedback, setFeedback] = useState<string | null>(null);

  const catalog = getShopCatalog();

  const handleBuy = (defId: string) => {
    const def = catalog.find((i) => i.id === defId);
    if (!def) return;
    const result = purchaseItem(gold, def);
    if (!result.ok) {
      setFeedback(result.reason ?? "Can't buy that.");
      return;
    }
    addGold(-result.cost);
    addItem(def.id, 1, "shop");
    setFeedback(`Bought ${def.name}.`);
  };

  return (
    <ScreenBackground accent="gold" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Gate-town Shop" subtitle={`${gold} gold — common/rare gear only, never pay-to-win`} />
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
        {catalog.map((def) => (
          <GlassPanel key={def.id} glow="none" style={styles.row}>
            <Ionicons name={def.icon} size={20} color={colors.gold[200]} />
            <View style={styles.rowText}>
              <View style={styles.rowTitleLine}>
                <Text style={styles.rowTitle}>{def.name}</Text>
                <Chip label={def.rarity} tier={CHIP_TIER_BY_ITEM_RARITY[def.rarity]} />
              </View>
              <Text style={styles.rowDescription}>{def.description}</Text>
            </View>
            <Pressable onPress={() => handleBuy(def.id)} style={styles.buyButton} disabled={gold < (def.buyValue ?? Infinity)}>
              <Text style={styles.buyLabel}>{def.buyValue} G</Text>
            </Pressable>
          </GlassPanel>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300], marginBottom: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowText: { flex: 1, gap: 2 },
  rowTitleLine: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  rowDescription: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  buyButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: "rgba(245,185,77,0.16)", borderWidth: 1, borderColor: "rgba(245,185,77,0.4)" },
  buyLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.gold[200] },
});
