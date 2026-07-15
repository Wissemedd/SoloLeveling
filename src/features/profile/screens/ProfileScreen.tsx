import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, RankBadge, StatBar, SectionHeader, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useWorkoutStore } from "@/features/workouts/store/workoutStore";
import { useRewardsStore } from "@/features/rewards/store/rewardsStore";
import { rankProgress } from "@/features/player/engine/rankEngine";
import { powerLevel } from "@/features/player/engine/statsEngine";

export function ProfileScreen() {
  const profile = usePlayerStore((s) => s.profile);
  const level = usePlayerStore((s) => s.level);
  const rank = usePlayerStore((s) => s.rank);
  const stats = usePlayerStore((s) => s.stats);
  const gold = usePlayerStore((s) => s.gold);
  const longestStreak = usePlayerStore((s) => s.streak.longest);
  const totalWorkouts = useWorkoutStore((s) => s.totalWorkoutsCompleted());
  const collection = useRewardsStore((s) => s.collection);

  const { upcoming, progress } = rankProgress(level);

  return (
    <ScreenBackground accent="gold" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <RankBadge rank={rank} size={72} />
          <View style={styles.headerTextCol}>
            <Text style={styles.name}>{profile?.name ?? "Hunter"}</Text>
            <Text style={styles.meta}>
              Level {level} · Power {powerLevel(stats)}
            </Text>
          </View>
        </View>

        <GlassPanel glow="gold" style={styles.panel}>
          <Text style={styles.panelTitle}>Rank Progress</Text>
          {upcoming ? (
            <StatBar label={`Rank ${rank} → ${upcoming.rank}`} value={Math.round(progress * 100)} max={100} accent="gold" />
          ) : (
            <Text style={styles.maxRank}>Peak rank reached. Legends remember your name.</Text>
          )}
        </GlassPanel>

        <View style={styles.statRow}>
          <StatTile icon="flame" label="Streak" value={`${longestStreak}d`} />
          <StatTile icon="barbell" label="Workouts" value={`${totalWorkouts}`} />
          <StatTile icon="diamond" label="Gold" value={`${gold}`} />
        </View>

        <SectionHeader title="Collection" subtitle={`${collection.length} cosmetics earned`} />
        <View style={styles.collectionGrid}>
          {collection.slice(0, 6).map((item) => (
            <Chip key={item.id} label={item.label} tier={item.rarity} />
          ))}
          {collection.length === 0 ? <Text style={styles.emptyText}>Complete workouts to earn cosmetic loot.</Text> : null}
        </View>

        <SectionHeader title="More" />
        <MenuRow icon="people-outline" label="Guild & Friends" hint="Coming soon" />
        <MenuRow icon="sparkles-outline" label="AI Coach" hint="Coming soon" />
        <MenuRow icon="diamond-outline" label="Premium" hint="Cosmetics & analytics" />
        <MenuRow icon="settings-outline" label="Settings" hint="" />
      </ScrollView>
    </ScreenBackground>
  );
}

function StatTile({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <GlassPanel glow="neon" style={styles.statTile}>
      <Ionicons name={icon} size={18} color={colors.neon[300]} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </GlassPanel>
  );
}

function MenuRow({ icon, label, hint }: { icon: keyof typeof Ionicons.glyphMap; label: string; hint: string }) {
  return (
    <GlassPanel glow="none" style={styles.menuRow}>
      <Ionicons name={icon} size={18} color={colors.slate} />
      <Text style={styles.menuLabel}>{label}</Text>
      {hint ? <Text style={styles.menuHint}>{hint}</Text> : null}
      <Ionicons name="chevron-forward" size={16} color={colors.slate} />
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  headerTextCol: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.slate, marginTop: 2 },
  panel: { padding: 16, gap: 10 },
  panelTitle: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gold[200], textTransform: "uppercase" },
  maxRank: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  statRow: { flexDirection: "row", gap: 10 },
  statTile: { flex: 1, alignItems: "center", padding: 14, gap: 4 },
  statValue: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  statLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  collectionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emptyText: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, marginBottom: 10 },
  menuLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.white, flex: 1 },
  menuHint: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
});
