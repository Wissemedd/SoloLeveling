import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, GlowButton, StatBar, Chip, InfoRow } from "@/design-system/components";
import { colors, fonts, rankColors, RarityTier } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { playSound } from "@/features/sound/engine/soundManager";
import { RPG_STAT_LABELS } from "@/features/player/types";
import type { HunterRank } from "@/features/player/types";
import type { AchievementMetric } from "@/features/achievements/types";
import { useClassStore } from "../store/classStore";
import {
  getNextCandidates,
  getNode,
  getPath,
  isRequirementMet,
  topStatKeys,
  type ClassEvalContext,
} from "../engine/classEngine";
import { ClassBadge } from "../components/ClassBadge";
import type { ClassNode } from "../types";

const METRIC_LABELS: Record<AchievementMetric, string> = {
  totalWorkouts: "Workouts completed",
  totalPushups: "Lifetime push-ups",
  totalDistanceKm: "Kilometers covered",
  longestStreak: "Longest streak (days)",
  totalCaloriesBurned: "Calories burned",
  level: "Level",
  morningWorkouts: "Workouts before 7am",
  nightWorkouts: "Workouts after 10pm",
  totalSteps: "Lifetime steps",
  totalDungeonsCleared: "Gates cleared",
  totalMonstersDefeated: "Monsters defeated",
  totalBossesDefeated: "Bosses defeated",
  totalItemsCrafted: "Items forged",
};

const RANK_TIER: Record<HunterRank, RarityTier> = {
  E: "common",
  D: "common",
  C: "rare",
  B: "epic",
  A: "epic",
  S: "legendary",
  National: "legendary",
};

export function ClassEvolutionScreen() {
  const level = usePlayerStore((s) => s.level);
  const stats = usePlayerStore((s) => s.stats);
  const streakLongest = usePlayerStore((s) => s.streak.longest);
  const counters = useLifetimeStatsStore((s) => s.counters);
  const currentNodeId = useClassStore((s) => s.currentNodeId);
  const chosenBranch = useClassStore((s) => s.chosenBranch);
  const evolveTo = useClassStore((s) => s.evolveTo);

  const lifetimeStats = useMemo(
    () => deriveLifetimeStats(counters, level, streakLongest),
    [counters, level, streakLongest],
  );
  const ctx = useMemo<ClassEvalContext>(() => ({ level, stats, lifetimeStats }), [level, stats, lifetimeStats]);

  const currentNode = useMemo(() => (currentNodeId ? getNode(currentNodeId) : undefined), [currentNodeId]);
  const path = useMemo(() => (currentNodeId ? getPath(currentNodeId) : []), [currentNodeId]);
  const candidates = useMemo(
    () => (currentNodeId ? getNextCandidates(currentNodeId, chosenBranch) : []),
    [currentNodeId, chosenBranch],
  );

  const handleEvolve = useCallback(
    (node: ClassNode) => {
      evolveTo(node.id);
      playSound("level_up");
    },
    [evolveTo],
  );

  if (!currentNode) {
    return (
      <ScreenBackground accent="arcane">
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>No active class yet.</Text>
        </View>
      </ScreenBackground>
    );
  }

  const sectionLabel =
    candidates.length === 0
      ? "Final class reached"
      : candidates.length > 1
        ? "Choose your specialization"
        : "Next evolution";

  return (
    <ScreenBackground accent="arcane" particles>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Chip label={`Rank ${currentNode.rank}`} tier={RANK_TIER[currentNode.rank]} />

        <View style={styles.heroWrap}>
          <ClassBadge node={currentNode} size={88} />
        </View>
        <Text style={styles.tagline}>{currentNode.tagline}</Text>

        <GlassPanel glow="arcane" style={styles.panel}>
          <Text style={styles.panelTitle}>Path</Text>
          <View style={styles.pathRow}>
            {path.map((node, idx) => (
              <View key={node.id} style={styles.pathItem}>
                <Ionicons name={node.icon} size={16} color={rankColors[node.rank]} />
                <Text style={styles.pathLabel} numberOfLines={1}>
                  {node.name}
                </Text>
                {idx < path.length - 1 ? (
                  <Ionicons name="chevron-forward" size={12} color={colors.slate} />
                ) : null}
              </View>
            ))}
          </View>
        </GlassPanel>

        <Text style={styles.sectionLabel}>{sectionLabel}</Text>

        {candidates.length === 0 ? (
          <Text style={styles.peakText}>This path has reached its peak. A legend has been completed.</Text>
        ) : (
          candidates.map((node) => (
            <EvolutionCard key={node.id} node={node} ctx={ctx} onConfirm={() => handleEvolve(node)} />
          ))
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

function EvolutionCard({
  node,
  ctx,
  onConfirm,
}: {
  node: ClassNode;
  ctx: ClassEvalContext;
  onConfirm: () => void;
}) {
  const eligible = isRequirementMet(node.requirement, ctx);
  const req = node.requirement;
  const top = useMemo(() => topStatKeys(ctx.stats), [ctx.stats]);

  return (
    <GlassPanel glow={eligible ? "gold" : "none"} style={styles.card}>
      <ClassBadge node={node} size={48} showTagline />

      {req ? (
        <View style={styles.reqList}>
          <InfoRow
            label={`Level ${req.minLevel}`}
            met={ctx.level >= req.minLevel}
            value={`${ctx.level}/${req.minLevel}`}
          />
          {req.dominantStats && req.dominantStats.length > 0 ? (
            <InfoRow
              label={`Dominant stat: ${req.dominantStats.map((k) => RPG_STAT_LABELS[k]).join(" or ")}`}
              met={req.dominantStats.some((k) => top.includes(k))}
            />
          ) : null}
          {req.metric && req.metricThreshold ? (
            <View style={styles.metricRow}>
              <StatBar
                label={METRIC_LABELS[req.metric]}
                value={Math.min(ctx.lifetimeStats[req.metric], req.metricThreshold)}
                max={req.metricThreshold}
                accent={eligible ? "gold" : "arcane"}
              />
            </View>
          ) : null}
        </View>
      ) : null}

      <GlowButton
        label={eligible ? `Become ${node.name}` : "Requirements not met"}
        variant={eligible ? "gold" : "ghost"}
        disabled={!eligible}
        onPress={onConfirm}
        style={styles.cta}
      />
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48, gap: 14, alignItems: "stretch" },
  emptyWrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  emptyText: { fontFamily: fonts.body, fontSize: 14, color: colors.slate, textAlign: "center" },
  heroWrap: { alignItems: "center", marginTop: 4 },
  tagline: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, textAlign: "center" },
  panel: { padding: 14, gap: 8 },
  panelTitle: {
    fontFamily: fonts.bodySemibold,
    fontSize: 11,
    color: colors.arcane[200],
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  pathRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  pathItem: { flexDirection: "row", alignItems: "center", gap: 4, maxWidth: 140 },
  pathLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.white },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.slate,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 6,
  },
  peakText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  card: { padding: 16, gap: 12 },
  reqList: { gap: 6 },
  metricRow: { marginTop: 2 },
  cta: { marginTop: 4 },
});
