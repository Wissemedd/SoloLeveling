import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ScreenBackground, GlassPanel, StatBar, GlowButton, Chip, ProgressRing } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { MainTabParamList } from "@/app/navigation/types";
import { useBossStore } from "../store/bossStore";
import { bossCycleEnd, currentWeekBoss, healthRemaining, isDefeated } from "../engine/bossEngine";

export function BossScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const damageDealt = useBossStore((s) => s.damageDealt);
  const boss = useMemo(() => currentWeekBoss(), []);
  const remaining = healthRemaining(boss, damageDealt);
  const defeated = isDefeated(boss, damageDealt);
  const daysLeft = Math.max(0, Math.ceil((bossCycleEnd().getTime() - Date.now()) / 86_400_000));

  return (
    <ScreenBackground accent="danger" particles>
      <ScrollView contentContainerStyle={styles.content}>
        <Chip label={defeated ? "Defeated" : "Weekly Boss Active"} tier={defeated ? "legendary" : "epic"} />

        <View style={styles.ringWrap}>
          <ProgressRing
            progress={1 - remaining / boss.maxHealth}
            size={180}
            strokeWidth={14}
            color={defeated ? colors.gold[300] : colors.danger[400]}
            centerLabel={defeated ? "Defeated" : `${remaining}`}
            centerSub={defeated ? undefined : "HP remaining"}
          />
        </View>

        <Text style={styles.name}>{boss.name}</Text>
        <Text style={styles.title}>{boss.title}</Text>
        <Text style={styles.description}>{boss.description}</Text>

        <GlassPanel glow={defeated ? "gold" : "danger"} style={styles.panel}>
          <StatBar
            label="Boss Health"
            value={remaining}
            max={boss.maxHealth}
            accent={defeated ? "gold" : "danger"}
          />
          <Text style={styles.hint}>
            {defeated
              ? "The gate has closed. A legendary chest awaits in your next victory."
              : `Every completed workout deals damage. ${daysLeft} day${daysLeft === 1 ? "" : "s"} left this cycle.`}
          </Text>
        </GlassPanel>

        <GlowButton
          label={defeated ? "Return to Training" : "Deal Damage — Start a Workout"}
          variant="danger"
          size="lg"
          onPress={() => navigation.navigate("Workouts", { screen: "Library" })}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 48, alignItems: "center", gap: 10 },
  ringWrap: { marginVertical: 20 },
  name: { fontFamily: fonts.display, fontSize: 24, color: colors.white, textAlign: "center" },
  title: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.danger[300], marginBottom: 8 },
  description: { fontFamily: fonts.body, fontSize: 14, color: colors.slate, textAlign: "center", lineHeight: 20, marginBottom: 16 },
  panel: { width: "100%", padding: 18, gap: 10 },
  hint: { fontFamily: fonts.body, fontSize: 12, color: colors.slate, lineHeight: 17 },
  cta: { width: "100%", marginTop: 20 },
});
