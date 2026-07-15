import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { colors, radii } from "../theme";

type Props = ViewProps & {
  glow?: "neon" | "arcane" | "gold" | "danger" | "none";
  intensity?: number;
};

const GLOW_COLOR: Record<NonNullable<Props["glow"]>, string | null> = {
  neon: colors.neon[300],
  arcane: colors.arcane[300],
  gold: colors.gold[300],
  danger: colors.danger[400],
  none: null,
};

/** The base "panel" surface used for cards, HUD readouts, and sheets. */
export function GlassPanel({ children, style, glow = "neon", intensity = 32, ...rest }: Props) {
  const glowColor = GLOW_COLOR[glow];

  return (
    <View
      style={[
        styles.wrapper,
        glowColor
          ? {
              shadowColor: glowColor,
              borderColor: `${glowColor}55`,
            }
          : { borderColor: "rgba(255,255,255,0.08)" },
        style,
      ]}
      {...rest}
    >
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.tintOverlay} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radii.lg,
    borderWidth: 1,
    overflow: "hidden",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },
  tintOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(8, 11, 28, 0.35)",
  },
  content: {
    position: "relative",
  },
});
