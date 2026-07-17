import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, SectionHeader, Chip, GlowButton, InfoRow } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useDungeonStore } from "../store/dungeonStore";
import { isGateExpired } from "../engine/gateEngine";
import { chipTierForItemRarity } from "@/features/inventory/engine/rarityDisplay";
import { MonsterSprite } from "@/features/monsters/components/MonsterSprite";

type Props = NativeStackScreenProps<AdventureStackParamList, "GateDetail">;

export function GateDetailScreen({ route, navigation }: Props) {
  const { gateId, regionId } = route.params;
  const energy = usePlayerStore((s) => s.energy);
  const regionGates = useDungeonStore((s) => s.gatesByRegion[regionId]);
  const gate = useMemo(
    () => (regionGates ?? []).find((g) => g.id === gateId && !isGateExpired(g)),
    [regionGates, gateId],
  );

  if (!gate) {
    return (
      <ScreenBackground accent="danger" particles={false}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>This Gate has already closed.</Text>
          <GlowButton label="Back" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </ScreenBackground>
    );
  }

  const canEnter = energy >= gate.energyCost;

  return (
    <ScreenBackground accent="danger" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{gate.isFeaturedBossGate ? gate.boss.name : `${gate.rank}-Rank Gate`}</Text>
        <Text style={styles.subtitle}>{gate.boss.description}</Text>

        <GlassPanel glow="danger" style={styles.panel}>
          <InfoRow label="Recommended level" value={`${gate.recommendedLevel}`} />
          <InfoRow label="Monsters" value={`${gate.encounterMonsters.length}`} />
          <InfoRow label="Estimated time" value={`${gate.estimatedMinutes} min`} />
          <InfoRow label="Energy cost" value={`${gate.energyCost} (you have ${energy})`} />
        </GlassPanel>

        <SectionHeader title="Encounters" />
        <View style={styles.chipGrid}>
          {gate.encounterMonsters.map((m) => (
            <Chip key={m.id} label={m.name} tier="common" />
          ))}
        </View>

        <SectionHeader title="Boss" />
        <GlassPanel glow="gold" style={styles.panel}>
          <View style={styles.bossRow}>
            <MonsterSprite monster={gate.boss} size={64} animated={false} />
            <Text style={styles.bossName}>{gate.boss.name}</Text>
          </View>
          <Text style={styles.cardDescription}>{gate.boss.description}</Text>
        </GlassPanel>

        <SectionHeader title="Possible loot" />
        <View style={styles.chipGrid}>
          {gate.lootPreview.map((entry, i) => (
            <Chip key={i} label={`${entry.rarity} ${Math.round(entry.chance * 100)}%`} tier={chipTierForItemRarity(entry.rarity)} />
          ))}
        </View>

        <GlowButton
          label={canEnter ? "Enter the Gate" : "Not enough energy"}
          variant="danger"
          size="lg"
          disabled={!canEnter}
          onPress={() => navigation.navigate("Combat", { gate })}
          style={styles.enterButton}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, lineHeight: 19, marginBottom: 4 },
  panel: { padding: 16, gap: 8 },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  bossRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  bossName: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  cardDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  enterButton: { marginTop: 12 },
});
