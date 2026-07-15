import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GlassPanel, GlowButton, StatBar, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { MissionInstance } from "@/features/missions/types";

type Props = {
  quest: MissionInstance | null;
  onPressGo: () => void;
};

export function TodayQuestCard({ quest, onPressGo }: Props) {
  if (!quest) {
    return (
      <GlassPanel glow="gold" style={styles.panel}>
        <Chip label="Daily Quest" tier="legendary" />
        <Text style={styles.clearedTitle}>All quests cleared</Text>
        <Text style={styles.clearedBody}>Rest, hunter. New gates open at midnight.</Text>
      </GlassPanel>
    );
  }

  const isComplete = Boolean(quest.completedAt);

  return (
    <GlassPanel glow={isComplete ? "gold" : "neon"} style={styles.panel}>
      <Chip label="Today's Quest" tier={isComplete ? "legendary" : "rare"} />
      <Text style={styles.title}>{quest.title}</Text>
      <Text style={styles.description}>{quest.description}</Text>
      <StatBar
        label="Progress"
        value={quest.progress}
        max={quest.targetValue}
        accent={isComplete ? "gold" : "neon"}
      />
      <View style={styles.footerRow}>
        <Text style={styles.reward}>+{quest.xpReward} XP · +{quest.goldReward} Gold</Text>
        <GlowButton
          label={isComplete ? "Claimed via Missions" : "Enter the Gate"}
          variant={isComplete ? "ghost" : "neon"}
          onPress={onPressGo}
          disabled={isComplete}
        />
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: { padding: 18, gap: 12, marginHorizontal: 20 },
  title: { fontFamily: fonts.display, fontSize: 16, color: colors.white },
  description: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, lineHeight: 18 },
  footerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  reward: { fontFamily: fonts.bodySemibold, fontSize: 12, color: colors.gold[200] },
  clearedTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.gold[200], marginTop: 4 },
  clearedBody: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
});
