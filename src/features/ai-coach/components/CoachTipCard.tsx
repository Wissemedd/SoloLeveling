import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { generateCoachTip } from "../engine/aiCoachEngine";
import type { CoachContext } from "../types";

export function CoachTipCard({ context }: { context: CoachContext }) {
  const tip = useMemo(() => generateCoachTip(context), [context]);

  return (
    <GlassPanel glow="arcane" style={styles.panel}>
      <View style={styles.iconWrap}>
        <Ionicons name="sparkles" size={16} color={colors.arcane[300]} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.label}>Coach</Text>
        <Text style={styles.message}>{tip.message}</Text>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: { flexDirection: "row", padding: 14, gap: 12, marginHorizontal: 20, alignItems: "flex-start" },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.arcane[300],
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: { flex: 1 },
  label: { fontFamily: fonts.bodySemibold, fontSize: 11, color: colors.arcane[200], textTransform: "uppercase", letterSpacing: 0.6 },
  message: { fontFamily: fonts.body, fontSize: 13, color: colors.white, lineHeight: 19, marginTop: 3 },
});
