import type { NavigatorScreenParams } from "@react-navigation/native";
import type { CompleteWorkoutSummary } from "@/features/workouts/hooks/useCompleteWorkout";
import type { RunGateSummary } from "@/features/combat/hooks/useFinalizeGateRun";
import type { Gate } from "@/features/dungeons/types";

export type OnboardingStackParamList = {
  CinematicIntro: undefined;
  HunterCreation: undefined;
};

export type HomeStackParamList = {
  CommandCenter: undefined;
  Boss: undefined;
};

export type WorkoutsStackParamList = {
  Library: undefined;
  Detail: { workoutId: string };
  Session: { workoutId: string };
  Results: { workoutId: string; summary: CompleteWorkoutSummary };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  ClassEvolution: undefined;
  Achievements: undefined;
  ActivityLog: undefined;
};

/**
 * The Aventure tab — Gates/combat never write XP or RpgStats (see
 * combat/hooks/usePrepareGateRun.ts and useFinalizeGateRun.ts); this stack
 * is purely a reward/visualization layer on top of the real progression in
 * player/workouts/activities.
 */
export type AdventureStackParamList = {
  Hub: undefined;
  CharacterCreation: undefined;
  Character: undefined;
  WorldMap: undefined;
  GateList: { regionId: string };
  GateDetail: { gateId: string; regionId: string };
  Combat: { gate: Gate };
  CombatResults: { summary: RunGateSummary };
  Inventory: undefined;
  Shop: undefined;
  Forge: undefined;
  Skills: undefined;
  Bestiary: undefined;
  CombatHistory: undefined;
  Leaderboard: undefined;
  Guild: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Workouts: NavigatorScreenParams<WorkoutsStackParamList>;
  Missions: undefined;
  Adventure: NavigatorScreenParams<AdventureStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
