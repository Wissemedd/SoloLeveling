import React from "react";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, fonts, radii } from "../theme";
import { playSound } from "@/features/sound/engine/soundManager";

type Variant = "neon" | "arcane" | "gold" | "danger" | "ghost";
type Size = "md" | "lg";

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
};

const VARIANT_STYLE: Record<Variant, { bg: string; border: string; text: string; glow: string }> = {
  neon: { bg: colors.neon[400], border: colors.neon[200], text: colors.void[300], glow: colors.neon[300] },
  arcane: { bg: colors.arcane[400], border: colors.arcane[200], text: colors.white, glow: colors.arcane[300] },
  gold: { bg: colors.gold[300], border: colors.gold[100], text: colors.void[300], glow: colors.gold[200] },
  danger: { bg: colors.danger[400], border: colors.danger[300], text: colors.white, glow: colors.danger[400] },
  ghost: { bg: "transparent", border: "rgba(255,255,255,0.16)", text: colors.white, glow: "transparent" },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Primary CTA across the app. Presses down with a spring + a haptic tick. */
export function GlowButton({
  label,
  onPress,
  variant = "neon",
  size = "md",
  disabled,
  style,
  icon,
}: Props) {
  const scale = useSharedValue(1);
  const palette = VARIANT_STYLE[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 90 });
  };
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 140 });
  };
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    playSound("button_tap");
    onPress?.();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.base,
        size === "lg" ? styles.lg : styles.md,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          shadowColor: palette.glow,
          opacity: disabled ? 0.45 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          { color: palette.text },
          size === "lg" ? styles.labelLg : styles.labelMd,
        ]}
      >
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: radii.md,
    borderWidth: 1.5,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  md: { paddingVertical: 12, paddingHorizontal: 20 },
  lg: { paddingVertical: 16, paddingHorizontal: 28 },
  label: { fontFamily: fonts.bodyBold, letterSpacing: 0.4 },
  labelMd: { fontSize: 14 },
  labelLg: { fontSize: 16 },
});
