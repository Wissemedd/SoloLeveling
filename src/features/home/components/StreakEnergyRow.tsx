import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel, ProgressRing } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { StreakStatus } from "@/features/player/engine/streakEngine";

type Props = {
  streakDays: number;
  energy: number;
  streakStatus: StreakStatus;
};

export function StreakEnergyRow({ streakDays, energy, streakStatus }: Props) {
  return (
    <View style={styles.row}>
      <GlassPanel glow={streakStatus.isAtRisk ? "danger" : "gold"} style={styles.card}>
        <ProgressRing
          progress={streakStatus.isAtRisk ? 0.3 : 1}
          size={72}
          strokeWidth={7}
          color={streakStatus.isAtRisk ? colors.danger[400] : colors.gold[300]}
          centerLabel={`${streakDays}`}
          centerSub="days"
        />
        <View style={styles.textCol}>
          <Text style={styles.label}>Streak</Text>
          <Text style={[styles.status, { color: streakStatus.isAtRisk ? colors.danger[300] : colors.gold[200] }]}>
            {streakStatus.isAtRisk ? "At risk — train today" : "Standing strong"}
          </Text>
        </View>
      </GlassPanel>

      <GlassPanel glow="neon" style={styles.card}>
        <ProgressRing
          progress={energy / 100}
          size={72}
          strokeWidth={7}
          color={colors.neon[300]}
          centerLabel={`${energy}`}
          centerSub="energy"
        />
        <View style={styles.textCol}>
          <Ionicons name="flash-outline" size={16} color={colors.neon[300]} />
          <Text style={styles.status}>Regenerates daily</Text>
        </View>
      </GlassPanel>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 16 },
  card: { flex: 1, padding: 14, alignItems: "center", gap: 8 },
  textCol: { alignItems: "center", gap: 2 },
  label: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.slate, textTransform: "uppercase" },
  status: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.slate, textAlign: "center" },
});
