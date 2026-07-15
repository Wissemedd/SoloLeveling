import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel } from "@/design-system/components";
import { fonts, rarity } from "@/design-system/theme";
import type { LootReward } from "../types";

const ICON_BY_KIND: Record<LootReward["kind"], keyof typeof Ionicons.glyphMap> = {
  xp: "star",
  gold: "cash-outline",
  title: "ribbon-outline",
  badge: "shield-checkmark-outline",
  aura: "sparkles-outline",
  theme: "color-palette-outline",
  avatar_skin: "person-outline",
  equipment: "shirt-outline",
};

export function ChestRevealCard({ reward, delayMs = 0 }: { reward: LootReward; delayMs?: number }) {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(delayMs, withSpring(1, { damping: 11 }));
    opacity.value = withDelay(delayMs, withSpring(1));
  }, [delayMs, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const color = rarity[reward.rarity];

  return (
    <Animated.View style={style}>
      <GlassPanel glow={reward.rarity === "legendary" ? "gold" : reward.rarity === "epic" ? "arcane" : "neon"} style={styles.panel}>
        <View style={[styles.iconWrap, { borderColor: color }]}>
          <Ionicons name={ICON_BY_KIND[reward.kind]} size={20} color={color} />
        </View>
        <View style={styles.textCol}>
          <Text style={[styles.rarity, { color }]}>{reward.rarity}</Text>
          <Text style={styles.label}>
            {reward.label}
            {reward.amount ? ` ×${reward.amount}` : ""}
          </Text>
        </View>
      </GlassPanel>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12, marginBottom: 10 },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  textCol: { flex: 1 },
  rarity: { fontFamily: fonts.bodyBold, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.6 },
  label: { fontFamily: fonts.bodyMedium, fontSize: 14, color: "#F5F7FF", marginTop: 2 },
});
