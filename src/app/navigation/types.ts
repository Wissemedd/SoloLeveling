import type { NavigatorScreenParams } from "@react-navigation/native";
import type { CompleteWorkoutSummary } from "@/features/workouts/hooks/useCompleteWorkout";

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
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Workouts: NavigatorScreenParams<WorkoutsStackParamList>;
  Missions: undefined;
  Achievements: undefined;
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
