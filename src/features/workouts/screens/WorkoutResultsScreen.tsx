import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ScreenBackground, GlowButton, Chip, StatBar } from "@/design-system/components";
import { ChestRevealCard } from "@/features/rewards/components/ChestRevealCard";
import { playSound } from "@/features/sound/engine/soundManager";
import { colors, fonts } from "@/design-system/theme";
import type { MainTabParamList, WorkoutsStackParamList } from "@/app/navigation/types";

type Props = NativeStackScreenProps<WorkoutsStackParamList, "Results">;

export function WorkoutResultsScreen({ route }: Props) {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const { summary } = route.params;
  const { xpResult, loot, goldEarned, newlyUnlockedAchievements, bossDefeated } = summary;

  useEffect(() => {
    if (bossDefeated) playSound("boss_defeat");
    else if (xpResult.leveledUp) playSound("level_up");
    else playSound("xp_gain");
    if (loot.length > 0) playSound("chest_open");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenBackground accent={xpResult.leveledUp ? "gold" : "neon"}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Chip label="Quest Complete" tier={xpResult.leveledUp ? "legendary" : "rare"} />

        {xpResult.leveledUp ? (
          <View style={styles.levelUpBlock}>
            <Text style={styles.levelUpLabel}>LEVEL UP</Text>
            <Text style={styles.levelUpValue}>
              {xpResult.previousLevel} → {xpResult.newLevel}
            </Text>
          </View>
        ) : (
          <Text style={styles.title}>Well fought, hunter.</Text>
        )}

        {bossDefeated ? <Text style={styles.bossDefeated}>The weekly boss has fallen!</Text> : null}

        <View style={styles.xpBlock}>
          <StatBar
            label={`Level ${xpResult.newLevel}`}
            value={xpResult.xpIntoLevel}
            max={xpResult.xpForNextLevel || 1}
            accent="neon"
          />
        </View>

        <Text style={styles.sectionLabel}>Loot</Text>
        {loot.map((reward, idx) => (
          <ChestRevealCard key={reward.id} reward={reward} delayMs={idx * 120} />
        ))}

        {newlyUnlockedAchievements.length > 0 ? (
          <>
            <Text style={styles.sectionLabel}>Achievements Unlocked</Text>
            {newlyUnlockedAchievements.map((a) => (
              <View key={a.id} style={styles.achievementRow}>
                <Text style={styles.achievementTitle}>{a.title}</Text>
                <Text style={styles.achievementDescription}>{a.description}</Text>
              </View>
            ))}
          </>
        ) : null}

        <GlowButton
          label="Return to Command Center"
          variant="neon"
          size="lg"
          onPress={() => navigation.navigate("Home", { screen: "CommandCenter" })}
          style={styles.cta}
        />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48, gap: 14, alignItems: "stretch" },
  title: { fontFamily: fonts.display, fontSize: 20, color: colors.white },
  levelUpBlock: { alignItems: "center", marginVertical: 8 },
  levelUpLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.gold[300], letterSpacing: 2 },
  levelUpValue: { fontFamily: fonts.display, fontSize: 34, color: colors.gold[200] },
  bossDefeated: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.danger[300], textAlign: "center" },
  xpBlock: { marginVertical: 8 },
  sectionLabel: {
    fontFamily: fonts.bodySemibold,
    fontSize: 12,
    color: colors.slate,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginTop: 6,
  },
  achievementRow: { marginBottom: 8 },
  achievementTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.gold[200] },
  achievementDescription: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  cta: { marginTop: 12 },
});
