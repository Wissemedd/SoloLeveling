import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Ellipse, Path, Rect } from "react-native-svg";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import { colors, rankColors } from "@/design-system/theme";
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
};

/**
 * Original layered-shape "shadow hunter" silhouette — flat geometric shapes
 * only, no illustrated/licensed art, in the same spirit as GateEmblem and
 * ShadowSigil. Hair/eyes/skin/outfit colors come straight from
 * CharacterAppearance; equipped gear swaps in extra geometric overlays.
 */
export function AvatarSilhouette({ appearance, rank = "E", equippedSlots = {}, size = 220, breathing = true }: Props) {
  const skin = SKIN_TONE_OPTIONS.find((s) => s.id === appearance.skinTone)?.hex ?? SKIN_TONE_OPTIONS[1].hex;
  const outfit = OUTFIT_OPTIONS.find((o) => o.id === appearance.outfitId)?.accentHex ?? OUTFIT_OPTIONS[0].accentHex;
  const glowColor = rankColors[rank];

  const breath = useSharedValue(0);
  useEffect(() => {
    if (!breathing) return;
    breath.value = withRepeat(withTiming(1, { duration: 2200, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [breathing, breath]);

  const breathStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: 1 + breath.value * 0.015 }, { translateY: -breath.value * 2 }],
  }));

  const hasHelmet = !!equippedSlots.helmet;
  const hasArmor = !!equippedSlots.armor;
  const hasBoots = !!equippedSlots.boots;
  const hasWeapon = !!equippedSlots.weapon;
  const torsoColor = hasArmor ? colors.slate : outfit;

  const w = 160;
  const h = 320;

  return (
    <View style={{ width: size, height: size * (h / w), alignItems: "center" }}>
      <Svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`} style={StyleSheet.absoluteFill}>
        <Ellipse cx={w / 2} cy={h * 0.92} rx={w * 0.42} ry={h * 0.05} fill={glowColor} opacity={0.28} />
      </Svg>
      <Animated.View style={breathStyle}>
        <Svg width={size} height={size * (h / w)} viewBox={`0 0 ${w} ${h}`}>
          {/* legs */}
          <Rect x={w * 0.36} y={h * 0.62} width={w * 0.12} height={h * 0.3} rx={6} fill={hasBoots ? colors.void[100] : skin} />
          <Rect x={w * 0.52} y={h * 0.62} width={w * 0.12} height={h * 0.3} rx={6} fill={hasBoots ? colors.void[100] : skin} />
          {hasBoots ? (
            <>
              <Rect x={w * 0.34} y={h * 0.85} width={w * 0.16} height={h * 0.09} rx={5} fill={colors.abyss[300]} />
              <Rect x={w * 0.5} y={h * 0.85} width={w * 0.16} height={h * 0.09} rx={5} fill={colors.abyss[300]} />
            </>
          ) : null}

          {/* arms */}
          <Rect x={w * 0.16} y={h * 0.38} width={w * 0.11} height={h * 0.26} rx={7} fill={skin} />
          <Rect x={w * 0.73} y={h * 0.38} width={w * 0.11} height={h * 0.26} rx={7} fill={skin} />

          {/* torso */}
          <Path
            d={`M ${w * 0.3} ${h * 0.34} Q ${w * 0.5} ${h * 0.28} ${w * 0.7} ${h * 0.34} L ${w * 0.66} ${h * 0.64} Q ${w * 0.5} ${h * 0.68} ${w * 0.34} ${h * 0.64} Z`}
            fill={torsoColor}
          />
          {hasArmor ? (
            <>
              <Rect x={w * 0.26} y={h * 0.33} width={w * 0.13} height={h * 0.06} rx={4} fill={colors.abyss[200]} />
              <Rect x={w * 0.61} y={h * 0.33} width={w * 0.13} height={h * 0.06} rx={4} fill={colors.abyss[200]} />
            </>
          ) : null}

          {/* head */}
          <Circle cx={w * 0.5} cy={h * 0.2} r={w * 0.16} fill={skin} />

          {/* beard */}
          {appearance.beard !== "none" ? (
            <Path
              d={`M ${w * 0.38} ${h * 0.24} Q ${w * 0.5} ${appearance.beard === "full" ? h * 0.33 : h * 0.28} ${w * 0.62} ${h * 0.24} L ${w * 0.58} ${h * 0.22} Q ${w * 0.5} ${h * 0.25} ${w * 0.42} ${h * 0.22} Z`}
              fill={appearance.hairColor}
              opacity={appearance.beard === "stubble" ? 0.5 : 0.9}
            />
          ) : null}

          {/* eyes */}
          <Circle cx={w * 0.44} cy={h * 0.195} r={w * 0.018} fill={appearance.eyeColor} />
          <Circle cx={w * 0.56} cy={h * 0.195} r={w * 0.018} fill={appearance.eyeColor} />

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

          {/* weapon */}
          {hasWeapon ? (
            <Rect
              x={w * 0.85}
              y={h * 0.32}
              width={w * 0.045}
              height={h * 0.32}
              rx={3}
              fill={colors.neon[200]}
              transform={`rotate(18 ${w * 0.87} ${h * 0.48})`}
            />
          ) : null}
        </Svg>
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
        <Path
          d={`M ${w * 0.33} ${h * 0.15} Q ${w * 0.5} ${h * 0.03} ${w * 0.67} ${h * 0.15} L ${w * 0.66} ${h * 0.4} Q ${w * 0.6} ${h * 0.32} ${w * 0.5} ${h * 0.32} Q ${w * 0.4} ${h * 0.32} ${w * 0.34} ${h * 0.4} Z`}
          fill={color}
        />
      );
    case "ponytail":
      return (
        <>
          <Path d={`M ${w * 0.34} ${h * 0.16} Q ${w * 0.5} ${h * 0.05} ${w * 0.66} ${h * 0.16} L ${w * 0.64} ${h * 0.24} Q ${w * 0.5} ${h * 0.16} ${w * 0.36} ${h * 0.24} Z`} fill={color} />
          <Path d={`M ${w * 0.63} ${h * 0.18} Q ${w * 0.74} ${h * 0.24} ${w * 0.7} ${h * 0.36}`} stroke={color} strokeWidth={w * 0.03} fill="none" strokeLinecap="round" />
        </>
      );
    case "spiky":
      return (
        <Path
          d={`M ${w * 0.32} ${h * 0.16} L ${w * 0.36} ${h * 0.06} L ${w * 0.42} ${h * 0.15} L ${w * 0.46} ${h * 0.04} L ${w * 0.5} ${h * 0.14} L ${w * 0.54} ${h * 0.04} L ${w * 0.58} ${h * 0.15} L ${w * 0.64} ${h * 0.06} L ${w * 0.68} ${h * 0.16} Q ${w * 0.5} ${h * 0.1} ${w * 0.32} ${h * 0.16} Z`}
          fill={color}
        />
      );
    case "short":
    default:
      return (
        <Path
          d={`M ${w * 0.33} ${h * 0.17} Q ${w * 0.5} ${h * 0.05} ${w * 0.67} ${h * 0.17} L ${w * 0.65} ${h * 0.23} Q ${w * 0.5} ${h * 0.14} ${w * 0.35} ${h * 0.23} Z`}
          fill={color}
        />
      );
  }
}
