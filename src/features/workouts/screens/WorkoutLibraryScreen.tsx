import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, SectionHeader } from "@/design-system/components";
import { colors, fonts, radii } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { getAvailableWorkouts, filterWorkouts } from "../engine/workoutEngine";
import { workouts } from "../data/workouts";
import { WorkoutCard } from "../components/WorkoutCard";
import type { DifficultyTier } from "../types";
import type { WorkoutsStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "Library">;

const DIFFICULTY_FILTERS: { label: string; value: DifficultyTier | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Elite", value: "elite" },
];

export function WorkoutLibraryScreen({ navigation }: Props) {
  const level = usePlayerStore((s) => s.level);
  const [difficulty, setDifficulty] = useState<DifficultyTier | "all">("all");

  const availableIds = useMemo(() => new Set(getAvailableWorkouts(workouts, level).map((w) => w.id)), [level]);

  const filtered = useMemo(
    () => filterWorkouts(workouts, difficulty === "all" ? {} : { difficulty: [difficulty] }),
    [difficulty],
  );

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <View style={styles.header}>
        <SectionHeader title="Workout Library" subtitle={`${workouts.length} original training gates`} />
      </View>
      <View style={styles.filterRow}>
        {DIFFICULTY_FILTERS.map((f) => {
          const active = f.value === difficulty;
          return (
            <Pressable
              key={f.value}
              onPress={() => setDifficulty(f.value)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(w) => w.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}
            locked={!availableIds.has(item.id)}
            onPress={() => navigation.navigate("Detail", { workoutId: item.id })}
          />
        )}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12 },
  filterRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  filterChipActive: {
    borderColor: colors.arcane[300],
    backgroundColor: "rgba(157,78,255,0.16)",
  },
  filterLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate },
  filterLabelActive: { color: colors.arcane[100] },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
});
