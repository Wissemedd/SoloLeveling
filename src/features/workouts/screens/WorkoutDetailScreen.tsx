import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, GlowButton, Chip, StatBar } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { RPG_STAT_LABELS } from "@/features/player/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { workouts } from "../data/workouts";
import { exerciseById, targetDescription } from "../engine/sessionEngine";
import { isUnlocked } from "../engine/workoutEngine";
import type { WorkoutsStackParamList } from "@/app/navigation/types";
import type { SessionBlock } from "../engine/sessionEngine";
import type { WorkoutSetEntry } from "../types";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "Detail">;

const BLOCK_LABEL: Record<SessionBlock, string> = { warmup: "Warm-up", main: "Main Set", cooldown: "Cooldown" };

export function WorkoutDetailScreen({ route, navigation }: Props) {
  const workout = useMemo(() => workouts.find((w) => w.id === route.params.workoutId), [route.params.workoutId]);
  const level = usePlayerStore((s) => s.level);

  if (!workout) return null;
  const unlocked = isUnlocked(workout, level);

  return (
    <ScreenBackground accent="arcane">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.tagRow}>
          <Chip label={workout.difficulty} tier="rare" />
          {workout.focus.map((f) => (
            <Chip key={f} label={f} tier="common" />
          ))}
        </View>
        <Text style={styles.title}>{workout.title}</Text>
        <Text style={styles.description}>{workout.description}</Text>

        <View style={styles.metaGrid}>
          <MetaBlock label="Duration" value={`${workout.durationMinutes} min`} />
          <MetaBlock label="Calories" value={`${workout.estimatedCalories} kcal`} />
          <MetaBlock label="XP Reward" value={`+${workout.xpReward}`} />
        </View>

        <GlassPanel glow="gold" style={styles.rewardsPanel}>
          <Text style={styles.rewardsTitle}>Stat Rewards</Text>
          {Object.entries(workout.statRewards).map(([key, value]) => (
            <View key={key} style={styles.rewardRow}>
              <Text style={styles.rewardLabel}>{RPG_STAT_LABELS[key as keyof typeof RPG_STAT_LABELS]}</Text>
              <Text style={styles.rewardValue}>+{value}</Text>
            </View>
          ))}
        </GlassPanel>

        {(["warmup", "main", "cooldown"] as SessionBlock[]).map((block) => (
          <BlockSection key={block} block={block} entries={workout.blocks[block]} />
        ))}

        <GlowButton
          label={unlocked ? "Begin Quest" : `Unlocks at Level ${workout.unlockLevel}`}
          variant="arcane"
          size="lg"
          disabled={!unlocked}
          onPress={() => navigation.navigate("Session", { workoutId: workout.id })}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

function MetaBlock({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaBlock}>
      <Text style={styles.metaValue}>{value}</Text>
      <Text style={styles.metaLabel}>{label}</Text>
    </View>
  );
}

function BlockSection({ block, entries }: { block: SessionBlock; entries: WorkoutSetEntry[] }) {
  return (
    <View style={styles.blockSection}>
      <Text style={styles.blockTitle}>{BLOCK_LABEL[block]}</Text>
      {entries.map((entry, idx) => {
        const exercise = exerciseById.get(entry.exerciseId);
        if (!exercise) return null;
        return (
          <View key={idx} style={styles.exerciseRow}>
            <View style={styles.exerciseDot} />
            <View style={styles.exerciseTextCol}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseMeta}>
                {entry.sets} × {targetDescription(entry)} · {entry.restSeconds}s rest
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 16 },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, lineHeight: 19 },
  metaGrid: { flexDirection: "row", justifyContent: "space-between" },
  metaBlock: { alignItems: "center", flex: 1 },
  metaValue: { fontFamily: fonts.display, fontSize: 16, color: colors.neon[300] },
  metaLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.slate, marginTop: 2 },
  rewardsPanel: { padding: 16, gap: 8 },
  rewardsTitle: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gold[200], textTransform: "uppercase", letterSpacing: 0.6 },
  rewardRow: { flexDirection: "row", justifyContent: "space-between" },
  rewardLabel: { fontFamily: fonts.body, fontSize: 13, color: colors.white },
  rewardValue: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.gold[200] },
  blockSection: { gap: 10 },
  blockTitle: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.arcane[200], textTransform: "uppercase", letterSpacing: 0.6 },
  exerciseRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  exerciseDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.arcane[300], marginTop: 6 },
  exerciseTextCol: { flex: 1 },
  exerciseName: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.white },
  exerciseMeta: { fontFamily: fonts.body, fontSize: 11, color: colors.slate, marginTop: 1 },
  cta: { marginTop: 8 },
});
