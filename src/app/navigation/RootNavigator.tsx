import React from "react";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { OnboardingNavigator } from "./OnboardingNavigator";
import { MainTabNavigator } from "./MainTabNavigator";

/** Swaps between onboarding and the main app the instant createHunter() sets isOnboarded. */
export function RootNavigator() {
  const isOnboarded = usePlayerStore((s) => s.isOnboarded);
  return isOnboarded ? <MainTabNavigator /> : <OnboardingNavigator />;
}
