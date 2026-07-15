import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { colors, fonts } from "../theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  color?: string;
  centerLabel?: string;
  centerSub?: string;
};

/** Circular gauge — streak counters, boss health, daily-goal completion. */
export function ProgressRing({
  progress,
  size = 96,
  strokeWidth = 8,
  color = colors.neon[300],
  centerLabel,
  centerSub,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(1, Math.max(0, progress)), {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });
  }, [animatedProgress, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {centerLabel ? (
        <View style={styles.center}>
          <Text style={[styles.centerLabel, { color }]}>{centerLabel}</Text>
          {centerSub ? <Text style={styles.centerSub}>{centerSub}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    fontFamily: fonts.display,
    fontSize: 20,
  },
  centerSub: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.slate,
    marginTop: 2,
  },
});
