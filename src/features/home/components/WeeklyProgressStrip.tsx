import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SectionHeader } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { WorkoutSessionLog } from "@/features/workouts/types";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function intensityColor(count: number): string {
  if (count === 0) return "rgba(255,255,255,0.06)";
  if (count === 1) return colors.neon[500];
  if (count === 2) return colors.neon[300];
  return colors.gold[300];
}

export function WeeklyProgressStrip({ history }: { history: WorkoutSessionLog[] }) {
  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (6 - i));
      const iso = d.toISOString().slice(0, 10);
      const count = history.filter((h) => h.completedAt.slice(0, 10) === iso).length;
      return { label: DAY_LABELS[d.getDay()], count, isToday: i === 6 };
    });
  }, [history]);

  return (
    <View style={styles.wrapper}>
      <SectionHeader title="This Week" subtitle="Every quest completed lights a day" />
      <View style={styles.row}>
        {days.map((day, idx) => (
          <View key={idx} style={styles.dayCol}>
            <View
              style={[
                styles.cell,
                { backgroundColor: intensityColor(day.count) },
                day.isToday && styles.cellToday,
              ]}
            />
            <Text style={styles.dayLabel}>{day.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, marginTop: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  dayCol: { alignItems: "center", gap: 6 },
  cell: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  cellToday: { borderColor: colors.neon[300], borderWidth: 1.5 },
  dayLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
