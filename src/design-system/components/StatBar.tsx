import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { colors, fonts, radii } from "../theme";

type Props = {
  label: string;
  value: number;
  max: number;
  accent?: "neon" | "arcane" | "gold" | "danger";
  showValue?: boolean;
  height?: number;
};

const GRADIENTS: Record<NonNullable<Props["accent"]>, [string, string]> = {
  neon: [colors.neon[400], colors.neon[200]],
  arcane: [colors.arcane[500], colors.arcane[300]],
  gold: [colors.gold[400], colors.gold[200]],
  danger: [colors.danger[500], colors.danger[300]],
};

/** Animated horizontal gauge — shared by XP, RPG stats, and boss health. */
export function StatBar({ label, value, max, accent = "neon", showValue = true, height = 10 }: Props) {
  const pct = useSharedValue(0);
  const target = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;

  useEffect(() => {
    pct.value = withTiming(target, { duration: 700, easing: Easing.out(Easing.cubic) });
  }, [pct, target]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${pct.value * 100}%`,
  }));

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {showValue ? (
          <Text style={styles.value}>
            {value}/{max}
          </Text>
        ) : null}
      </View>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View style={[styles.fillClip, { borderRadius: height / 2 }, fillStyle]}>
          <LinearGradient
            colors={GRADIENTS[accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: "100%" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.slate,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  value: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: "rgba(245,247,255,0.7)",
  },
  track: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.06)",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  fillClip: {
    height: "100%",
    overflow: "hidden",
  },
});
