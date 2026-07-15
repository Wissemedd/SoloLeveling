import React, { useEffect, useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../theme";

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get("window");
const PALETTE = [colors.neon[300], colors.arcane[300], colors.gold[200]];

type ParticleSpec = {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
};

function makeParticles(density: number): ParticleSpec[] {
  return Array.from({ length: density }).map((_, i) => ({
    id: i,
    x: Math.random() * SCREEN_W,
    startY: Math.random() * SCREEN_H,
    size: 2 + Math.random() * 3,
    duration: 7000 + Math.random() * 7000,
    delay: Math.random() * 5000,
    color: PALETTE[i % PALETTE.length],
  }));
}

/** A single drifting mote. Fades in/out at the ends of its loop so the reset is invisible. */
function Mote({ spec }: { spec: ParticleSpec }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      spec.delay,
      withRepeat(withTiming(1, { duration: spec.duration, easing: Easing.linear }), -1, false),
    );
  }, [progress, spec.delay, spec.duration]);

  const style = useAnimatedStyle(() => {
    const travel = SCREEN_H + 200;
    const y = spec.startY - progress.value * travel;
    const fade = Math.sin(progress.value * Math.PI);
    return {
      transform: [{ translateX: spec.x }, { translateY: y }],
      opacity: 0.1 + fade * 0.55,
    };
  });

  return (
    <Animated.View
      style={[
        styles.mote,
        { width: spec.size, height: spec.size, borderRadius: spec.size, backgroundColor: spec.color },
        style,
      ]}
    />
  );
}

/** Ambient floating light particles layered behind screen content. Skia-free by design. */
export function ParticleField({ density = 20 }: { density?: number }) {
  const particles = useMemo(() => makeParticles(density), [density]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {particles.map((spec) => (
        <Mote key={spec.id} spec={spec} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  mote: {
    position: "absolute",
    shadowColor: "#22D9F5",
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
});
