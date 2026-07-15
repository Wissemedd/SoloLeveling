import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CinematicIntroScreen } from "@/features/onboarding/screens/CinematicIntroScreen";
import { HunterCreationScreen } from "@/features/onboarding/screens/HunterCreationScreen";
import type { OnboardingStackParamList } from "./types";

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CinematicIntro" component={CinematicIntroScreen} />
      <Stack.Screen name="HunterCreation" component={HunterCreationScreen} />
    </Stack.Navigator>
  );
}
