import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, SectionHeader, Chip, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { getItemDefinition } from "@/features/inventory/data/items";
import { chipTierForItemRarity } from "@/features/inventory/engine/rarityDisplay";

type Props = NativeStackScreenProps<AdventureStackParamList, "CombatResults">;

export function CombatResultsScreen({ route, navigation }: Props) {
  const { summary } = route.params;
  const cleared = summary.log?.gateCleared ?? false;

  return (
    <ScreenBackground accent={cleared ? "gold" : "danger"} particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{cleared ? "Gate Cleared" : "Gate Failed"}</Text>
        <Text style={styles.subtitle}>
          {cleared
            ? "The Gate collapses behind you."
            : "You were overwhelmed. Train harder in the real world before trying again."}
        </Text>

        <GlassPanel glow={cleared ? "gold" : "danger"} style={styles.panel}>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardLabel}>Gold earned</Text>
            <Text style={styles.rewardValue}>{summary.goldEarned}</Text>
          </View>
        </GlassPanel>

        {summary.itemIdsEarned.length > 0 ? (
          <>
            <SectionHeader title="Loot" />
            <View style={styles.itemGrid}>
              {summary.itemIdsEarned.map((itemId, i) => {
                const def = getItemDefinition(itemId);
                return def ? <Chip key={`${itemId}-${i}`} label={def.name} tier={chipTierForItemRarity(def.rarity)} /> : null;
              })}
            </View>
          </>
        ) : null}

        {summary.newlyUnlockedAchievements.length > 0 ? (
          <>
            <SectionHeader title="Achievements unlocked" />
            <View style={styles.itemGrid}>
              {summary.newlyUnlockedAchievements.map((a) => (
                <Chip key={a.id} label={a.title} tier={a.tier} />
              ))}
            </View>
          </>
        ) : null}

        <GlowButton label="Return to the Gate list" variant="arcane" size="lg" onPress={() => navigation.popToTop()} style={styles.button} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 32, paddingBottom: 48, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.white, textAlign: "center" },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, textAlign: "center", marginBottom: 8 },
  panel: { padding: 16 },
  rewardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rewardLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.slate },
  rewardValue: { fontFamily: fonts.display, fontSize: 18, color: colors.gold[200] },
  itemGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  button: { marginTop: 16 },
});
