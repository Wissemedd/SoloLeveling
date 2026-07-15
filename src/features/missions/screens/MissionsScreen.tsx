import React, { useEffect, useMemo } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { ScreenBackground, GlassPanel, GlowButton, Chip, StatBar, SectionHeader } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { playSound } from "@/features/sound/engine/soundManager";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useMissionStore } from "../store/missionStore";
import type { MissionInstance, MissionPeriod } from "../types";

const PERIOD_LABEL: Record<MissionPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  legendary: "Legendary",
};

const PERIOD_TIER: Record<MissionPeriod, "common" | "rare" | "epic" | "legendary"> = {
  daily: "common",
  weekly: "rare",
  monthly: "epic",
  legendary: "legendary",
};

export function MissionsScreen() {
  const missions = useMissionStore((s) => s.active);
  const refreshBoard = useMissionStore((s) => s.refreshBoard);
  const claimMission = useMissionStore((s) => s.claimMission);
  const grantXpToPlayer = usePlayerStore((s) => s.grantXpToPlayer);
  const addGold = usePlayerStore((s) => s.addGold);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  const sections = useMemo(() => {
    const periods: MissionPeriod[] = ["daily", "weekly", "monthly", "legendary"];
    return periods
      .map((period) => ({ title: PERIOD_LABEL[period], period, data: missions.filter((m) => m.period === period) }))
      .filter((s) => s.data.length > 0);
  }, [missions]);

  const handleClaim = (mission: MissionInstance) => {
    const claimed = claimMission(mission.instanceId);
    if (!claimed) return;
    grantXpToPlayer(mission.xpReward, "mission");
    addGold(mission.goldReward);
    playSound("mission_complete");
  };

  return (
    <ScreenBackground accent="gold" particles={false}>
      <View style={styles.header}>
        <SectionHeader title="Mission Board" subtitle="New gates open daily, weekly, and monthly" />
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.instanceId}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeaderRow}>
            <Chip label={section.title} tier={PERIOD_TIER[section.period as MissionPeriod]} />
          </View>
        )}
        renderItem={({ item }) => {
          const isComplete = Boolean(item.completedAt);
          const isClaimed = Boolean(item.claimedAt);
          return (
            <GlassPanel glow={isClaimed ? "none" : isComplete ? "gold" : "neon"} style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <StatBar
                label="Progress"
                value={item.progress}
                max={item.targetValue}
                accent={isComplete ? "gold" : "neon"}
              />
              <View style={styles.footerRow}>
                <Text style={styles.reward}>
                  +{item.xpReward} XP · +{item.goldReward} Gold
                </Text>
                <GlowButton
                  label={isClaimed ? "Claimed" : isComplete ? "Claim" : "In Progress"}
                  variant={isClaimed ? "ghost" : isComplete ? "gold" : "ghost"}
                  disabled={!isComplete || isClaimed}
                  onPress={() => handleClaim(item)}
                />
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
  sectionHeaderRow: { marginTop: 16, marginBottom: 10 },
  card: { padding: 16, gap: 10, marginBottom: 14 },
  title: { fontFamily: fonts.display, fontSize: 15, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 12, color: colors.slate, lineHeight: 17 },
  footerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  reward: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gold[200] },
});
