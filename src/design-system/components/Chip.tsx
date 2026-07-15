import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { fonts, radii, rarity, RarityTier } from "../theme";

type Props = {
  label: string;
  tier?: RarityTier;
};

/** Small pill used for tags, difficulty, and loot rarity. */
export function Chip({ label, tier = "common" }: Props) {
  const color = rarity[tier];
  return (
    <View style={[styles.wrapper, { borderColor: `${color}66`, backgroundColor: `${color}1A` }]}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  label: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
});
