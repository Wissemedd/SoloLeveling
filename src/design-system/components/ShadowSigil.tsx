import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import Animated, { Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors } from "../theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Accent = "neon" | "arcane" | "gold" | "danger";

const ACCENT_COLOR: Record<Accent, string> = {
  neon: colors.neon[300],
  arcane: colors.arcane[300],
  gold: colors.gold[300],
  danger: colors.danger[400],
};

type Props = {
  size?: number;
  accent?: Accent;
  pulse?: boolean;
};

/**
 * Original "shadow soldier" sigil — an abstract hooded silhouette with a
 * single glowing eye, used to mark high-tier achievements and rewards.
 * Purely geometric (no traced or referenced artwork).
 */
export function ShadowSigil({ size = 48, accent = "arcane", pulse = true }: Props) {
  const color = ACCENT_COLOR[accent];
  const glow = useSharedValue(0.4);

  useEffect(() => {
    if (!pulse) return;
    glow.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse, glow]);

  const eyeProps = useAnimatedProps(() => ({
    opacity: 0.4 + glow.value * 0.6,
  }));

  const w = size;
  const h = size;
  const body = `
    M ${w * 0.5} ${h * 0.06}
    C ${w * 0.22} ${h * 0.06} ${w * 0.16} ${h * 0.34} ${w * 0.2} ${h * 0.48}
    C ${w * 0.08} ${h * 0.6} ${w * 0.05} ${h * 0.86} ${w * 0.12} ${h * 0.97}
    C ${w * 0.28} ${h * 0.88} ${w * 0.72} ${h * 0.88} ${w * 0.88} ${h * 0.97}
    C ${w * 0.95} ${h * 0.86} ${w * 0.92} ${h * 0.6} ${w * 0.8} ${h * 0.48}
    C ${w * 0.84} ${h * 0.34} ${w * 0.78} ${h * 0.06} ${w * 0.5} ${h * 0.06}
    Z
  `;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Path d={body} fill="rgba(6,7,14,0.92)" stroke={color} strokeWidth={1.2} opacity={0.9} />
        <AnimatedCircle cx={w * 0.5} cy={h * 0.42} r={w * 0.045} fill={color} animatedProps={eyeProps} />
      </Svg>
    </View>
  );
}
