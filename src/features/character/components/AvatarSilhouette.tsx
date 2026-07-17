import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors, rankColors } from "@/design-system/theme";
import type { CombatVisualState } from "@/design-system/combatVisuals";
import type { HunterRank } from "@/features/player/types";
import type { EquipmentSlotId } from "@/features/inventory/types";
import { OUTFIT_OPTIONS, SKIN_TONE_OPTIONS } from "../data/appearanceOptions";
import type { CharacterAppearance } from "../types";

type Props = {
  appearance: CharacterAppearance;
  rank?: HunterRank;
  equippedSlots?: Partial<Record<EquipmentSlotId, boolean>>;
  size?: number;
  breathing?: boolean;
  /** Drives attack/hit/dodge/etc. reactions during animated combat. Omitted everywhere except CombatScreen. */
  combatState?: CombatVisualState;
};

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

/** Rank keys are declared low-to-high in theme/colors.ts — reused here as a 0..1 "prestige" scale for the rim-light glow. */
const RANK_ORDER = Object.keys(rankColors) as HunterRank[];

/**
 * Original layered-shape "shadow hunter" silhouette — flat geometric shapes
 * only, no illustrated/licensed art, in the same spirit as GateEmblem and
 * ShadowSigil. Hair/eyes/skin/outfit colors come straight from
 * CharacterAppearance; equipped gear swaps in extra geometric overlays.
 */
