import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WorkoutLibraryScreen } from "@/features/workouts/screens/WorkoutLibraryScreen";
import { WorkoutDetailScreen } from "@/features/workouts/screens/WorkoutDetailScreen";
import { WorkoutSessionScreen } from "@/features/workouts/screens/WorkoutSessionScreen";
import { WorkoutResultsScreen } from "@/features/workouts/screens/WorkoutResultsScreen";
import type { WorkoutsStackParamList } from "./types";

const Stack = createNativeStackNavigator<WorkoutsStackParamList>();

export function WorkoutsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Library" component={WorkoutLibraryScreen} />
      <Stack.Screen name="Detail" component={WorkoutDetailScreen} options={{ headerShown: true, headerTransparent: true, title: "" }} />
      <Stack.Screen name="Session" component={WorkoutSessionScreen} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Results" component={WorkoutResultsScreen} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
