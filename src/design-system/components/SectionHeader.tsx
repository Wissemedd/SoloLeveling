import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "../theme";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export function SectionHeader({ title, subtitle, action }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.accentBar} />
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  accentBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.neon[300],
    marginRight: 10,
    shadowColor: colors.neon[300],
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  textCol: { flex: 1 },
  title: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.white,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.slate,
    marginTop: 2,
  },
});
