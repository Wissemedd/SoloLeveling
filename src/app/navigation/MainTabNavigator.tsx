import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/design-system/theme";
import { HomeStackNavigator } from "./HomeStackNavigator";
import { WorkoutsStackNavigator } from "./WorkoutsStackNavigator";
import { MissionsScreen } from "@/features/missions/screens/MissionsScreen";
import { AdventureStackNavigator } from "./AdventureStackNavigator";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import type { MainTabParamList } from "./types";

const Tab = createBottomTabNavigator<MainTabParamList>();

/** Android Material bottom-nav content height baseline (icon + label), before adding the safe-area inset. */
const TAB_BAR_CONTENT_HEIGHT = 56;
const TAB_BAR_BREATHING_ROOM = 8;

const ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: "home",
  Workouts: "barbell",
  Missions: "flag",
  Adventure: "flash",
  Profile: "person-circle",
};

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  const tabBarStyle = useMemo(
    () => ({
      ...StyleSheet.flatten(styles.tabBar),
      height: TAB_BAR_CONTENT_HEIGHT + insets.bottom + TAB_BAR_BREATHING_ROOM,
      paddingBottom: insets.bottom + TAB_BAR_BREATHING_ROOM,
    }),
    [insets.bottom],
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.neon[300],
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle,
        tabBarBackground: () => <BlurView intensity={40} tint="dark" pointerEvents="none" style={StyleSheet.absoluteFill} />,
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
      <Tab.Screen name="Adventure" component={AdventureStackNavigator} />
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
    paddingTop: 8,
  },
});
