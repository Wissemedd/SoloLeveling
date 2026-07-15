import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CommandCenterScreen } from "@/features/home/screens/CommandCenterScreen";
import { BossScreen } from "@/features/bosses/screens/BossScreen";
import type { HomeStackParamList } from "./types";

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CommandCenter" component={CommandCenterScreen} />
      <Stack.Screen name="Boss" component={BossScreen} options={{ headerShown: true, headerTransparent: true, title: "" }} />
    </Stack.Navigator>
  );
}
