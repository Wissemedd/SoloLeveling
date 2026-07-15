import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, GlowButton, Chip, StatBar, ProgressRing } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { workouts } from "../data/workouts";
import { buildSessionSteps, targetDescription } from "../engine/sessionEngine";
import { useCompleteWorkout } from "../hooks/useCompleteWorkout";
import type { WorkoutsStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "Session">;

const BLOCK_LABEL: Record<string, string> = { warmup: "Warm-up", main: "Main Set", cooldown: "Cooldown" };

export function WorkoutSessionScreen({ route, navigation }: Props) {
  const workout = useMemo(() => workouts.find((w) => w.id === route.params.workoutId)!, [route.params.workoutId]);
  const steps = useMemo(() => buildSessionSteps(workout), [workout]);
  const completeWorkout = useCompleteWorkout();

  const [stepIndex, setStepIndex] = useState(0);
  const [resting, setResting] = useState(false);
  const [restRemaining, setRestRemaining] = useState(0);

  const step = steps[stepIndex];
  const isLastStep = stepIndex === steps.length - 1;

  useEffect(() => {
    if (!resting) return;
    if (restRemaining <= 0) {
      setResting(false);
      setStepIndex((i) => i + 1);
      return;
    }
    const timeout = setTimeout(() => setRestRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timeout);
  }, [resting, restRemaining]);

  const finishWorkout = () => {
    const summary = completeWorkout(workout);
    navigation.replace("Results", { workoutId: workout.id, summary });
  };

  const handleCompleteSet = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isLastStep) {
      finishWorkout();
      return;
    }
    if (step.entry.restSeconds > 0) {
      setRestRemaining(step.entry.restSeconds);
      setResting(true);
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const handleSkipRest = () => {
    setResting(false);
    setStepIndex((i) => i + 1);
  };

  if (!step) return null;

  return (
    <ScreenBackground accent="neon">
      <View style={styles.content}>
        <StatBar label="Session Progress" value={stepIndex + (resting ? 1 : 0)} max={steps.length} accent="neon" showValue={false} />

        {resting ? (
          <View style={styles.centerBlock}>
            <ProgressRing
              progress={1 - restRemaining / step.entry.restSeconds}
              size={160}
              strokeWidth={12}
              color={colors.arcane[300]}
              centerLabel={`${restRemaining}s`}
              centerSub="rest"
            />
            <Text style={styles.upNext}>Up next</Text>
            <Text style={styles.upNextName}>{steps[stepIndex + 1]?.exercise.name ?? "Final stretch"}</Text>
            <GlowButton label="Skip Rest" variant="ghost" onPress={handleSkipRest} />
          </View>
        ) : (
          <View style={styles.centerBlock}>
            <Chip label={BLOCK_LABEL[step.block]} tier="rare" />
            <Text style={styles.exerciseName}>{step.exercise.name}</Text>
            <Text style={styles.exerciseDescription}>{step.exercise.description}</Text>
            <Text style={styles.setLabel}>
              Set {step.setNumber} / {step.totalSetsForEntry}
            </Text>
            <Text style={styles.target}>{targetDescription(step.entry)}</Text>
          </View>
        )}

        {!resting ? (
          <GlassPanel glow="neon" style={styles.actionPanel}>
            <GlowButton
              label={isLastStep ? "Finish Quest" : "Complete Set"}
              variant={isLastStep ? "gold" : "neon"}
              size="lg"
              onPress={handleCompleteSet}
            />
          </GlassPanel>
        ) : null}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 32, justifyContent: "space-between" },
  centerBlock: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  exerciseName: { fontFamily: fonts.display, fontSize: 24, color: colors.white, textAlign: "center" },
  exerciseDescription: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, textAlign: "center", paddingHorizontal: 12, lineHeight: 19 },
  setLabel: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.neon[300], marginTop: 8 },
  target: { fontFamily: fonts.display, fontSize: 32, color: colors.white },
  upNext: { fontFamily: fonts.body, fontSize: 12, color: colors.slate, marginTop: 8 },
  upNextName: { fontFamily: fonts.bodySemibold, fontSize: 16, color: colors.white, marginBottom: 8 },
  actionPanel: { padding: 16 },
});
