import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Orbitron_700Bold,
  Orbitron_900Black,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@/design-system/theme/typography";
import { colors } from "@/design-system/theme";
import { AppProviders } from "@/app/providers/AppProviders";
import { RootNavigator } from "@/app/navigation/RootNavigator";
import { useStoresHydrated } from "@/lib/storage/useStoresHydrated";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useWorkoutStore } from "@/features/workouts/store/workoutStore";
import { useMissionStore } from "@/features/missions/store/missionStore";
import { useRewardsStore } from "@/features/rewards/store/rewardsStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useBossStore } from "@/features/bosses/store/bossStore";
import { useActivityStore } from "@/features/activities/store/activityStore";
import { useCharacterStore } from "@/features/character/store/characterStore";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { useBestiaryStore } from "@/features/monsters/store/bestiaryStore";
import { useDungeonStore } from "@/features/dungeons/store/dungeonStore";
import { useCombatHistoryStore } from "@/features/combat/store/combatHistoryStore";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Orbitron_700Bold,
    Orbitron_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const storesHydrated = useStoresHydrated([
    usePlayerStore,
    useWorkoutStore,
    useMissionStore,
    useRewardsStore,
    useAchievementStore,
    useLifetimeStatsStore,
    useBossStore,
    useActivityStore,
    useCharacterStore,
    useInventoryStore,
    useBestiaryStore,
    useDungeonStore,
    useCombatHistoryStore,
  ]);

  const ready = fontsLoaded && storesHydrated;

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <View style={styles.flex} onLayout={onLayoutRootView}>
      <AppProviders>
        <RootNavigator />
      </AppProviders>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.void.DEFAULT },
});
