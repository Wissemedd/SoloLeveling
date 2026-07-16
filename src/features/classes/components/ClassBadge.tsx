import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, rankColors } from "@/design-system/theme";
import type { ClassNode } from "../types";

type Props = {
  node: ClassNode;
  size?: number;
  showTagline?: boolean;
};

/** Icon + name readout for the hunter's current class, tinted by its rank tier. */
export function ClassBadge({ node, size = 56, showTagline = false }: Props) {
  const color = rankColors[node.rank];

  return (
    <View style={styles.row}>
      <View
        style={[
          styles.iconWrap,
          { width: size, height: size, borderRadius: size / 2, borderColor: color, shadowColor: color },
        ]}
      >
        <Ionicons name={node.icon} size={size * 0.46} color={color} />
      </View>
      <View style={styles.textCol}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{node.name}</Text>
          <View style={[styles.rankChip, { borderColor: color }]}>
            <Text style={[styles.rankChipText, { color }]}>{node.rank}</Text>
          </View>
        </View>
        {showTagline ? <Text style={styles.tagline}>{node.tagline}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(10,12,22,0.65)",
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  textCol: { flex: 1, gap: 2 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  rankChip: { borderWidth: 1, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 },
  rankChipText: { fontFamily: fonts.bodyBold, fontSize: 10 },
  tagline: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
});
