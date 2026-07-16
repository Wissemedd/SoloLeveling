import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";

/** features/social/types.ts already defines the Guild contract — no UI until there's a backend to back it. */
export function GuildScreen() {
  return (
    <ScreenBackground accent="arcane" particles={false}>
      <View style={styles.centered}>
        <GlassPanel glow="arcane" style={styles.panel}>
          <Ionicons name="people" size={28} color={colors.arcane[200]} />
          <Text style={styles.title}>Guild</Text>
          <Text style={styles.description}>Guilds, raids, and co-op Gates are planned for a future update once multiplayer is wired up.</Text>
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
