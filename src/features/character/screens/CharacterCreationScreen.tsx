import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlowButton } from "@/design-system/components";
import { colors, fonts, radii } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { useCharacterStore } from "../store/characterStore";
import { defaultAppearance } from "../data/appearanceOptions";
import { CharacterEditorForm } from "../components/CharacterEditorForm";
import type { CharacterAppearance } from "../types";

type Props = NativeStackScreenProps<AdventureStackParamList, "CharacterCreation">;

export function CharacterCreationScreen({ navigation }: Props) {
  const createCharacter = useCharacterStore((s) => s.createCharacter);
  const [name, setName] = useState("");
  const [appearance, setAppearance] = useState<CharacterAppearance>(defaultAppearance());

  const handlePatch = (patch: Partial<CharacterAppearance>) => setAppearance((prev) => ({ ...prev, ...patch }));

  const handleConfirm = () => {
    createCharacter(name.trim() || "Hunter", appearance);
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

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Character name"
            placeholderTextColor={colors.slate}
            style={styles.input}
            maxLength={24}
          />

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
  },
  confirmButton: { marginTop: 12 },
});
