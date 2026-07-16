import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { ClassEvolutionScreen } from "@/features/classes/screens/ClassEvolutionScreen";
import { AchievementsScreen } from "@/features/achievements/screens/AchievementsScreen";
import { ActivityLogScreen } from "@/features/activities/screens/ActivityLogScreen";
import type { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const HEADER_SCREEN_OPTIONS = { headerShown: true, headerTransparent: true, title: "" } as const;

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen name="ClassEvolution" component={ClassEvolutionScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="ActivityLog" component={ActivityLogScreen} options={HEADER_SCREEN_OPTIONS} />
    </Stack.Navigator>
  );
}
