import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";

/** Needs a backend (see features/social) — same "coming soon" treatment as Guild & Friends on Profile. */
export function LeaderboardScreen() {
  return (
    <ScreenBackground accent="gold" particles={false}>
      <View style={styles.centered}>
        <GlassPanel glow="gold" style={styles.panel}>
          <Ionicons name="podium" size={28} color={colors.gold[200]} />
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.description}>Ranking hunters against each other needs a backend — coming in a future update.</Text>
        </GlassPanel>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  panel: { padding: 24, gap: 8, alignItems: "center", maxWidth: 320 },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, textAlign: "center" },
});
