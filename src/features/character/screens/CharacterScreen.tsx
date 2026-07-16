import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, GlowButton, StatTile } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { getItemDefinition } from "@/features/inventory/data/items";
import { totalEquipmentBonuses } from "@/features/inventory/engine/inventoryEngine";
import { EQUIPMENT_SLOT_IDS } from "@/features/inventory/types";
import { useCharacterStore } from "../store/characterStore";
import { AvatarSilhouette } from "../components/AvatarSilhouette";
import { CharacterEditorForm } from "../components/CharacterEditorForm";

const SLOT_LABELS: Record<string, string> = {
  weapon: "Weapon",
  helmet: "Helmet",
  armor: "Armor",
  gloves: "Gloves",
  boots: "Boots",
  ring: "Ring",
  necklace: "Necklace",
};

export function CharacterScreen() {
  const rank = usePlayerStore((s) => s.rank);
  const name = useCharacterStore((s) => s.name);
  const appearance = useCharacterStore((s) => s.appearance);
  const updateAppearance = useCharacterStore((s) => s.updateAppearance);
  const equipped = useInventoryStore((s) => s.equipped);
  const owned = useInventoryStore((s) => s.owned);
  const unequip = useInventoryStore((s) => s.unequip);

  const [editing, setEditing] = useState(false);

  const equippedSlots = useMemo(
    () => Object.fromEntries(EQUIPMENT_SLOT_IDS.map((slot) => [slot, !!equipped[slot]])),
    [equipped],
  );

  const bonuses = useMemo(
    () =>
      totalEquipmentBonuses(equipped, (instanceId) => {
        const instance = owned.find((i) => i.instanceId === instanceId);
        if (!instance) return undefined;
        const def = getItemDefinition(instance.itemId);
        return def ? { def, upgradeLevel: instance.upgradeLevel } : undefined;
      }),
    [equipped, owned],
  );

  return (
    <ScreenBackground accent="arcane" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.previewWrap}>
          <AvatarSilhouette appearance={appearance} rank={rank} equippedSlots={equippedSlots} size={200} />
          <Text style={styles.name}>{name || "Hunter"}</Text>
        </View>

        <SectionHeader title="Combat Power" subtitle="From equipped gear only — never from your real stats." />
        <GlassPanel glow="arcane" style={styles.panel}>
          <View style={styles.bonusGrid}>
            <StatTile label="Attack" value={bonuses.attackPower} style={styles.bonusTile} />
            <StatTile label="Defense" value={bonuses.defense} style={styles.bonusTile} />
            <StatTile label="Crit" value={`${Math.round(bonuses.critChance * 100)}%`} style={styles.bonusTile} />
            <StatTile label="Dodge" value={`${Math.round(bonuses.dodgeChance * 100)}%`} style={styles.bonusTile} />
            <StatTile label="Elemental" value={bonuses.elementalPower} style={styles.bonusTile} />
          </View>
        </GlassPanel>

        <SectionHeader title="Equipment" />
        {EQUIPMENT_SLOT_IDS.map((slot) => {
          const instanceId = equipped[slot];
          const instance = instanceId ? owned.find((i) => i.instanceId === instanceId) : undefined;
          const def = instance ? getItemDefinition(instance.itemId) : undefined;
          return (
            <Pressable key={slot} onPress={() => (instanceId ? unequip(slot) : undefined)}>
              <GlassPanel glow="none" style={styles.slotRow}>
                <Ionicons name={def?.icon ?? "ellipse-outline"} size={18} color={def ? colors.arcane[200] : colors.slate} />
                <View style={styles.slotTextCol}>
                  <Text style={styles.slotLabel}>{SLOT_LABELS[slot]}</Text>
                  <Text style={styles.slotValue}>{def ? `${def.name}${instance && instance.upgradeLevel > 0 ? ` +${instance.upgradeLevel}` : ""}` : "Empty"}</Text>
                </View>
                {def ? <Text style={styles.unequipHint}>Tap to unequip</Text> : null}
              </GlassPanel>
            </Pressable>
          );
        })}

        <SectionHeader title="Appearance" action={<Pressable onPress={() => setEditing((v) => !v)}><Text style={styles.editToggle}>{editing ? "Done" : "Edit"}</Text></Pressable>} />
        {editing ? (
          <>
            <CharacterEditorForm appearance={appearance} onChange={updateAppearance} />
            <GlowButton label="Save appearance" variant="arcane" onPress={() => setEditing(false)} style={styles.saveButton} />
          </>
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 12 },
  previewWrap: { alignItems: "center", paddingVertical: 8, gap: 6 },
  name: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  panel: { padding: 16 },
  bonusGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  bonusTile: { minWidth: 64 },
  slotRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, marginBottom: 8 },
  slotTextCol: { flex: 1 },
  slotLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  slotValue: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.white },
  unequipHint: { fontFamily: fonts.body, fontSize: 10, color: colors.slate },
  editToggle: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.arcane[200] },
  saveButton: { marginTop: 4, marginBottom: 12 },
});
