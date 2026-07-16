import React, { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlowButton, Chip } from "@/design-system/components";
import { colors, fonts, radii } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import type { OnboardingStackParamList } from "@/app/navigation/types";
import type { FitnessGoal, FitnessLevel, Gender, HunterProfile } from "@/features/player/types";
import { useClassStore } from "@/features/classes/store/classStore";
import type { ClassArchetypeId } from "@/features/classes/types";
import { getAvatarOptions, avatarOptions } from "../data/avatars";
import { fitnessLevelOptions, goalOptions } from "../data/options";
import { requestNotificationPermission, scheduleDailyGateReminder } from "@/features/notifications/engine/notificationScheduler";

type Props = NativeStackScreenProps<OnboardingStackParamList, "HunterCreation">;

const TOTAL_STEPS = 5;
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "unspecified", label: "Prefer not to say" },
];

export function HunterCreationScreen({ navigation }: Props) {
  const createHunter = usePlayerStore((s) => s.createHunter);
  const initClassForArchetype = useClassStore((s) => s.initForArchetype);

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState(avatarOptions[0].id);
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const [gender, setGender] = useState<Gender>("unspecified");
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>("beginner");
  const [goals, setGoals] = useState<FitnessGoal[]>([]);

  const availableAvatars = useMemo(() => getAvatarOptions(name), [name]);

  // The secret Monarch path only stays selectable while the typed name is "Wissem" —
  // fall back to the first path if the name is edited away after picking it.
  useEffect(() => {
    if (avatarId === "monarch" && !availableAvatars.some((a) => a.id === "monarch")) {
      setAvatarId(avatarOptions[0].id);
    }
  }, [avatarId, availableAvatars]);

  const toggleGoal = (goal: FitnessGoal) => {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  };

  const canProceed = [
    name.trim().length > 0,
    Boolean(avatarId),
    Number(heightCm) > 0 && Number(weightKg) > 0,
    Boolean(fitnessLevel),
    goals.length > 0,
  ][step];

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
      return;
    }
    const profile: HunterProfile = {
      id: `hunter-${Date.now()}`,
      name: name.trim(),
      avatarId,
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
      gender,
      fitnessLevel,
      goals,
      createdAt: new Date().toISOString(),
    };
    createHunter(profile);
    initClassForArchetype(avatarId as ClassArchetypeId);

    requestNotificationPermission()
      .then((granted) => {
        if (granted) return scheduleDailyGateReminder();
      })
      .catch(() => {});
  };

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <View style={styles.header}>
          {step > 0 ? (
            <Pressable onPress={() => setStep((s) => s - 1)} hitSlop={12}>
              <Ionicons name="chevron-back" size={22} color={colors.slate} />
            </Pressable>
          ) : (
            <View style={{ width: 22 }} />
          )}
          <View style={styles.dotsRow}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
            ))}
          </View>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.content}>
          {step === 0 && (
            <StepShell title="What should we call you, hunter?" subtitle="This is how the system will address you.">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={colors.slate}
                style={styles.input}
                maxLength={24}
                autoFocus
              />
            </StepShell>
          )}

          {step === 1 && (
            <StepShell title="Choose your starting class" subtitle="Every path grows into a full evolution tree — train differently, evolve differently.">
              <View style={styles.avatarGrid}>
                {availableAvatars.map((a) => {
                  const active = a.id === avatarId;
                  const legendary = a.id === "monarch";
                  return (
                    <Pressable key={a.id} onPress={() => setAvatarId(a.id)} style={styles.avatarCell}>
                      <View
                        style={[
                          styles.avatarIconWrap,
                          { borderColor: active ? a.color : "rgba(255,255,255,0.12)" },
                          active && { backgroundColor: `${a.color}22` },
                        ]}
                      >
                        <Ionicons name={a.icon} size={26} color={a.color} />
                      </View>
                      <Text style={[styles.avatarLabel, active && { color: colors.white }]}>{a.className}</Text>
                      <Text style={[styles.avatarPath, legendary && { color: a.color }]}>{a.pathLabel}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell title="Tell us about your body" subtitle="Used to personalize workout intensity and calorie estimates.">
              <View style={styles.rowGap}>
                <NumberField label="Height (cm)" value={heightCm} onChangeText={setHeightCm} />
                <NumberField label="Weight (kg)" value={weightKg} onChangeText={setWeightKg} />
                <View style={styles.pillRow}>
                  {GENDER_OPTIONS.map((g) => (
                    <Pressable
                      key={g.value}
                      onPress={() => setGender(g.value)}
                      style={[styles.pill, gender === g.value && styles.pillActive]}
                    >
                      <Text style={[styles.pillLabel, gender === g.value && styles.pillLabelActive]}>{g.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell title="What's your current fitness level?" subtitle="We'll calibrate your first quests to match.">
              <View style={styles.rowGap}>
                {fitnessLevelOptions.map((f) => (
                  <Pressable
                    key={f.value}
                    onPress={() => setFitnessLevel(f.value)}
                    style={[styles.optionCard, fitnessLevel === f.value && styles.optionCardActive]}
                  >
                    <Text style={styles.optionTitle}>{f.label}</Text>
                    <Text style={styles.optionDescription}>{f.description}</Text>
                  </Pressable>
                ))}
              </View>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell title="What are you training for?" subtitle="Pick as many as apply — this shapes your quest line.">
              <View style={styles.goalGrid}>
                {goalOptions.map((g) => {
                  const active = goals.includes(g.value);
                  return (
                    <Pressable
                      key={g.value}
                      onPress={() => toggleGoal(g.value)}
                      style={[styles.optionCard, styles.goalCard, active && styles.optionCardActive]}
                    >
                      <Text style={styles.optionTitle}>{g.label}</Text>
                      <Text style={styles.optionDescription}>{g.description}</Text>
                      {active && <Chip label="Selected" tier="rare" />}
                    </Pressable>
                  );
                })}
              </View>
            </StepShell>
          )}
        </View>

        <View style={styles.footer}>
          <GlowButton
            label={step === TOTAL_STEPS - 1 ? "Begin the Ascent" : "Continue"}
            variant="arcane"
            size="lg"
            disabled={!canProceed}
            onPress={handleNext}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <View style={styles.stepShell}>
      <Text style={styles.stepTitle}>{title}</Text>
      <Text style={styles.stepSubtitle}>{subtitle}</Text>
      <View style={styles.stepBody}>{children}</View>
    </View>
  );
}

function NumberField({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
}) {
  return (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={(t) => onChangeText(t.replace(/[^0-9]/g, ""))}
        keyboardType="number-pad"
        style={styles.input}
        placeholderTextColor={colors.slate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8 },
  dotsRow: { flexDirection: "row", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.15)" },
  dotActive: { backgroundColor: colors.arcane[300], width: 18 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  stepShell: { gap: 8 },
  stepTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.white, lineHeight: 27 },
  stepSubtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, lineHeight: 19, marginBottom: 12 },
  stepBody: { marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.white,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    marginBottom: 14,
  },
  rowGap: { gap: 12 },
  fieldLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate, marginBottom: 6 },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
  },
  pillActive: { borderColor: colors.arcane[300], backgroundColor: "rgba(157,78,255,0.16)" },
  pillLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate },
  pillLabelActive: { color: colors.arcane[100] },
  avatarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 20, justifyContent: "center", marginTop: 8 },
  avatarCell: { alignItems: "center", gap: 6, width: 104 },
  avatarIconWrap: { width: 68, height: 68, borderRadius: 34, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  avatarLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate },
  avatarPath: { fontFamily: fonts.body, fontSize: 10, color: colors.slate, textAlign: "center" },
  optionCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: radii.md,
    padding: 14,
    gap: 4,
  },
  optionCardActive: { borderColor: colors.arcane[300], backgroundColor: "rgba(157,78,255,0.12)" },
  optionTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  optionDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  goalGrid: { gap: 10 },
  goalCard: { flexDirection: "column" },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 12 },
});
