import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { colors } from "@/design-system/theme";

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.void.DEFAULT,
    card: colors.abyss[400],
    border: "rgba(255,255,255,0.08)",
    primary: colors.neon[300],
    text: colors.white,
  },
};

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navigationTheme}>{children}</NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
