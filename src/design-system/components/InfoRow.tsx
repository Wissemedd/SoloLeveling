import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../theme";

type Props = {
  label: string;
  value?: string;
  /** When provided, shows a met/unmet indicator icon and highlights the label — the "requirement checklist" look. */
  met?: boolean;
};

/** A label + value line. Pass `met` for a requirement-checklist row instead of a plain label/value pair. */
export function InfoRow({ label, value, met }: Props) {
  const hasIndicator = met !== undefined;
  return (
    <View style={[styles.row, !hasIndicator && styles.rowSpaced]}>
      {hasIndicator ? (
        <Ionicons name={met ? "checkmark-circle" : "ellipse-outline"} size={14} color={met ? colors.neon[300] : colors.slate} />
      ) : null}
      <Text style={[styles.label, hasIndicator && styles.labelFlex, met && styles.labelMet]}>{label}</Text>
      {value ? <Text style={hasIndicator ? styles.detail : styles.value}>{value}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowSpaced: { justifyContent: "space-between" },
  label: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  labelFlex: { flex: 1 },
  labelMet: { color: colors.white },
  value: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.white },
  detail: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.slate },
});
