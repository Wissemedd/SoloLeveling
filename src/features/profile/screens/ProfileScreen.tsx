import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, RankBadge, StatBar, SectionHeader, Chip, GateEmblem, MenuRow, StatTile } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useWorkoutStore } from "@/features/workouts/store/workoutStore";
import { useRewardsStore } from "@/features/rewards/store/rewardsStore";
import { rankProgress } from "@/features/player/engine/rankEngine";
import { powerLevel } from "@/features/player/engine/statsEngine";
import { useHealthStore } from "@/features/health/store/healthStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useClassStore } from "@/features/classes/store/classStore";
import { getEligibleEvolutions, getNode } from "@/features/classes/engine/classEngine";
import { ClassBadge } from "@/features/classes/components/ClassBadge";
import type { ClassArchetypeId } from "@/features/classes/types";
import type { ProfileStackParamList } from "@/app/navigation/types";

export function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const profile = usePlayerStore((s) => s.profile);
  const level = usePlayerStore((s) => s.level);
  const rank = usePlayerStore((s) => s.rank);
  const stats = usePlayerStore((s) => s.stats);
  const gold = usePlayerStore((s) => s.gold);
  const longestStreak = usePlayerStore((s) => s.streak.longest);
  const totalWorkouts = useWorkoutStore((s) => s.totalWorkoutsCompleted());
  const collection = useRewardsStore((s) => s.collection);
  const healthStatus = useHealthStore((s) => s.status);
  const connectHealth = useHealthStore((s) => s.connect);
  const disconnectHealth = useHealthStore((s) => s.disconnect);
  const counters = useLifetimeStatsStore((s) => s.counters);
  const currentClassNodeId = useClassStore((s) => s.currentNodeId);
  const chosenBranch = useClassStore((s) => s.chosenBranch);
  const initClassForArchetype = useClassStore((s) => s.initForArchetype);

  // Backfills the class tree for hunters created before this feature shipped.
  useEffect(() => {
    if (!currentClassNodeId && profile?.avatarId) {
      initClassForArchetype(profile.avatarId as ClassArchetypeId);
    }
  }, [currentClassNodeId, profile?.avatarId, initClassForArchetype]);

  const { upcoming, progress } = rankProgress(level);
  const currentClassNode = currentClassNodeId ? getNode(currentClassNodeId) : undefined;
  const eligibleEvolutions = useMemo(() => {
    if (!currentClassNodeId) return [];
    return getEligibleEvolutions(currentClassNodeId, chosenBranch, {
      level,
      stats,
      lifetimeStats: deriveLifetimeStats(counters, level, longestStreak),
    });
  }, [currentClassNodeId, chosenBranch, level, stats, counters, longestStreak]);

  const healthHint =
    healthStatus === "connected"
      ? "Connected"
      : healthStatus === "unsupported-platform"
        ? "Android only"
        : healthStatus === "needs-update" || healthStatus === "unavailable"
          ? "Unavailable"
          : "Tap to connect";

  const handleToggleHealthConnection = () => {
    if (healthStatus === "connected") disconnectHealth();
    else connectHealth().catch(() => {});
  };

  return (
    <ScreenBackground accent="gold" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.badgeWrap}>
            <View style={styles.gateBehindBadge}>
              <GateEmblem size={104} accent="gold" />
            </View>
            <RankBadge rank={rank} size={72} />
          </View>
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

        {currentClassNode ? (
          <Pressable onPress={() => navigation.navigate("ClassEvolution")}>
            <GlassPanel glow="arcane" style={styles.panel}>
              <View style={styles.classPanelHeader}>
                <Text style={styles.panelTitle}>Class</Text>
                {eligibleEvolutions.length > 0 ? <Chip label="Evolution Ready" tier="legendary" /> : null}
              </View>
              <View style={styles.classRow}>
                <ClassBadge node={currentClassNode} size={48} showTagline />
                <Ionicons name="chevron-forward" size={18} color={colors.slate} />
              </View>
            </GlassPanel>
          </Pressable>
        ) : null}

        <View style={styles.statRow}>
          <GlassPanel glow="neon" style={styles.statTile}>
            <StatTile icon="flame" label="Streak" value={`${longestStreak}d`} />
          </GlassPanel>
          <GlassPanel glow="neon" style={styles.statTile}>
            <StatTile icon="barbell" label="Workouts" value={`${totalWorkouts}`} />
          </GlassPanel>
          <GlassPanel glow="neon" style={styles.statTile}>
            <StatTile icon="diamond" label="Gold" value={`${gold}`} />
          </GlassPanel>
        </View>

        <SectionHeader title="Collection" subtitle={`${collection.length} cosmetics earned`} />
        <View style={styles.collectionGrid}>
          {collection.slice(0, 6).map((item) => (
            <Chip key={item.id} label={item.label} tier={item.rarity} />
          ))}
          {collection.length === 0 ? <Text style={styles.emptyText}>Complete workouts to earn cosmetic loot.</Text> : null}
        </View>

        <SectionHeader title="More" />
        <MenuRow icon="trophy-outline" label="Achievements" hint="" onPress={() => navigation.navigate("Achievements")} />
        <MenuRow icon="library-outline" label="Activity Journal" hint="Reading, manga, chores…" onPress={() => navigation.navigate("ActivityLog")} />
        <MenuRow
          icon="footsteps-outline"
          label="Samsung Health"
          hint={healthHint}
          onPress={healthStatus === "unsupported-platform" || healthStatus === "unavailable" ? undefined : handleToggleHealthConnection}
        />
        <MenuRow icon="sparkles-outline" label="AI Coach" hint="Coming soon" />
        <MenuRow icon="diamond-outline" label="Premium" hint="Cosmetics & analytics" />
        <MenuRow icon="settings-outline" label="Settings" hint="" />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  badgeWrap: { width: 72, height: 72, alignItems: "center", justifyContent: "center" },
  gateBehindBadge: { position: "absolute", alignItems: "center", justifyContent: "center" },
  headerTextCol: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.slate, marginTop: 2 },
  panel: { padding: 16, gap: 10 },
  panelTitle: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gold[200], textTransform: "uppercase" },
  maxRank: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  classPanelHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  classRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  statRow: { flexDirection: "row", gap: 10 },
  statTile: { flex: 1, padding: 14 },
  collectionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  emptyText: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
});
