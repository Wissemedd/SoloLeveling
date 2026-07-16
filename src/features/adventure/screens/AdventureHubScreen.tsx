import React, { useMemo } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, SectionHeader, MenuRow } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useCharacterStore } from "@/features/character/store/characterStore";
import { AvatarSilhouette } from "@/features/character/components/AvatarSilhouette";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { EQUIPMENT_SLOT_IDS } from "@/features/inventory/types";

type Props = NativeStackScreenProps<AdventureStackParamList, "Hub">;

export function AdventureHubScreen({ navigation }: Props) {
  const rank = usePlayerStore((s) => s.rank);
  const gold = usePlayerStore((s) => s.gold);
  const energy = usePlayerStore((s) => s.energy);
  const name = useCharacterStore((s) => s.name);
  const appearance = useCharacterStore((s) => s.appearance);
  const equipped = useInventoryStore((s) => s.equipped);

  const equippedSlots = useMemo(
    () => Object.fromEntries(EQUIPMENT_SLOT_IDS.map((slot) => [slot, !!equipped[slot]])),
    [equipped],
  );

  return (
    <ScreenBackground accent="arcane">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.navigate("Character")} style={styles.headerRow}>
          <AvatarSilhouette appearance={appearance} rank={rank} equippedSlots={equippedSlots} size={96} breathing={false} />
          <View style={styles.headerText}>
            <Text style={styles.name}>{name || "Hunter"}</Text>
            <Text style={styles.meta}>
              Rank {rank} · {gold} gold · {energy} energy
            </Text>
          </View>
        </Pressable>

        <SectionHeader title="Adventure" />
        <MenuRow icon="map" label="World Map" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("WorldMap")} />
        <MenuRow icon="person" label="Character" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Character")} />
        <MenuRow icon="flash" label="Skills" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Skills")} />
        <MenuRow icon="briefcase" label="Inventory" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Inventory")} />
        <MenuRow icon="storefront" label="Shop" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Shop")} />
        <MenuRow icon="construct" label="Forge" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Forge")} />
        <MenuRow icon="book" label="Bestiary" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Bestiary")} />
        <MenuRow icon="time" label="Combat History" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("CombatHistory")} />
        <MenuRow icon="podium" label="Leaderboard" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Leaderboard")} />
        <MenuRow icon="people" label="Guild" iconColor={colors.arcane[200]} onPress={() => navigation.navigate("Guild")} />
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 8 },
  headerText: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate, marginTop: 2 },
});
