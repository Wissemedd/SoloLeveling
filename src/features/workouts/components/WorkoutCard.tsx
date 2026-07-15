import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { Workout } from "../types";

const DIFFICULTY_TIER: Record<Workout["difficulty"], "common" | "rare" | "epic" | "legendary"> = {
  beginner: "common",
  intermediate: "rare",
  advanced: "epic",
  elite: "legendary",
};

type Props = {
  workout: Workout;
  locked: boolean;
  onPress: () => void;
};

export function WorkoutCard({ workout, locked, onPress }: Props) {
  return (
    <Pressable onPress={locked ? undefined : onPress} disabled={locked}>
      <GlassPanel glow={locked ? "none" : "neon"} style={[styles.panel, locked && styles.locked]}>
        <View style={styles.headerRow}>
          <Chip label={workout.difficulty} tier={DIFFICULTY_TIER[workout.difficulty]} />
          {locked ? (
            <View style={styles.lockRow}>
              <Ionicons name="lock-closed" size={12} color={colors.slate} />
              <Text style={styles.lockText}>Lvl {workout.unlockLevel}</Text>
            </View>
          ) : (
            <Text style={styles.xp}>+{workout.xpReward} XP</Text>
          )}
        </View>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
        <View style={styles.metaRow}>
          <MetaItem icon="time-outline" label={`${workout.durationMinutes} min`} />
          <MetaItem icon="flame-outline" label={`${workout.estimatedCalories} kcal`} />
          <MetaItem icon="barbell-outline" label={workout.equipment[0].replace("_", " ")} />
        </View>
      </GlassPanel>
    </Pressable>
  );
}

function MetaItem({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={13} color={colors.slate} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 16, gap: 8, marginBottom: 14 },
  locked: { opacity: 0.5 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  lockRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  lockText: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.slate },
  xp: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.neon[300] },
  title: { fontFamily: fonts.display, fontSize: 15, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 12, color: colors.slate, lineHeight: 17 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 4 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: fonts.body, fontSize: 11, color: colors.slate, textTransform: "capitalize" },
});
