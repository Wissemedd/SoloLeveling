import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GlassPanel, StatBar, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { bossCycleEnd, currentWeekBoss, healthRemaining } from "@/features/bosses/engine/bossEngine";

type Props = {
  damageDealt: number;
  onPress: () => void;
};

function formatCountdown(target: Date, now: Date): string {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "Reckoning underway";
  const hours = Math.floor(ms / 3_600_000);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h remaining`;
  return `${hours}h remaining`;
}

export function BossBanner({ damageDealt, onPress }: Props) {
  const boss = useMemo(() => currentWeekBoss(), []);
  const remaining = healthRemaining(boss, damageDealt);
  const countdown = useMemo(() => formatCountdown(bossCycleEnd(), new Date()), []);

  return (
    <Pressable onPress={onPress}>
      <GlassPanel glow="danger" style={styles.panel}>
        <View style={styles.headerRow}>
          <Chip label="Weekly Boss" tier="epic" />
          <Text style={styles.countdown}>{countdown}</Text>
        </View>
        <Text style={styles.name}>{boss.name}</Text>
        <Text style={styles.title}>{boss.title}</Text>
        <StatBar
          label="Boss Health"
          value={remaining}
          max={boss.maxHealth}
          accent="danger"
        />
      </GlassPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 18, gap: 10, marginHorizontal: 20 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  countdown: { fontFamily: fonts.bodyMedium, fontSize: 11, color: colors.slate },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.white, marginTop: 2 },
  title: { fontFamily: fonts.body, fontSize: 12, color: colors.danger[300], marginBottom: 4 },
});
