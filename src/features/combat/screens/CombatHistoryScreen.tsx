import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { getRegion } from "@/features/dungeons/data/regions";
import { useCombatHistoryStore } from "../store/combatHistoryStore";

export function CombatHistoryScreen() {
  const entries = useCombatHistoryStore((s) => s.entries);

  return (
    <ScreenBackground accent="neon" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="Combat History" subtitle={`${entries.length} Gate runs recorded`} />
        {entries.length === 0 ? <Text style={styles.emptyText}>No Gates cleared yet.</Text> : null}
        {entries.map((entry) => (
          <GlassPanel key={entry.id} glow={entry.gateCleared ? "neon" : "danger"} style={styles.row}>
            <Ionicons name={entry.gateCleared ? "checkmark-circle" : "close-circle"} size={20} color={entry.gateCleared ? colors.neon[300] : colors.danger[400]} />
            <View style={styles.rowText}>
              <Text style={styles.title}>
                {getRegion(entry.regionId)?.name ?? entry.regionId} · Rank {entry.rank} {entry.bossDefeated ? "· Boss defeated" : ""}
              </Text>
              <Text style={styles.meta}>
                {entry.monstersDefeated} monsters defeated · {entry.goldEarned} gold · {entry.itemIds.length} items · {new Date(entry.completedAt).toLocaleDateString()}
              </Text>
            </View>
          </GlassPanel>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rowText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white },
  meta: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
