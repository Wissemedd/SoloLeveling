import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Line, Polygon, RadialGradient, Stop } from "react-native-svg";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors } from "../theme";

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
  animated?: boolean;
};

function hexPoints(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 90);
      return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
    })
    .join(" ");
}

function tickLines(cx: number, cy: number, r: number, count: number) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = (Math.PI / 180) * ((360 / count) * i);
    return {
      key: i,
      x1: cx + Math.cos(angle) * (r - 5),
      y1: cy + Math.sin(angle) * (r - 5),
      x2: cx + Math.cos(angle) * (r + 5),
      y2: cy + Math.sin(angle) * (r + 5),
    };
  });
}

/**
 * Original decorative "Gate" motif — a rune-ringed portal evoking the app's
 * own dungeon-gate fiction (see bosses.ts). Built entirely from
 * react-native-svg primitives; no licensed artwork or character likenesses
 * are referenced or reproduced.
 */
export function GateEmblem({ size = 120, accent = "arcane", animated = true }: Props) {
  const color = ACCENT_COLOR[accent];
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.46;
  const innerR = size * 0.3;

  const outerSpin = useSharedValue(0);
  const innerSpin = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;
    outerSpin.value = withRepeat(withTiming(1, { duration: 42000, easing: Easing.linear }), -1, false);
    innerSpin.value = withRepeat(withTiming(1, { duration: 27000, easing: Easing.linear }), -1, false);
  }, [animated, outerSpin, innerSpin]);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${outerSpin.value * 360}deg` }],
  }));
  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-innerSpin.value * 360}deg` }],
  }));

  const ticks = tickLines(cx, cy, outerR - 6, 12);
  const gradientId = `gatePortalGlow-${accent}`;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={gradientId} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <Stop offset="70%" stopColor={color} stopOpacity={0.05} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={cx} cy={cy} r={outerR} fill={`url(#${gradientId})`} />
      </Svg>

      <Animated.View style={[StyleSheet.absoluteFill, outerStyle]}>
        <Svg width={size} height={size}>
          <Circle cx={cx} cy={cy} r={outerR} stroke={color} strokeWidth={1.4} strokeDasharray="2 9" fill="none" opacity={0.75} />
          {ticks.map((t) => (
            <Line key={t.key} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={color} strokeWidth={1.4} opacity={0.55} />
          ))}
        </Svg>
      </Animated.View>

      <Animated.View style={[StyleSheet.absoluteFill, innerStyle]}>
        <Svg width={size} height={size}>
          <Polygon points={hexPoints(cx, cy, innerR)} stroke={color} strokeWidth={1.2} fill="none" opacity={0.55} />
        </Svg>
      </Animated.View>

      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={cx} cy={cy} r={innerR * 0.4} stroke={color} strokeWidth={1} fill="rgba(5,6,10,0.55)" opacity={0.9} />
      </Svg>
    </View>
  );
}
