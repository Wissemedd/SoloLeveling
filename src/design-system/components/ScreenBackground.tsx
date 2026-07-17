import React, { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { colors } from "../theme";
import { ParticleField } from "./ParticleField";

type Props = {
  children: React.ReactNode;
  /** Tint the ambient glow orbs to match the screen's mood. */
  accent?: "neon" | "arcane" | "gold" | "danger";
  particles?: boolean;
};

const ACCENT_GLOW: Record<NonNullable<Props["accent"]>, string> = {
  neon: colors.neon[400],
  arcane: colors.arcane[400],
  gold: colors.gold[300],
  danger: colors.danger[400],
};

/**
 * The base backdrop for every screen: deep-black gradient, two soft ambient
 * glow orbs, and an optional drifting particle layer. Screens lay their
 * content on top of this rather than a plain background color.
 */
export function ScreenBackground({ children, accent = "neon", particles = true }: Props) {
  const glowColor = ACCENT_GLOW[accent];
  // The bottom tab bar floats (position: absolute) over every screen in its
  // stack, however deeply pushed — reserve its height here, once, so no
  // screen's trailing content/buttons render underneath it. Resolves to 0
  // outside a tab navigator (onboarding), where there's no bar to clear.
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.void[300], colors.abyss[500], colors.void[200]]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.orb, styles.orbTop, { backgroundColor: glowColor }]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbBottom, { backgroundColor: colors.arcane[500] }]} />
      {particles ? <ParticleField density={18} /> : null}
      <View style={[styles.content, { paddingBottom: tabBarHeight }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.void.DEFAULT,
  },
  content: {
    flex: 1,
  },
  orb: {
    position: "absolute",
    width: 340,
    height: 340,
    borderRadius: 340,
    opacity: 0.22,
  },
  orbTop: {
    top: -120,
    right: -100,
  },
  orbBottom: {
    bottom: -140,
    left: -120,
    opacity: 0.16,
  },
});
