import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors, fonts } from "@/design-system/theme";

export type DamagePopupTone = "damage" | "crit" | "dodge" | "skill";
export type DamagePopupAnchor = "player" | "enemy";

type Props = {
  text: string;
  tone: DamagePopupTone;
  anchor: DamagePopupAnchor;
  onDone: () => void;
};

const TONE_COLOR: Record<DamagePopupTone, string> = {
  damage: colors.white,
  crit: colors.gold[200],
  dodge: colors.slate,
  skill: colors.arcane[200],
};

/** A "-42"/"Dodge!"/skill-name callout that rises and fades over the battle stage. */
export function FloatingDamageText({ text, tone, anchor, onDone }: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished) runOnJS(onDone)();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -progress.value * 34 }],
  }));

  return (
    <Animated.View style={[styles.wrap, anchor === "enemy" ? styles.enemyAnchor : styles.playerAnchor, style]} pointerEvents="none">
      <Text style={[styles.text, { color: TONE_COLOR[tone] }, tone === "crit" && styles.critText]}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute" },
  enemyAnchor: { top: "16%", right: "18%" },
  playerAnchor: { bottom: "34%", left: "18%" },
  text: {
    fontFamily: fonts.display,
    fontSize: 18,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  critText: { fontSize: 22 },
});
