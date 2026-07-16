import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { ScreenBackground } from "@/design-system/components";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { getStreakStatus } from "@/features/player/engine/streakEngine";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useWorkoutStore } from "@/features/workouts/store/workoutStore";
import { useBossStore } from "@/features/bosses/store/bossStore";
import type { HomeStackParamList, MainTabParamList } from "@/app/navigation/types";
import { HunterHeader } from "../components/HunterHeader";
import { StreakEnergyRow } from "../components/StreakEnergyRow";
import { TodayQuestCard } from "../components/TodayQuestCard";
import { StatsGrid } from "../components/StatsGrid";
import { WeeklyProgressStrip } from "../components/WeeklyProgressStrip";
import { BossBanner } from "../components/BossBanner";
import { UtilityWidgetsRow } from "../components/UtilityWidgetsRow";
import { DailyQuoteCard } from "../components/DailyQuoteCard";
import { CoachTipCard } from "@/features/ai-coach/components/CoachTipCard";
import { scheduleStreakAtRiskNudge } from "@/features/notifications/engine/notificationScheduler";
import { StepsWidget } from "@/features/health/components/StepsWidget";

type Props = NativeStackScreenProps<HomeStackParamList, "CommandCenter">;

export function CommandCenterScreen({ navigation }: Props) {
  const tabNavigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();

  const profile = usePlayerStore((s) => s.profile);
  const rank = usePlayerStore((s) => s.rank);
  const level = usePlayerStore((s) => s.level);
  const xp = usePlayerStore((s) => s.xp);
  const stats = usePlayerStore((s) => s.stats);
  const streak = usePlayerStore((s) => s.streak);
  const energy = usePlayerStore((s) => s.energy);
  const activeTitle = usePlayerStore((s) => s.activeTitle);
  const reconcileStreakOnOpen = usePlayerStore((s) => s.reconcileStreakOnOpen);
  const reconcileEnergyOnOpen = usePlayerStore((s) => s.reconcileEnergyOnOpen);

  const missions = useMissionStore((s) => s.active);
  const refreshBoard = useMissionStore((s) => s.refreshBoard);

  const history = useWorkoutStore((s) => s.history);
  const bossDamage = useBossStore((s) => s.damageDealt);
  const syncBossWeek = useBossStore((s) => s.syncWeek);

  useEffect(() => {
    reconcileStreakOnOpen();
    reconcileEnergyOnOpen();
    refreshBoard();
    syncBossWeek();
  }, [reconcileStreakOnOpen, reconcileEnergyOnOpen, refreshBoard, syncBossWeek]);

  const todaysQuest = missions.find((m) => m.period === "daily" && !m.completedAt) ?? null;
  const streakStatus = getStreakStatus(streak);

  useEffect(() => {
    if (streakStatus.isAtRisk) scheduleStreakAtRiskNudge().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakStatus.isAtRisk]);

  const daysSinceLastWorkout = history[0]
    ? Math.floor((Date.now() - new Date(history[0].completedAt).getTime()) / 86_400_000)
    : null;
  const workoutsInLast7Days = history.filter(
    (h) => Date.now() - new Date(h.completedAt).getTime() < 7 * 86_400_000,
  ).length;

  return (
    <ScreenBackground accent="neon">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HunterHeader
          name={profile?.name ?? "Hunter"}
          rank={rank}
          level={level}
          totalXp={xp}
          title={activeTitle}
          onPressProfile={() => tabNavigation.navigate("Profile", { screen: "ProfileHome" })}
        />
        <StreakEnergyRow streakDays={streak.current} energy={energy} streakStatus={streakStatus} />
        <TodayQuestCard
          quest={todaysQuest}
          onPressGo={() => tabNavigation.navigate("Workouts", { screen: "Library" })}
        />
        <StatsGrid stats={stats} />
        <WeeklyProgressStrip history={history} />
        <StepsWidget />
        <BossBanner damageDealt={bossDamage} onPress={() => navigation.navigate("Boss")} />
        <CoachTipCard
          context={{
            isStreakAtRisk: streakStatus.isAtRisk,
            energy,
            daysSinceLastWorkout,
            workoutsInLast7Days,
            justLeveledUp: false,
          }}
        />
        <UtilityWidgetsRow />
        <DailyQuoteCard />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 40, gap: 18 },
});
