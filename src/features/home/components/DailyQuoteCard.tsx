import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/design-system/theme";
import { quoteForDate } from "../data/quotes";

export function DailyQuoteCard() {
  const quote = useMemo(() => quoteForDate(), []);
  return (
    <View style={styles.wrapper}>
      <View style={styles.rule} />
      <Text style={styles.quote}>"{quote}"</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 32, marginTop: 20, alignItems: "center", gap: 10 },
  rule: { width: 40, height: 2, backgroundColor: colors.arcane[300], borderRadius: 1, opacity: 0.6 },
  quote: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.slate,
    textAlign: "center",
    lineHeight: 20,
    fontStyle: "italic",
  },
});
