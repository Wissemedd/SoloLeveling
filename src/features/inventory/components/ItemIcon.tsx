import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts, radii } from "@/design-system/theme";
import { frameColorForItemRarity } from "../engine/rarityDisplay";
import type { ItemDefinition } from "../types";

type Props = {
  def: Pick<ItemDefinition, "category" | "rarity" | "icon">;
  size?: number;
  upgradeLevel?: number;
};

/**
 * A rarity-colored frame + backdrop glow around the item's existing Ionicons
 * glyph (same glow-behind-icon idiom as GateEmblem). Ionicons here is chrome
 * iconography, not "art" — reusing it keeps this piece small while still
 * giving every rarity tier its own distinct look via the frame color.
 */
export function ItemIcon({ def, size = 40, upgradeLevel }: Props) {
  const frameColor = frameColorForItemRarity(def.rarity);
  const gradientId = `itemGlow-${def.rarity}`;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={frameColor} stopOpacity={0.3} />
            <Stop offset="100%" stopColor={frameColor} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${gradientId})`} />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 1.5}
          stroke={frameColor}
          strokeWidth={1.4}
          fill="rgba(6,7,14,0.5)"
        />
      </Svg>
      <View style={styles.iconWrap}>
        <Ionicons name={def.icon} size={size * 0.5} color={frameColor} />
      </View>
      {upgradeLevel ? (
        <View style={[styles.badge, { borderColor: frameColor }]}>
          <Text style={styles.badgeLabel}>+{upgradeLevel}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    right: -4,
    bottom: -4,
    borderWidth: 1,
    borderRadius: radii.pill,
    backgroundColor: colors.void[200],
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  badgeLabel: { fontFamily: fonts.bodyBold, fontSize: 9, color: colors.white },
});
