import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../theme";
import { GlassPanel } from "./GlassPanel";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  hint?: string;
  onPress?: () => void;
  iconColor?: string;
};

/** A tappable settings/navigation row — icon, label, optional trailing hint, chevron. */
export function MenuRow({ icon, label, hint, onPress, iconColor = colors.slate }: Props) {
  const row = (
    <GlassPanel glow="none" style={styles.row}>
      <Ionicons name={icon} size={18} color={iconColor} />
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.slate} />
    </GlassPanel>
  );
  return onPress ? <Pressable onPress={onPress}>{row}</Pressable> : row;
}

const styles = StyleSheet.create({
  // No marginBottom here — screens space consecutive rows via their own
  // container `gap`, so this only handles the row's internal layout.
  row: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.white, flex: 1 },
  hint: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
