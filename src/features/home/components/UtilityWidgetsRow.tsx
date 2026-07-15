import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";

/**
 * Static placeholders — wire to a weather API (e.g. Open-Meteo) and the
 * user's connected music service once those integrations exist. Kept as
 * real components now so the layout and rhythm are already correct.
 */
export function UtilityWidgetsRow() {
  return (
    <View style={styles.row}>
      <GlassPanel glow="neon" style={styles.widget}>
        <Ionicons name="partly-sunny-outline" size={20} color={colors.neon[300]} />
        <Text style={styles.value}>18°C</Text>
        <Text style={styles.label}>Clear · good for outdoor quests</Text>
      </GlassPanel>
      <GlassPanel glow="arcane" style={styles.widget}>
        <Ionicons name="musical-notes-outline" size={20} color={colors.arcane[300]} />
        <Text style={styles.value}>Focus Drive</Text>
        <Text style={styles.label}>Today's training playlist</Text>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 20 },
  widget: { flex: 1, padding: 14, gap: 4 },
  value: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white, marginTop: 4 },
  label: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
