import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useCharacterStore } from "../store/characterStore";
import { defaultAppearance } from "../data/appearanceOptions";
import { CharacterEditorForm } from "../components/CharacterEditorForm";
import type { CharacterAppearance } from "../types";

type Props = NativeStackScreenProps<AdventureStackParamList, "CharacterCreation">;

export function CharacterCreationScreen({ navigation }: Props) {
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const profileName = usePlayerStore((s) => s.profile?.name);
  const [appearance, setAppearance] = useState<CharacterAppearance>(defaultAppearance());

  const handlePatch = (patch: Partial<CharacterAppearance>) => setAppearance((prev) => ({ ...prev, ...patch }));

  const handleConfirm = () => {
    createCharacter(profileName?.trim() || "Hunter", appearance);
    navigation.replace("Hub");
  };

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Forge your Hunter</Text>
          <Text style={styles.subtitle}>
            Your look is yours to shape. Your power, however, is earned only in the real world — combat here never grants XP or
            stats.
          </Text>

          <CharacterEditorForm appearance={appearance} onChange={handlePatch} />

          <GlowButton label="Confirm Hunter" variant="arcane" size="lg" onPress={handleConfirm} style={styles.confirmButton} />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48, gap: 14 },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.white },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, lineHeight: 19, marginBottom: 8 },
  confirmButton: { marginTop: 12 },
});
