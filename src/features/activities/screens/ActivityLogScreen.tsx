import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, StatBar, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { localDateIso } from "@/lib/utils/date";
import { activityTypes } from "../data/activityTypes";
import { useActivityStore } from "../store/activityStore";
import { useLogActivity } from "../hooks/useLogActivity";
import type { ActivityTypeDef, ActivityUnit } from "../types";

const QUICK_AMOUNTS: Record<ActivityUnit, number[]> = {
  minutes: [15, 30, 60],
  liters: [0.5, 1, 2],
  hours: [1, 4, 8],
};

export function ActivityLogScreen() {
  return (
    <ScreenBackground accent="arcane" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Activity Journal"
          subtitle="Sport stays the heart of the game — this extends it to reading, manga, and everyday life."
        />
        {activityTypes.map((def) => (
          <ActivityCard key={def.id} def={def} />
        ))}
      </ScrollView>
    </ScreenBackground>
  );
}

function ActivityCard({ def }: { def: ActivityTypeDef }) {
  const today = localDateIso();
  const loggedToday = useActivityStore((s) => s.loggedToday(today, def.id));
  const logActivity = useLogActivity();
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleLog = (amount: number) => {
    const result = logActivity(def.id, amount);
    if (!result || result.acceptedUnits <= 0) {
      setFeedback("Daily cap reached.");
      return;
    }
    setFeedback(`+${result.xpEarned} XP`);
  };

  const capReached = loggedToday >= def.dailyUnitCap;

  return (
    <GlassPanel glow="arcane" style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name={def.icon} size={18} color={colors.arcane[200]} />
        <Text style={styles.cardTitle}>{def.label}</Text>
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
      </View>
      <Text style={styles.cardDescription}>{def.description}</Text>
      <StatBar label="Today" value={Math.min(loggedToday, def.dailyUnitCap)} max={def.dailyUnitCap} accent="arcane" />
      <View style={styles.quickRow}>
        {QUICK_AMOUNTS[def.unit].map((amount) => (
          <GlowButton
            key={amount}
            label={`+${amount} ${def.unit === "minutes" ? "min" : def.unit}`}
            variant="ghost"
            size="md"
            disabled={capReached}
            onPress={() => handleLog(amount)}
          />
        ))}
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 14 },
  card: { padding: 16, gap: 10 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white, flex: 1 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300] },
  cardDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  quickRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
});