export function AvatarSilhouette({
  appearance,
  rank = "E",
  equippedSlots = {},
  size = 220,
  breathing = true,
  combatState,
}: Props) {
  const skin = SKIN_TONE_OPTIONS.find((s) => s.id === appearance.skinTone)?.hex ?? SKIN_TONE_OPTIONS[1].hex;
  const outfit = OUTFIT_OPTIONS.find((o) => o.id === appearance.outfitId)?.accentHex ?? OUTFIT_OPTIONS[0].accentHex;
  const glowColor = rankColors[rank];
  const prestige = RANK_ORDER.length > 1 ? RANK_ORDER.indexOf(rank) / (RANK_ORDER.length - 1) : 0;
  const rimOpacity = 0.12 + prestige * 0.55;

  const hasHelmet = !!equippedSlots.helmet;
  const hasArmor = !!equippedSlots.armor;
  const hasBoots = !!equippedSlots.boots;
  const hasWeapon = !!equippedSlots.weapon;
  const hasGloves = !!equippedSlots.gloves;
  const hasRing = !!equippedSlots.ring;
  const hasNecklace = !!equippedSlots.necklace;
  const torsoColor = hasArmor ? colors.slate : outfit;

  const w = 160;
  const h = 320;

  // Idle breathing.
  const breath = useSharedValue(0);
  useEffect(() => {
    if (!breathing) return;
    breath.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [breathing, breath]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: 1 + breath.value * 0.015 }, { translateY: -breath.value * 2 }],
  }));

  // Occasional blink.
  const blink = useSharedValue(0);
  useEffect(() => {
    if (!breathing) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const scheduleBlink = () => {
      timer = setTimeout(
        () => {
          if (cancelled) return;
          blink.value = withSequence(withTiming(1, { duration: 90 }), withTiming(0, { duration: 130 }));
          scheduleBlink();
        },
        2500 + Math.random() * 2500,
      );
    };
    scheduleBlink();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [breathing, blink]);

  const eyeRy = w * 0.018;
  const leftEyeProps = useAnimatedProps(() => ({ ry: eyeRy * (1 - blink.value * 0.88) }));
  const rightEyeProps = useAnimatedProps(() => ({ ry: eyeRy * (1 - blink.value * 0.88) }));

  // Weapon glint.
  const weaponGlint = useSharedValue(0.75);
  useEffect(() => {
    if (!hasWeapon) return;
    weaponGlint.value = withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0.6, { duration: 900 })), -1, true);
  }, [hasWeapon, weaponGlint]);
  const weaponAnimatedProps = useAnimatedProps(() => ({ opacity: weaponGlint.value }));

  // Combat reactions (attack lunge, hit shake/flash, dodge sidestep, cast pulse, victory/defeat pose).
  const combatX = useSharedValue(0);
  const combatY = useSharedValue(0);
  const combatRotate = useSharedValue(0);
  const combatScale = useSharedValue(1);
  const combatOpacity = useSharedValue(1);
  const flash = useSharedValue(0);
  const castGlow = useSharedValue(0);

  useEffect(() => {
    if (!combatState) return;
    switch (combatState.phase) {
      case "attack":
        combatX.value = withSequence(withTiming(18, { duration: 150 }), withTiming(0, { duration: 220 }));
        break;
      case "hit":
        combatX.value = withSequence(withTiming(-8, { duration: 40 }), withTiming(8, { duration: 60 }), withTiming(0, { duration: 80 }));
        flash.value = withSequence(withTiming(1, { duration: 60 }), withTiming(0, { duration: 220 }));
        break;
      case "crit-hit":
        combatX.value = withSequence(
          withTiming(-14, { duration: 40 }),
          withTiming(14, { duration: 60 }),
          withTiming(-6, { duration: 60 }),
          withTiming(0, { duration: 100 }),
        );
        flash.value = withSequence(withTiming(1, { duration: 70 }), withTiming(0, { duration: 280 }));
        break;
      case "dodge":
        combatX.value = withSequence(withTiming(-22, { duration: 160 }), withTiming(0, { duration: 220 }));
        break;
      case "cast":
        combatScale.value = withSequence(withTiming(1.05, { duration: 180 }), withTiming(1, { duration: 260 }));
        castGlow.value = withSequence(withTiming(1, { duration: 180 }), withTiming(0, { duration: 320 }));
        break;
      case "victory":
        combatY.value = withSequence(withTiming(-10, { duration: 180 }), withTiming(0, { duration: 220 }));
        break;
      case "defeat":
        // Classic Game Boy-era faint: sink straight down and fade out, no rotation.
        combatY.value = withTiming(36, { duration: 500, easing: Easing.in(Easing.quad) });
        combatOpacity.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) });
        break;
      case "idle":
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [combatState?.nonce]);

  const combatStyle = useAnimatedStyle(() => ({
    opacity: combatOpacity.value,
    transform: [
      { translateX: combatX.value },
      { translateY: combatY.value },
      { rotate: `${combatRotate.value}deg` },
      { scale: combatScale.value },
    ],
  }));

  const torsoAnimatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(flash.value, [0, 1], [torsoColor, colors.white]),
    strokeOpacity: rimOpacity + castGlow.value * 0.4,
  }));
  const headAnimatedProps = useAnimatedProps(() => ({
    fill: interpolateColor(flash.value, [0, 1], [skin, colors.white]),
    strokeOpacity: rimOpacity + castGlow.value * 0.4,
  }));

  return (
    <View style={{ width: size, height: size * (h / w), alignItems: "center" }}>
      <Svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`} style={StyleSheet.absoluteFill}>
        <Ellipse cx={w / 2} cy={h * 0.92} rx={w * 0.42} ry={h * 0.05} fill={glowColor} opacity={0.28} />
      </Svg>
      <Animated.View style={combatStyle}>
        <Animated.View style={breathStyle}>
          <Svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`}>
            <Defs>
              <LinearGradient id="avatarSheen" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.white} stopOpacity={0.22} />
                <Stop offset="1" stopColor={colors.white} stopOpacity={0} />
              </LinearGradient>
            </Defs>

            {/* legs */}
            <Rect x={w * 0.36} y={h * 0.62} width={w * 0.12} height={h * 0.3} rx={6} fill={hasBoots ? colors.void[100] : skin} />
            <Rect x={w * 0.52} y={h * 0.62} width={w * 0.12} height={h * 0.3} rx={6} fill={hasBoots ? colors.void[100] : skin} />
            {hasBoots ? (
              <>
                <Rect x={w * 0.34} y={h * 0.85} width={w * 0.16} height={h * 0.09} rx={5} fill={colors.abyss[300]} />
                <Rect x={w * 0.5} y={h * 0.85} width={w * 0.16} height={h * 0.09} rx={5} fill={colors.abyss[300]} />
              </>
            ) : (
              <>
                <Ellipse cx={w * 0.42} cy={h * 0.925} rx={w * 0.075} ry={h * 0.018} fill={skin} />
                <Ellipse cx={w * 0.58} cy={h * 0.925} rx={w * 0.075} ry={h * 0.018} fill={skin} />
              </>
            )}

            {/* arms */}
            <Rect x={w * 0.16} y={h * 0.38} width={w * 0.11} height={h * 0.26} rx={7} fill={skin} />
            <Rect x={w * 0.73} y={h * 0.38} width={w * 0.11} height={h * 0.26} rx={7} fill={skin} />
            {hasGloves ? (
              <>
                <Rect x={w * 0.155} y={h * 0.6} width={w * 0.12} height={h * 0.055} rx={6} fill={colors.abyss[200]} />
                <Rect x={w * 0.725} y={h * 0.6} width={w * 0.12} height={h * 0.055} rx={6} fill={colors.abyss[200]} />
              </>
            ) : null}
            <Circle cx={w * 0.215} cy={h * 0.65} r={w * 0.035} fill={hasGloves ? colors.abyss[100] : skin} />
            <Circle cx={w * 0.785} cy={h * 0.65} r={w * 0.035} fill={hasGloves ? colors.abyss[100] : skin} />
            {hasRing ? <Circle cx={w * 0.785} cy={h * 0.662} r={w * 0.01} fill={colors.gold[200]} /> : null}

            {/* torso — wider shoulders, tapered waist */}
            <AnimatedPath
              d={`M ${w * 0.27} ${h * 0.345} Q ${w * 0.5} ${h * 0.27} ${w * 0.73} ${h * 0.345} L ${w * 0.64} ${h * 0.635} Q ${w * 0.5} ${h * 0.665} ${w * 0.36} ${h * 0.635} Z`}
              stroke={glowColor}
              strokeWidth={1.1}
              animatedProps={torsoAnimatedProps}
            />
            {/* top-lit sheen overlay */}
            <Path
              d={`M ${w * 0.27} ${h * 0.345} Q ${w * 0.5} ${h * 0.27} ${w * 0.73} ${h * 0.345} L ${w * 0.7} ${h * 0.46} Q ${w * 0.5} ${h * 0.42} ${w * 0.3} ${h * 0.46} Z`}
              fill="url(#avatarSheen)"
              opacity={0.8}
            />
            {hasArmor ? (
              <>
                <Rect x={w * 0.24} y={h * 0.335} width={w * 0.14} height={h * 0.06} rx={4} fill={colors.abyss[200]} />
                <Rect x={w * 0.62} y={h * 0.335} width={w * 0.14} height={h * 0.06} rx={4} fill={colors.abyss[200]} />
              </>
            ) : null}
            {hasNecklace ? (
              <>
                <Path d={`M ${w * 0.46} ${h * 0.345} Q ${w * 0.5} ${h * 0.37} ${w * 0.54} ${h * 0.345}`} stroke={colors.gold[200]} strokeWidth={1} fill="none" opacity={0.85} />
                <Circle cx={w * 0.5} cy={h * 0.375} r={w * 0.016} fill={colors.gold[200]} />
              </>
            ) : null}

            {/* head */}
            <AnimatedCircle cx={w * 0.5} cy={h * 0.2} r={w * 0.16} stroke={glowColor} strokeWidth={1} animatedProps={headAnimatedProps} />
            <Ellipse cx={w * 0.44} cy={h * 0.175} rx={w * 0.055} ry={h * 0.018} fill={colors.white} opacity={0.14} />

            {/* beard */}
            {appearance.beard !== "none" ? (
              <Path
                d={`M ${w * 0.38} ${h * 0.24} Q ${w * 0.5} ${appearance.beard === "full" ? h * 0.33 : h * 0.28} ${w * 0.62} ${h * 0.24} L ${w * 0.58} ${h * 0.22} Q ${w * 0.5} ${h * 0.25} ${w * 0.42} ${h * 0.22} Z`}
                fill={appearance.hairColor}
                opacity={appearance.beard === "stubble" ? 0.5 : 0.9}
              />
            ) : null}

            {/* eyes (blink) */}
            <AnimatedEllipse cx={w * 0.44} cy={h * 0.195} rx={eyeRy} fill={appearance.eyeColor} animatedProps={leftEyeProps} />
            <AnimatedEllipse cx={w * 0.56} cy={h * 0.195} rx={eyeRy} fill={appearance.eyeColor} animatedProps={rightEyeProps} />

            {/* hair (or helmet override) */}
            {hasHelmet ? (
              <Path
                d={`M ${w * 0.32} ${h * 0.18} Q ${w * 0.5} ${h * 0.04} ${w * 0.68} ${h * 0.18} L ${w * 0.67} ${h * 0.26} Q ${w * 0.5} ${h * 0.15} ${w * 0.33} ${h * 0.26} Z`}
                fill={colors.slate}
                stroke={colors.white}
                strokeWidth={1}
                opacity={0.9}
              />
            ) : (
              <HairShape style={appearance.hairStyle} color={appearance.hairColor} w={w} h={h} />
            )}

            {/* weapon (glinting) */}
            {hasWeapon ? (
              <AnimatedRect
                x={w * 0.85}
                y={h * 0.32}
                width={w * 0.045}
                height={h * 0.32}
                rx={3}
                fill={colors.neon[200]}
                transform={`rotate(18 ${w * 0.87} ${h * 0.48})`}
                animatedProps={weaponAnimatedProps}
              />
            ) : null}
          </Svg>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function HairShape({ style, color, w, h }: { style: CharacterAppearance["hairStyle"]; color: string; w: number; h: number }) {
  switch (style) {
    case "shaved":
      return null;
    case "long":
      return (
        <>
          <Path
            d={`M ${w * 0.33} ${h * 0.15} Q ${w * 0.5} ${h * 0.03} ${w * 0.67} ${h * 0.15} L ${w * 0.66} ${h * 0.4} Q ${w * 0.6} ${h * 0.32} ${w * 0.5} ${h * 0.32} Q ${w * 0.4} ${h * 0.32} ${w * 0.34} ${h * 0.4} Z`}
            fill={color}
          />
          <Path
            d={`M ${w * 0.38} ${h * 0.11} Q ${w * 0.5} ${h * 0.05} ${w * 0.58} ${h * 0.09}`}
            stroke={colors.white}
            strokeOpacity={0.22}
            strokeWidth={w * 0.012}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "ponytail":
      return (
        <>
          <Path d={`M ${w * 0.34} ${h * 0.16} Q ${w * 0.5} ${h * 0.05} ${w * 0.66} ${h * 0.16} L ${w * 0.64} ${h * 0.24} Q ${w * 0.5} ${h * 0.16} ${w * 0.36} ${h * 0.24} Z`} fill={color} />
          <Path d={`M ${w * 0.63} ${h * 0.18} Q ${w * 0.74} ${h * 0.24} ${w * 0.7} ${h * 0.36}`} stroke={color} strokeWidth={w * 0.03} fill="none" strokeLinecap="round" />
          <Path
            d={`M ${w * 0.39} ${h * 0.12} Q ${w * 0.5} ${h * 0.07} ${w * 0.58} ${h * 0.1}`}
            stroke={colors.white}
            strokeOpacity={0.22}
            strokeWidth={w * 0.012}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "spiky":
      return (
        <>
          <Path
            d={`M ${w * 0.32} ${h * 0.16} L ${w * 0.36} ${h * 0.06} L ${w * 0.42} ${h * 0.15} L ${w * 0.46} ${h * 0.04} L ${w * 0.5} ${h * 0.14} L ${w * 0.54} ${h * 0.04} L ${w * 0.58} ${h * 0.15} L ${w * 0.64} ${h * 0.06} L ${w * 0.68} ${h * 0.16} Q ${w * 0.5} ${h * 0.1} ${w * 0.32} ${h * 0.16} Z`}
            fill={color}
          />
          <Path
            d={`M ${w * 0.46} ${h * 0.11} L ${w * 0.48} ${h * 0.05}`}
            stroke={colors.white}
            strokeOpacity={0.28}
            strokeWidth={w * 0.012}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
    case "short":
    default:
      return (
        <>
          <Path
            d={`M ${w * 0.33} ${h * 0.17} Q ${w * 0.5} ${h * 0.05} ${w * 0.67} ${h * 0.17} L ${w * 0.65} ${h * 0.23} Q ${w * 0.5} ${h * 0.14} ${w * 0.35} ${h * 0.23} Z`}
            fill={color}
          />
          <Path
            d={`M ${w * 0.39} ${h * 0.13} Q ${w * 0.5} ${h * 0.08} ${w * 0.58} ${h * 0.11}`}
            stroke={colors.white}
            strokeOpacity={0.22}
            strokeWidth={w * 0.012}
            fill="none"
            strokeLinecap="round"
          />
        </>
      );
  }
}
