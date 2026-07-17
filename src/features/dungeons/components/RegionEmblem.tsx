import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Line, Path, Polygon, RadialGradient, Rect, Stop } from "react-native-svg";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors } from "@/design-system/theme";
import type { RegionTheme } from "../types";

type Props = {
  theme: RegionTheme;
  size?: number;
  locked?: boolean;
  animated?: boolean;
};

const THEME_COLOR: Record<RegionTheme, string> = {
  forest: colors.toxic[400],
  mountains: colors.slate,
  desert: colors.gold[300],
  ruins: colors.arcane[400],
  city: colors.neon[300],
  marsh: colors.toxic[500],
  frozen_lands: colors.neon[100],
  volcano: colors.danger[400],
};

/**
 * Original per-region motif — a small procedural SVG icon (not a licensed
 * map/photo) matching the GateEmblem/MonsterSprite art direction, so each
 * region on the World Map has its own visual identity instead of a single
 * generic Ionicons glyph.
 */
export function RegionEmblem({ theme, size = 40, locked = false, animated = true }: Props) {
  const color = locked ? colors.slate : THEME_COLOR[theme];
  const w = 100;
  const h = 100;

  const drift = useSharedValue(0);
  useEffect(() => {
    if (!animated || locked) return;
    drift.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [animated, locked, drift]);
  const driftStyle = useAnimatedStyle(() => ({ transform: [{ translateY: -drift.value * 2 }] }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id={`regionGlow-${theme}`} cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={color} stopOpacity={0.32} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#regionGlow-${theme})`} />
      </Svg>
      <Animated.View style={[StyleSheet.absoluteFill, driftStyle]}>
        <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`}>
          <ThemeMotif theme={theme} color={color} w={w} h={h} />
        </Svg>
      </Animated.View>
      {locked ? (
        <Svg width={size} height={size} style={StyleSheet.absoluteFill} viewBox={`0 0 ${w} ${h}`}>
          <Circle cx={w * 0.72} cy={h * 0.28} r={w * 0.12} fill={colors.void[200]} stroke={colors.slate} strokeWidth={2} />
          <Rect x={w * 0.66} y={h * 0.26} width={w * 0.12} height={w * 0.1} rx={2} fill={colors.void[200]} stroke={colors.slate} strokeWidth={2} />
        </Svg>
      ) : null}
    </View>
  );
}

function ThemeMotif({ theme, color, w, h }: { theme: RegionTheme; color: string; w: number; h: number }) {
  switch (theme) {
    case "forest":
      return (
        <>
          <Polygon points={`${w * 0.3},${h * 0.68} ${w * 0.18},${h * 0.3} ${w * 0.42},${h * 0.3}`} fill={color} opacity={0.75} />
          <Polygon points={`${w * 0.62},${h * 0.72} ${w * 0.46},${h * 0.24} ${w * 0.78},${h * 0.24}`} fill={color} />
          <Rect x={w * 0.6} y={h * 0.7} width={w * 0.04} height={h * 0.12} fill={colors.abyss[300]} />
        </>
      );
    case "mountains":
      return (
        <>
          <Polygon points={`${w * 0.5},${h * 0.2} ${w * 0.2},${h * 0.75} ${w * 0.8},${h * 0.75}`} fill={color} />
          <Polygon points={`${w * 0.5},${h * 0.32} ${w * 0.36},${h * 0.55} ${w * 0.64},${h * 0.55}`} fill={colors.white} opacity={0.35} />
          <Polygon points={`${w * 0.78},${h * 0.4} ${w * 0.62},${h * 0.75} ${w * 0.94},${h * 0.75}`} fill={color} opacity={0.6} />
        </>
      );
    case "desert":
      return (
        <>
          <Circle cx={w * 0.72} cy={h * 0.28} r={w * 0.14} fill={color} />
          <Path d={`M ${w * 0.1} ${h * 0.68} Q ${w * 0.32} ${h * 0.52} ${w * 0.54} ${h * 0.68} Q ${w * 0.76} ${h * 0.84} ${w * 0.94} ${h * 0.68}`} stroke={color} strokeWidth={w * 0.05} fill="none" strokeLinecap="round" opacity={0.8} />
        </>
      );
    case "ruins":
      return (
        <>
          <Rect x={w * 0.28} y={h * 0.32} width={w * 0.14} height={h * 0.44} fill={color} opacity={0.85} />
          <Rect x={w * 0.58} y={h * 0.2} width={w * 0.14} height={h * 0.56} fill={color} />
          <Polygon points={`${w * 0.58},${h * 0.2} ${w * 0.72},${h * 0.2} ${w * 0.65},${h * 0.34}`} fill={colors.abyss[300]} />
          <Line x1={w * 0.2} y1={h * 0.78} x2={w * 0.85} y2={h * 0.78} stroke={color} strokeWidth={2} opacity={0.6} />
        </>
      );
    case "city":
      return (
        <>
          <Rect x={w * 0.2} y={h * 0.44} width={w * 0.14} height={h * 0.34} fill={color} opacity={0.7} />
          <Rect x={w * 0.38} y={h * 0.26} width={w * 0.16} height={h * 0.52} fill={color} />
          <Rect x={w * 0.58} y={h * 0.36} width={w * 0.14} height={h * 0.42} fill={color} opacity={0.85} />
          <Rect x={w * 0.76} y={h * 0.5} width={w * 0.1} height={h * 0.28} fill={color} opacity={0.6} />
        </>
      );
    case "marsh":
      return (
        <>
          <Path d={`M ${w * 0.12} ${h * 0.5} Q ${w * 0.3} ${h * 0.38} ${w * 0.48} ${h * 0.5} Q ${w * 0.66} ${h * 0.62} ${w * 0.88} ${h * 0.5}`} stroke={color} strokeWidth={w * 0.04} fill="none" strokeLinecap="round" />
          <Path d={`M ${w * 0.12} ${h * 0.66} Q ${w * 0.3} ${h * 0.54} ${w * 0.48} ${h * 0.66} Q ${w * 0.66} ${h * 0.78} ${w * 0.88} ${h * 0.66}`} stroke={color} strokeWidth={w * 0.04} fill="none" strokeLinecap="round" opacity={0.6} />
          <Line x1={w * 0.3} y1={h * 0.32} x2={w * 0.26} y2={h * 0.14} stroke={color} strokeWidth={2} />
          <Line x1={w * 0.7} y1={h * 0.34} x2={w * 0.75} y2={h * 0.16} stroke={color} strokeWidth={2} />
        </>
      );
    case "frozen_lands":
      return (
        <>
          {[0, 60, 120].map((deg) => (
            <Line
              key={deg}
              x1={w * 0.5}
              y1={h * 0.2}
              x2={w * 0.5}
              y2={h * 0.8}
              stroke={color}
              strokeWidth={w * 0.045}
              strokeLinecap="round"
              transform={`rotate(${deg} ${w * 0.5} ${h * 0.5})`}
            />
          ))}
        </>
      );
    case "volcano":
    default:
      return (
        <>
          <Polygon points={`${w * 0.5},${h * 0.22} ${w * 0.22},${h * 0.78} ${w * 0.78},${h * 0.78}`} fill={colors.abyss[200]} stroke={color} strokeWidth={1.5} />
          <Polygon points={`${w * 0.5},${h * 0.4} ${w * 0.4},${h * 0.6} ${w * 0.6},${h * 0.6}`} fill={color} />
          <Path d={`M ${w * 0.5} ${h * 0.2} Q ${w * 0.58} ${h * 0.08} ${w * 0.48} ${h * 0.02}`} stroke={color} strokeWidth={w * 0.025} fill="none" strokeLinecap="round" opacity={0.6} />
        </>
      );
  }
}
