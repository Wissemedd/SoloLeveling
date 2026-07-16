import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RankBadge, StatBar, GateEmblem } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { xpProgress } from "@/features/player/engine/xpEngine";
import type { HunterRank } from "@/features/player/types";

type Props = {
  name: string;
  rank: HunterRank;
  level: number;
  totalXp: number;
  title: string | null;
  onPressProfile?: () => void;
};

export function HunterHeader({ name, rank, level, totalXp, title, onPressProfile }: Props) {
  const progress = xpProgress(totalXp);

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={styles.badgeWrap}>
          <View style={styles.gateBehindBadge}>
            <GateEmblem size={92} accent="arcane" />
          </View>
          <RankBadge rank={rank} size={60} />
        </View>
        <View style={styles.nameCol}>
          <Text style={styles.name}>{name}</Text>
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
        <Pressable onPress={onPressProfile} hitSlop={12} style={styles.settingsButton}>
          <Ionicons name="person-circle-outline" size={28} color={colors.slate} />
        </Pressable>
      </View>
      <View style={styles.xpRow}>
        <StatBar
          label={`Level ${level}`}
          value={progress.xpIntoLevel}
          max={progress.xpForNextLevel || 1}
          accent="neon"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 20, paddingTop: 12, gap: 14 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  badgeWrap: { width: 60, height: 60, alignItems: "center", justifyContent: "center" },
  gateBehindBadge: { position: "absolute", alignItems: "center", justifyContent: "center" },
  nameCol: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.white, letterSpacing: 0.4 },
  title: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.arcane[200], marginTop: 2 },
  settingsButton: { padding: 4 },
  xpRow: { marginTop: 2 },
});
