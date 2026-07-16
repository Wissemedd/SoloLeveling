import React from "react";
import { StyleSheet, View } from "react-native";
import { StatBar, SectionHeader } from "@/design-system/components";
import { RPG_STAT_KEYS, RPG_STAT_LABELS, RpgStats } from "@/features/player/types";

const ACCENT_BY_STAT: Record<string, "neon" | "arcane" | "gold"> = {
  strength: "arcane",
  agility: "neon",
  endurance: "neon",
  focus: "gold",
  discipline: "arcane",
  vitality: "gold",
};

/**
 * Gives every bar visual headroom so it never looks maxed-out as stats grow.
 * Headroom is fixed (+30) rather than proportional, so a fresh hunter's base
 * stat (10) renders at a quarter of the bar instead of half — leaving three
 * quarters of runway to visibly fill in as the stat is trained up.
 */
function visualMax(value: number): number {
  return Math.max(40, Math.ceil((value + 30) / 10) * 10);
}

export function StatsGrid({ stats }: { stats: RpgStats }) {
  return (
    <View style={styles.wrapper}>
      <SectionHeader title="Hunter Stats" subtitle="Grows with every quest you complete" />
      <View style={styles.grid}>
        {RPG_STAT_KEYS.map((key) => (
          <View key={key} style={styles.cell}>
            <StatBar
              label={RPG_STAT_LABELS[key]}
              value={stats[key]}
              max={visualMax(stats[key])}
              accent={ACCENT_BY_STAT[key]}
              showValue={false}
              height={8}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, marginTop: 8 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  cell: { width: "47%" },
});
