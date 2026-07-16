import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/design-system/theme";
import { HomeStackNavigator } from "./HomeStackNavigator";
import { WorkoutsStackNavigator } from "./WorkoutsStackNavigator";
import { MissionsScreen } from "@/features/missions/screens/MissionsScreen";
import { AchievementsScreen } from "@/features/achievements/screens/AchievementsScreen";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Workouts: "barbell",
  Missions: "flag",
  Achievements: "trophy",
  Profile: "person-circle",
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.neon[300],
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />,
        tabBarIcon: ({ color, size, focused }) => (
          <Ionicons
            name={focused ? ICONS[route.name] : (`${ICONS[route.name]}-outline` as keyof typeof Ionicons.glyphMap)}
            size={size}
            color={color}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Workouts" component={WorkoutsStackNavigator} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Achievements" component={AchievementsScreen} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
  },
});
