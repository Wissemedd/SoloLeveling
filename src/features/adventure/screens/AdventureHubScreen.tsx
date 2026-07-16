import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, SectionHeader } from "@/design-system/components";
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

  const equippedSlots = Object.fromEntries(EQUIPMENT_SLOT_IDS.map((slot) => [slot, !!equipped[slot]]));

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
        <MenuRow icon="map" label="World Map" onPress={() => navigation.navigate("WorldMap")} />
        <MenuRow icon="person" label="Character" onPress={() => navigation.navigate("Character")} />
        <MenuRow icon="flash" label="Skills" onPress={() => navigation.navigate("Skills")} />
        <MenuRow icon="briefcase" label="Inventory" onPress={() => navigation.navigate("Inventory")} />
        <MenuRow icon="storefront" label="Shop" onPress={() => navigation.navigate("Shop")} />
        <MenuRow icon="construct" label="Forge" onPress={() => navigation.navigate("Forge")} />
        <MenuRow icon="book" label="Bestiary" onPress={() => navigation.navigate("Bestiary")} />
        <MenuRow icon="time" label="Combat History" onPress={() => navigation.navigate("CombatHistory")} />
        <MenuRow icon="podium" label="Leaderboard" onPress={() => navigation.navigate("Leaderboard")} />
        <MenuRow icon="people" label="Guild" onPress={() => navigation.navigate("Guild")} />
      </ScrollView>
    </ScreenBackground>
  );
}

function MenuRow({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <GlassPanel glow="none" style={styles.menuRow}>
        <Ionicons name={icon} size={18} color={colors.arcane[200]} />
        <Text style={styles.menuLabel}>{label}</Text>
        <Ionicons name="chevron-forward" size={16} color={colors.slate} />
      </GlassPanel>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 8 },
  headerText: { flex: 1 },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  meta: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate, marginTop: 2 },
  menuRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  menuLabel: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.white, flex: 1 },
});
