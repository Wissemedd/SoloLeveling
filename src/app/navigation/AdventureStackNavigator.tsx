import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useCharacterStore } from "@/features/character/store/characterStore";
import { AdventureHubScreen } from "@/features/adventure/screens/AdventureHubScreen";
import { CharacterCreationScreen } from "@/features/character/screens/CharacterCreationScreen";
import { CharacterScreen } from "@/features/character/screens/CharacterScreen";
import { WorldMapScreen } from "@/features/dungeons/screens/WorldMapScreen";
import { GateListScreen } from "@/features/dungeons/screens/GateListScreen";
import { GateDetailScreen } from "@/features/dungeons/screens/GateDetailScreen";
import { CombatScreen } from "@/features/combat/screens/CombatScreen";
import { CombatResultsScreen } from "@/features/combat/screens/CombatResultsScreen";
import { CombatHistoryScreen } from "@/features/combat/screens/CombatHistoryScreen";
import { InventoryScreen } from "@/features/inventory/screens/InventoryScreen";
import { ShopScreen } from "@/features/shop/screens/ShopScreen";
import { ForgeScreen } from "@/features/forge/screens/ForgeScreen";
import { SkillsScreen } from "@/features/skills/screens/SkillsScreen";
import { BestiaryScreen } from "@/features/monsters/screens/BestiaryScreen";
import { LeaderboardScreen } from "@/features/adventure/screens/LeaderboardScreen";
import { GuildScreen } from "@/features/adventure/screens/GuildScreen";
import type { AdventureStackParamList } from "./types";

const Stack = createNativeStackNavigator<AdventureStackParamList>();

const HEADER_SCREEN_OPTIONS = { headerShown: true, headerTransparent: true, title: "" } as const;

export function AdventureStackNavigator() {
  const isCharacterCreated = useCharacterStore((s) => s.isCreated);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={isCharacterCreated ? "Hub" : "CharacterCreation"}
    >
      <Stack.Screen name="Hub" component={AdventureHubScreen} />
      <Stack.Screen name="CharacterCreation" component={CharacterCreationScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="WorldMap" component={WorldMapScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="GateList" component={GateListScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="GateDetail" component={GateDetailScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Combat" component={CombatScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="CombatResults" component={CombatResultsScreen} options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="Inventory" component={InventoryScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Shop" component={ShopScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Forge" component={ForgeScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Skills" component={SkillsScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Bestiary" component={BestiaryScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="CombatHistory" component={CombatHistoryScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={HEADER_SCREEN_OPTIONS} />
      <Stack.Screen name="Guild" component={GuildScreen} options={HEADER_SCREEN_OPTIONS} />
    </Stack.Navigator>
  );
}
