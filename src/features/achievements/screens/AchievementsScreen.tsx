import React, { useEffect, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, StatBar, SectionHeader, GateEmblem, ShadowSigil } from "@/design-system/components";
import { colors, fonts, rarity } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { achievements } from "../data/achievements";
import { achievementProgress } from "../engine/achievementEngine";
import { deriveLifetimeStats } from "../engine/deriveLifetimeStats";
import { useAchievementStore } from "../store/achievementStore";

export function AchievementsScreen() {
  const level = usePlayerStore((s) => s.level);
  const longestStreak = usePlayerStore((s) => s.streak.longest);
  const counters = useLifetimeStatsStore((s) => s.counters);
  const unlocked = useAchievementStore((s) => s.unlocked);
  const evaluate = useAchievementStore((s) => s.evaluate);

  const stats = useMemo(() => deriveLifetimeStats(counters, level, longestStreak), [counters, level, longestStreak]);

  useEffect(() => {
    evaluate(stats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unlockedIds = useMemo(() => new Set(unlocked.map((u) => u.achievementId)), [unlocked]);
  const sorted = useMemo(
    () =>
      [...achievements].sort((a, b) => {
        const aDone = unlockedIds.has(a.id) ? 1 : 0;
        const bDone = unlockedIds.has(b.id) ? 1 : 0;
        if (aDone !== bDone) return bDone - aDone;
        return achievementProgress(stats, b) - achievementProgress(stats, a);
      }),
    [unlockedIds, stats],
  );

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <View style={styles.header}>
        <SectionHeader
          title="Achievements"
          subtitle={`${unlockedIds.size} / ${achievements.length} unlocked`}
        />
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUnlocked = unlockedIds.has(item.id);
          const progress = achievementProgress(stats, item);
          const color = rarity[item.tier];
          return (
            <GlassPanel glow={isUnlocked ? "gold" : "none"} style={[styles.card, !isUnlocked && styles.locked]}>
              <View style={[styles.iconWrap, { borderColor: color }]}>
                {isUnlocked && item.tier === "legendary" ? (
                  <GateEmblem size={34} accent="gold" animated={false} />
                ) : isUnlocked && item.tier === "epic" ? (
                  <ShadowSigil size={26} accent="arcane" pulse={false} />
                ) : (
                  <Ionicons name={isUnlocked ? "trophy" : "trophy-outline"} size={18} color={color} />
                )}
              </View>
              <View style={styles.textCol}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
                {!isUnlocked && <StatBar label="" value={progress * 100} max={100} showValue={false} height={5} />}
              </View>
            </GlassPanel>
          );
        }}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12 },
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  card: { flexDirection: "row", padding: 14, gap: 12, marginBottom: 12, alignItems: "center" },
  locked: { opacity: 0.7 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  textCol: { flex: 1, gap: 4 },
  title: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
