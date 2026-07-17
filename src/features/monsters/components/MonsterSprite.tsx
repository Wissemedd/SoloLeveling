import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from "react-native-svg";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
import { colors, rankColors } from "@/design-system/theme";
import type { CombatVisualState } from "@/design-system/combatVisuals";
import type { ElementalAffinity, MonsterDefinition, MonsterFamily } from "../types";

type Props = {
  monster: Pick<MonsterDefinition, "id" | "family" | "affinity" | "rank" | "isBoss">;
  /** Fixed container footprint — rank/isBoss affect internal fill/aura, never this box. */
  size?: number;
  animated?: boolean;
  facing?: "left" | "right";
  combatState?: CombatVisualState;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RANK_ORDER = Object.keys(rankColors) as (keyof typeof rankColors)[];

const FAMILY_NEUTRAL_TINT: Record<MonsterFamily, string> = {
  beast: colors.gold[500],
  undead: colors.slate,
  demon: colors.danger[500],
  elemental: colors.arcane[300],
  construct: colors.slate,
  spirit: colors.neon[100],
  humanoid: colors.slate,
  dragon: colors.gold[400],
};

const AFFINITY_TINT: Partial<Record<ElementalAffinity, string>> = {
  fire: colors.danger[400],
  frost: colors.neon[200],
  shadow: colors.arcane[500],
  light: colors.gold[100],
  poison: colors.toxic[400],
  storm: colors.neon[300],
};

/** Simple deterministic string hash so two monsters sharing family/affinity/rank still look slightly different. */
function seedFor(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Original procedural creature silhouette — every monster is drawn from its
 * own data (family/affinity/rank), not a fixed art asset, the same
 * philosophy as AvatarSilhouette/GateEmblem. This is what lets hundreds of
 * procedurally-generated monsters (see monsterGenerator.ts) all get a
 * visual without anyone hand-drawing hundreds of sprites.
 */
export function MonsterSprite({ monster, size = 180, animated = true, facing = "right", combatState }: Props) {
  const { family, affinity, rank, isBoss } = monster;
  const tint = affinity !== "none" ? (AFFINITY_TINT[affinity] ?? FAMILY_NEUTRAL_TINT[family]) : FAMILY_NEUTRAL_TINT[family];
  const glowColor = rankColors[rank];
  const seed = seedFor(monster.id);
  const prestige = RANK_ORDER.length > 1 ? RANK_ORDER.indexOf(rank) / (RANK_ORDER.length - 1) : 0;

  const w = 140;
  const h = 140;
  const bodyScale = 0.82 + prestige * 0.22 + (isBoss ? 0.14 : 0);
  const auraRx = w * (0.3 + prestige * 0.1 + (isBoss ? 0.08 : 0));
  const auraOpacity = 0.16 + prestige * 0.3 + (isBoss ? 0.12 : 0);

  const flash = useSharedValue(0);
  const combatX = useSharedValue(0);
  const combatY = useSharedValue(0);
  const combatRotate = useSharedValue(0);
  const combatScale = useSharedValue(1);
  const combatOpacity = useSharedValue(1);

  useEffect(() => {
    if (!combatState) return;
    switch (combatState.phase) {
      case "attack":
        combatX.value = withSequence(withTiming(-18, { duration: 150 }), withTiming(0, { duration: 220 }));
        break;
      case "hit":
        combatX.value = withSequence(withTiming(8, { duration: 40 }), withTiming(-8, { duration: 60 }), withTiming(0, { duration: 80 }));
        flash.value = withSequence(withTiming(1, { duration: 60 }), withTiming(0, { duration: 220 }));
        break;
      case "crit-hit":
        combatX.value = withSequence(
          withTiming(14, { duration: 40 }),
          withTiming(-14, { duration: 60 }),
          withTiming(6, { duration: 60 }),
          withTiming(0, { duration: 100 }),
        );
        flash.value = withSequence(withTiming(1, { duration: 70 }), withTiming(0, { duration: 280 }));
        break;
      case "dodge":
        combatX.value = withSequence(withTiming(22, { duration: 160 }), withTiming(0, { duration: 220 }));
        break;
      case "cast":
        combatScale.value = withSequence(withTiming(1.06, { duration: 180 }), withTiming(1, { duration: 260 }));
        break;
      case "victory":
        combatY.value = withSequence(withTiming(-10, { duration: 180 }), withTiming(0, { duration: 220 }));
        break;
      case "defeat":
        combatY.value = withTiming(36, { duration: 500, easing: Easing.in(Easing.quad) });
        combatOpacity.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) });
        break;
      case "idle":
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatState?.nonce]);

  const idle = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    idle.value = withRepeat(withTiming(1, { duration: 1900, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [animated, idle]);
  const idleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -idle.value * 3 }],
  }));

  const combatStyle = useAnimatedStyle(() => ({
    opacity: combatOpacity.value,
    transform: [
      { translateX: combatX.value },
      { translateY: combatY.value },
      { rotate: `${combatRotate.value}deg` },
      { scale: combatScale.value },
    ],
  }));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "flex-end" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} style={StyleSheet.absoluteFill}>
        <Ellipse cx={w / 2} cy={h * 0.9} rx={auraRx} ry={h * 0.05} fill={glowColor} opacity={auraOpacity} />
      </Svg>

      {isBoss ? <BossRuneRing size={size} color={glowColor} animated={animated} /> : null}

      <Animated.View style={[{ transform: [{ scaleX: facing === "left" ? -1 : 1 }, { scale: bodyScale }] }, combatStyle]}>
        <Animated.View style={idleStyle}>
          <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`}>
            <FamilyBody family={family} tint={tint} seed={seed} w={w} h={h} flash={flash} />
            <AffinityMotif affinity={affinity} tint={tint} seed={seed} w={w} h={h} animated={animated} />
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function BossRuneRing({ size, color, animated }: { size: number; color: string; animated: boolean }) {
  const spin = useSharedValue(0);
  useEffect(() => {
    if (!animated) return;
    spin.value = withRepeat(withTiming(1, { duration: 34000, easing: Easing.linear }), -1, false);
  }, [animated, spin]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Svg width={size} height={size} viewBox="0 0 140 140">
        <Circle cx={70} cy={70} r={62} stroke={color} strokeWidth={1.4} strokeDasharray="3 10" fill="none" opacity={0.6} />
      </Svg>
    </Animated.View>
  );
}

function FamilyBody({
  family,
  tint,
  seed,
  w,
  h,
  flash,
}: {
  family: MonsterFamily;
  tint: string;
  seed: number;
  w: number;
  h: number;
  flash: SharedValue<number>;
}) {
  const bodyAnimatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(flash.value, [0, 1], [tint, colors.white]),
  }));
  const jitter = (seed % 10) / 10 - 0.5; // -0.5..0.5, deterministic per monster id

  switch (family) {
    case "beast":
      return (
        <>
          <Rect x={w * 0.24} y={h * 0.68} width={w * 0.07} height={h * 0.18} rx={3} fill={tint} opacity={0.85} />
          <Rect x={w * 0.38} y={h * 0.68} width={w * 0.07} height={h * 0.18} rx={3} fill={tint} opacity={0.85} />
          <Rect x={w * 0.55} y={h * 0.68} width={w * 0.07} height={h * 0.18} rx={3} fill={tint} opacity={0.85} />
          <Rect x={w * 0.69} y={h * 0.68} width={w * 0.07} height={h * 0.18} rx={3} fill={tint} opacity={0.85} />
          <Path
            d={`M ${w * 0.16} ${h * 0.58} Q ${w * 0.06} ${h * 0.5 + jitter * 10} ${w * 0.12} ${h * 0.4}`}
            stroke={tint}
            strokeWidth={w * 0.035}
            fill="none"
            strokeLinecap="round"
          />
          <AnimatedEllipse cx={w * 0.46} cy={h * 0.58} rx={w * 0.32} ry={h * 0.17} animatedProps={bodyAnimatedProps} />
          <Circle cx={w * 0.76} cy={h * 0.44} r={w * 0.14} fill={tint} />
          <Polygon points={`${w * 0.68},${h * 0.32} ${w * 0.72},${h * 0.2} ${w * 0.76},${h * 0.32}`} fill={tint} />
          <Polygon points={`${w * 0.8},${h * 0.32} ${w * 0.84},${h * 0.2} ${w * 0.88},${h * 0.32}`} fill={tint} />
        </>
      );

    case "undead":
      return (
        <>
          <Path
            d={`M ${w * 0.38} ${h * 0.28} Q ${w * 0.5} ${h * 0.2} ${w * 0.62} ${h * 0.3} L ${w * 0.6} ${h * 0.62} Q ${w * 0.5} ${h * 0.7} ${w * 0.4} ${h * 0.62} Z`}
            stroke={colors.void[100]}
            strokeWidth={0.6}
          />
          <AnimatedPath
            d={`M ${w * 0.38} ${h * 0.28} Q ${w * 0.5} ${h * 0.2} ${w * 0.62} ${h * 0.3} L ${w * 0.6} ${h * 0.62} Q ${w * 0.5} ${h * 0.7} ${w * 0.4} ${h * 0.62} Z`}
            animatedProps={bodyAnimatedProps}
          />
          <Line x1={w * 0.44} y1={h * 0.36} x2={w * 0.44} y2={h * 0.56} stroke={colors.void[100]} strokeWidth={0.8} opacity={0.5} />
          <Line x1={w * 0.5} y1={h * 0.34} x2={w * 0.5} y2={h * 0.58} stroke={colors.void[100]} strokeWidth={0.8} opacity={0.5} />
          <Line x1={w * 0.56} y1={h * 0.36} x2={w * 0.56} y2={h * 0.56} stroke={colors.void[100]} strokeWidth={0.8} opacity={0.5} />
          <Rect x={w * 0.24} y={h * 0.32} width={w * 0.09} height={h * 0.22} rx={4} fill={tint} transform={`rotate(12 ${w * 0.28} ${h * 0.4})`} />
          <Rect x={w * 0.67} y={h * 0.32} width={w * 0.09} height={h * 0.22} rx={4} fill={tint} transform={`rotate(-12 ${w * 0.72} ${h * 0.4})`} />
          <Circle cx={w * 0.5} cy={h * 0.2} r={w * 0.13} fill={tint} />
          <Circle cx={w * 0.45} cy={h * 0.19} r={w * 0.025} fill={colors.void[300]} />
          <Circle cx={w * 0.55} cy={h * 0.19} r={w * 0.025} fill={colors.void[300]} />
          <Polygon
            points={`${w * 0.4},${h * 0.6} ${w * 0.44},${h * 0.72} ${w * 0.48},${h * 0.6} ${w * 0.52},${h * 0.72} ${w * 0.56},${h * 0.6} ${w * 0.6},${h * 0.72}`}
            fill={tint}
            opacity={0.85}
          />
        </>
      );

    case "demon":
      return (
        <>
          <Path
            d={`M ${w * 0.32} ${h * 0.72} Q ${w * 0.5 + jitter * 6} ${h * 0.82} ${w * 0.68} ${h * 0.72}`}
            stroke={tint}
            strokeWidth={w * 0.03}
            fill="none"
            strokeLinecap="round"
          />
          <AnimatedPath
            d={`M ${w * 0.28} ${h * 0.32} Q ${w * 0.5} ${h * 0.24} ${w * 0.72} ${h * 0.32} L ${w * 0.64} ${h * 0.68} Q ${w * 0.5} ${h * 0.74} ${w * 0.36} ${h * 0.68} Z`}
            animatedProps={bodyAnimatedProps}
          />
          <Circle cx={w * 0.5} cy={h * 0.2} r={w * 0.14} fill={tint} />
          <Path d={`M ${w * 0.42} ${h * 0.12} Q ${w * 0.38} ${h * 0.02} ${w * 0.34} ${h * 0.06}`} stroke={tint} strokeWidth={w * 0.025} fill="none" strokeLinecap="round" />
          <Path d={`M ${w * 0.58} ${h * 0.12} Q ${w * 0.62} ${h * 0.02} ${w * 0.66} ${h * 0.06}`} stroke={tint} strokeWidth={w * 0.025} fill="none" strokeLinecap="round" />
          <Polygon points={`${w * 0.28},${h * 0.86} ${w * 0.33},${h * 0.94} ${w * 0.38},${h * 0.86}`} fill={tint} />
          <Polygon points={`${w * 0.62},${h * 0.86} ${w * 0.67},${h * 0.94} ${w * 0.72},${h * 0.86}`} fill={tint} />
        </>
      );

    case "elemental":
      return (
        <>
          {[0, 1, 2, 3].map((i) => {
            const angle = (Math.PI / 2) * i + seed * 0.01;
            const cx = w * 0.5 + Math.cos(angle) * w * 0.3;
            const cy = h * 0.5 + Math.sin(angle) * h * 0.3;
            return (
              <Polygon
                key={i}
                points={`${cx},${cy - h * 0.05} ${cx + w * 0.04},${cy} ${cx},${cy + h * 0.05} ${cx - w * 0.04},${cy}`}
                fill={tint}
                opacity={0.7}
              />
            );
          })}
          <AnimatedCircle cx={w * 0.5} cy={h * 0.5} r={w * 0.22} animatedProps={bodyAnimatedProps} />
          <Circle cx={w * 0.5} cy={h * 0.5} r={w * 0.1} fill={colors.white} opacity={0.5} />
        </>
      );

    case "construct":
      return (
        <>
          <Rect x={w * 0.3} y={h * 0.66} width={w * 0.14} height={h * 0.2} fill={tint} />
          <Rect x={w * 0.56} y={h * 0.66} width={w * 0.14} height={h * 0.2} fill={tint} />
          <AnimatedRect x={w * 0.26} y={h * 0.28} width={w * 0.48} height={h * 0.4} rx={4} animatedProps={bodyAnimatedProps} />
          <Line x1={w * 0.26} y1={h * 0.48} x2={w * 0.74} y2={h * 0.48} stroke={colors.abyss[200]} strokeWidth={1} opacity={0.6} />
          <Circle cx={w * 0.3} cy={h * 0.32} r={w * 0.02} fill={colors.abyss[200]} />
          <Circle cx={w * 0.7} cy={h * 0.32} r={w * 0.02} fill={colors.abyss[200]} />
          <Circle cx={w * 0.3} cy={h * 0.64} r={w * 0.02} fill={colors.abyss[200]} />
          <Circle cx={w * 0.7} cy={h * 0.64} r={w * 0.02} fill={colors.abyss[200]} />
          <Rect x={w * 0.36} y={h * 0.14} width={w * 0.28} height={h * 0.16} rx={3} fill={tint} />
          <Rect x={w * 0.42} y={h * 0.19} width={w * 0.06} height={h * 0.06} fill={colors.white} opacity={0.9} />
          <Rect x={w * 0.52} y={h * 0.19} width={w * 0.06} height={h * 0.06} fill={colors.white} opacity={0.9} />
        </>
      );

    case "spirit":
      return (
        <>
          {[0, 1, 2].map((i) => (
            <Path
              key={i}
              d={`M ${w * (0.4 + i * 0.1)} ${h * 0.62} Q ${w * (0.38 + i * 0.1 + jitter * 0.05)} ${h * 0.78} ${w * (0.4 + i * 0.1)} ${h * 0.92}`}
              stroke={tint}
              strokeWidth={w * 0.02}
              fill="none"
              strokeLinecap="round"
              opacity={0.5}
            />
          ))}
          <AnimatedPath
            d={`M ${w * 0.36} ${h * 0.32} Q ${w * 0.5} ${h * 0.22} ${w * 0.64} ${h * 0.32} Q ${w * 0.6} ${h * 0.55} ${w * 0.5} ${h * 0.65} Q ${w * 0.4} ${h * 0.55} ${w * 0.36} ${h * 0.32} Z`}
            opacity={0.85}
            animatedProps={bodyAnimatedProps}
          />
          <Circle cx={w * 0.5} cy={h * 0.3} r={w * 0.06} fill={colors.white} opacity={0.6} />
        </>
      );

    case "humanoid":
      return (
        <>
          <Rect x={w * 0.24} y={h * 0.62} width={w * 0.1} height={h * 0.26} rx={4} fill={tint} />
          <Rect x={w * 0.42} y={h * 0.62} width={w * 0.1} height={h * 0.26} rx={4} fill={tint} />
          <Rect x={w * 0.16} y={h * 0.4} width={w * 0.09} height={h * 0.22} rx={5} fill={tint} opacity={0.85} />
          <Rect x={w * 0.51} y={h * 0.4} width={w * 0.09} height={h * 0.22} rx={5} fill={tint} opacity={0.85} />
          <AnimatedPath
            d={`M ${w * 0.24} ${h * 0.36} Q ${w * 0.38} ${h * 0.3} ${w * 0.52} ${h * 0.36} L ${w * 0.48} ${h * 0.64} Q ${w * 0.38} ${h * 0.68} ${w * 0.28} ${h * 0.64} Z`}
            animatedProps={bodyAnimatedProps}
          />
          <Circle cx={w * 0.38} cy={h * 0.22} r={w * 0.13} fill={tint} />
        </>
      );

    case "dragon":
    default:
      return (
        <>
          <Polygon
            points={`${w * 0.3},${h * 0.4} ${w * 0.06},${h * (0.22 + jitter * 0.05)} ${w * 0.22},${h * 0.5} ${w * 0.32},${h * 0.48}`}
            fill={tint}
            opacity={0.75}
          />
          <Polygon
            points={`${w * 0.68},${h * 0.4} ${w * 0.94},${h * (0.22 - jitter * 0.05)} ${w * 0.78},${h * 0.5} ${w * 0.68},${h * 0.48}`}
            fill={tint}
            opacity={0.75}
          />
          <Path
            d={`M ${w * 0.66} ${h * 0.72} Q ${w * 0.85} ${h * 0.8} ${w * 0.92} ${h * 0.68}`}
            stroke={tint}
            strokeWidth={w * 0.045}
            fill="none"
            strokeLinecap="round"
          />
          <Polygon points={`${w * 0.88},${h * 0.64} ${w * 0.96},${h * 0.62} ${w * 0.9},${h * 0.72}`} fill={tint} />
          <AnimatedEllipse cx={w * 0.46} cy={h * 0.56} rx={w * 0.26} ry={h * 0.2} animatedProps={bodyAnimatedProps} />
          <Circle cx={w * 0.68} cy={h * 0.38} r={w * 0.14} fill={tint} />
          <Polygon points={`${w * 0.62},${h * 0.26} ${w * 0.66},${h * 0.14} ${w * 0.7},${h * 0.26}`} fill={tint} />
        </>
      );
  }
}

function AffinityMotif({
  affinity,
  tint,
  seed,
  w,
  h,
  animated,
}: {
  affinity: ElementalAffinity;
  tint: string;
  seed: number;
  w: number;
  h: number;
  animated: boolean;
}) {
  const pulse = useSharedValue(0.6);
  useEffect(() => {
    if (!animated || affinity === "none") return;
    pulse.value = withRepeat(withTiming(1, { duration: affinity === "storm" ? 260 : 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [animated, affinity, pulse]);
  const pulseProps = useAnimatedProps(() => ({ opacity: 0.4 + pulse.value * 0.5 }));

  const offset = (seed % 7) - 3;

  switch (affinity) {
    case "fire":
      return (
        <>
          <AnimatedPath d={`M ${w * 0.3} ${h * 0.28} Q ${w * 0.26} ${h * 0.18} ${w * 0.32} ${h * 0.1}`} stroke={tint} strokeWidth={w * 0.025} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
          <AnimatedPath d={`M ${w * 0.7 + offset} ${h * 0.26} Q ${w * 0.75} ${h * 0.16} ${w * 0.69} ${h * 0.08}`} stroke={tint} strokeWidth={w * 0.025} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
        </>
      );
    case "frost":
      return (
        <>
          <Polygon points={`${w * 0.26},${h * 0.36} ${w * 0.3},${h * 0.28} ${w * 0.34},${h * 0.36}`} fill={tint} opacity={0.8} />
          <Polygon points={`${w * 0.66 + offset},${h * 0.36} ${w * 0.7},${h * 0.28} ${w * 0.74},${h * 0.36}`} fill={tint} opacity={0.8} />
        </>
      );
    case "shadow":
      return (
        <>
          <AnimatedPath d={`M ${w * 0.2} ${h * 0.5} Q ${w * 0.08} ${h * 0.56} ${w * 0.12} ${h * 0.68}`} stroke={tint} strokeWidth={w * 0.02} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
          <AnimatedPath d={`M ${w * 0.8} ${h * 0.5} Q ${w * 0.92} ${h * 0.56} ${w * 0.88} ${h * 0.68}`} stroke={tint} strokeWidth={w * 0.02} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
        </>
      );
    case "light":
      return (
        <>
          <Circle cx={w * 0.5} cy={h * 0.06} r={w * 0.02} fill={tint} />
          <Line x1={w * 0.5} y1={h * 0.02} x2={w * 0.5} y2={h * 0.1} stroke={tint} strokeWidth={1} opacity={0.7} />
          <Line x1={w * 0.44} y1={h * 0.04} x2={w * 0.44} y2={h * 0.1} stroke={tint} strokeWidth={1} opacity={0.5} transform={`rotate(-20 ${w * 0.44} ${h * 0.07})`} />
          <Line x1={w * 0.56} y1={h * 0.04} x2={w * 0.56} y2={h * 0.1} stroke={tint} strokeWidth={1} opacity={0.5} transform={`rotate(20 ${w * 0.56} ${h * 0.07})`} />
        </>
      );
    case "poison":
      return (
        <>
          <AnimatedPath d={`M ${w * 0.34} ${h * 0.7} Q ${w * 0.34} ${h * 0.78} ${w * 0.32} ${h * 0.84}`} stroke={tint} strokeWidth={w * 0.02} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
          <AnimatedPath d={`M ${w * 0.62 + offset} ${h * 0.7} Q ${w * 0.62} ${h * 0.78} ${w * 0.64} ${h * 0.84}`} stroke={tint} strokeWidth={w * 0.02} fill="none" strokeLinecap="round" animatedProps={pulseProps} />
        </>
      );
    case "storm":
      return (
        <AnimatedPath
          d={`M ${w * 0.46} ${h * 0.08} L ${w * 0.4} ${h * 0.18} L ${w * 0.46} ${h * 0.18} L ${w * 0.4} ${h * 0.3}`}
          stroke={tint}
          strokeWidth={w * 0.02}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          animatedProps={pulseProps}
        />
      );
    case "none":
    default:
      return null;
  }
}
