import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { ScreenBackground, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { OnboardingStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<OnboardingStackParamList, "CinematicIntro">;

function useFadeIn(delayMs: number) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(16);

  useEffect(() => {
    opacity.value = withDelay(delayMs, withTiming(1, { duration: 700 }));
    translateY.value = withDelay(delayMs, withTiming(0, { duration: 700 }));
  }, [delayMs, opacity, translateY]);

  return useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
}

export function CinematicIntroScreen({ navigation }: Props) {
  const lineOneStyle = useFadeIn(300);
  const lineTwoStyle = useFadeIn(1000);
  const lineThreeStyle = useFadeIn(1700);
  const ctaStyle = useFadeIn(2600);

  return (
    <ScreenBackground accent="arcane">
      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Animated.Text style={[styles.eyebrow, lineOneStyle]}>A GATE HAS OPENED</Animated.Text>
          <Animated.Text style={[styles.headline, lineTwoStyle]}>You have been selected.</Animated.Text>
          <Animated.Text style={[styles.body, lineThreeStyle]}>
            Every hunter starts at E-Rank. What you become is written one quest at a time.
          </Animated.Text>
        </View>
        <Animated.View style={[styles.ctaWrap, ctaStyle]}>
          <GlowButton label="Awaken" variant="arcane" size="lg" onPress={() => navigation.navigate("HunterCreation")} />
        </Animated.View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 32, gap: 60 },
  textBlock: { gap: 16 },
  eyebrow: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 4,
    color: colors.arcane[300],
    textAlign: "center",
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.white,
    textAlign: "center",
    lineHeight: 38,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.slate,
    textAlign: "center",
    lineHeight: 21,
    paddingHorizontal: 12,
  },
  ctaWrap: { alignItems: "center" },
});
