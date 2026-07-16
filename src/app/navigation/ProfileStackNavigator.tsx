import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
import { ClassEvolutionScreen } from "@/features/classes/screens/ClassEvolutionScreen";
import type { ProfileStackParamList } from "./types";

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileHome" component={ProfileScreen} />
      <Stack.Screen
        name="ClassEvolution"
        component={ClassEvolutionScreen}
        options={{ headerShown: true, headerTransparent: true, title: "" }}
      />
    </Stack.Navigator>
  );
}
