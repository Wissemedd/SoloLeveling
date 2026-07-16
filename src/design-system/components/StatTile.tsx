import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../theme";

type Props = {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  valueColor?: string;
  style?: ViewStyle;
};

/** A small stat readout — value on top, label below, optional leading icon. Caller supplies any wrapping panel/sizing. */
export function StatTile({ label, value, icon, iconColor = colors.neon[300], valueColor = colors.white, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {icon ? <Ionicons name={icon} size={18} color={iconColor} /> : null}
      <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 4 },
  value: { fontFamily: fonts.display, fontSize: 16 },
  label: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
