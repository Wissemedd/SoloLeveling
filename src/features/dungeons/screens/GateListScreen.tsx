import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, SectionHeader } from "@/design-system/components";
import { colors, fonts, rankColors } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { getRegion } from "../data/regions";
import { useDungeonStore } from "../store/dungeonStore";
import { isGateExpired } from "../engine/gateEngine";

type Props = NativeStackScreenProps<AdventureStackParamList, "GateList">;

export function GateListScreen({ route, navigation }: Props) {
  const { regionId } = route.params;
  const region = getRegion(regionId);
  const energy = usePlayerStore((s) => s.energy);
  // Reads the raw persisted slice (referentially stable between renders)
  // and derives the filtered list locally — computing a new array inside
  // the Zustand selector itself breaks useSyncExternalStore's snapshot check.
  const regionGates = useDungeonStore((s) => s.gatesByRegion[regionId]);
  const refreshGates = useDungeonStore((s) => s.refreshGates);
  const gates = useMemo(() => (regionGates ?? []).filter((g) => !isGateExpired(g)), [regionGates]);

  useEffect(() => {
    refreshGates(regionId);
  }, [regionId, refreshGates]);

  return (
    <ScreenBackground accent="danger" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title={region?.name ?? "Gates"} subtitle={`Energy: ${energy}`} />
        {gates.length === 0 ? <Text style={styles.emptyText}>No Gates open right now — check back later.</Text> : null}
        {gates.map((gate) => (
          <Pressable key={gate.id} onPress={() => navigation.navigate("GateDetail", { gateId: gate.id, regionId })}>
            <GlassPanel glow={gate.isFeaturedBossGate ? "gold" : "danger"} style={styles.card}>
              <View style={[styles.rankBadge, { borderColor: rankColors[gate.rank] }]}>
                <Text style={[styles.rankLabel, { color: rankColors[gate.rank] }]}>{gate.rank}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{gate.isFeaturedBossGate ? gate.boss.name : `${gate.rank}-Rank Gate`}</Text>
                <Text style={styles.cardMeta}>
                  Lv {gate.recommendedLevel} · {gate.encounterMonsters.length} monsters · ~{gate.estimatedMinutes} min · {gate.energyCost} energy
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.slate} />
            </GlassPanel>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  card: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  rankBadge: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  rankLabel: { fontFamily: fonts.display, fontSize: 13 },
  cardText: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  cardMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
