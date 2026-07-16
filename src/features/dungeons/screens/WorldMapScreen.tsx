import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, SectionHeader } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { regions } from "../data/regions";
import type { RegionTheme } from "../types";

type Props = NativeStackScreenProps<AdventureStackParamList, "WorldMap">;

const THEME_ICON: Record<RegionTheme, keyof typeof Ionicons.glyphMap> = {
  forest: "leaf",
  mountains: "triangle",
  desert: "sunny",
  ruins: "business",
  city: "business",
  marsh: "water",
  frozen_lands: "snow",
  volcano: "flame",
};

export function WorldMapScreen({ navigation }: Props) {
  return (
    <ScreenBackground accent="arcane" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="World Map" subtitle="Every region the Association has charted so far." />
        {regions.map((region) => (
          <Pressable
            key={region.id}
            disabled={!region.unlocked}
            onPress={() => navigation.navigate("GateList", { regionId: region.id })}
          >
            <GlassPanel glow={region.unlocked ? "arcane" : "none"} style={[styles.card, !region.unlocked && styles.cardLocked]}>
              <Ionicons name={region.unlocked ? THEME_ICON[region.theme] : "lock-closed"} size={22} color={region.unlocked ? colors.arcane[200] : colors.slate} />
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{region.name}</Text>
                <Text style={styles.cardDescription}>{region.unlocked ? region.description : "Coming soon."}</Text>
                <Text style={styles.cardLevel}>
                  Recommended level {region.recommendedLevelRange[0]}–{region.recommendedLevelRange[1]}
                </Text>
              </View>
            </GlassPanel>
          </Pressable>
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  cardLocked: { opacity: 0.5 },
  cardText: { flex: 1, gap: 2 },
  cardTitle: { fontFamily: fonts.bodySemibold, fontSize: 15, color: colors.white },
  cardDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  cardLevel: { fontFamily: fonts.body, fontSize: 11, color: colors.arcane[300], marginTop: 2 },
});
