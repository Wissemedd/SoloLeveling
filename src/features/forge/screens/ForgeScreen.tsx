import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenBackground, GlassPanel, SectionHeader, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useAchievementStore } from "@/features/achievements/store/achievementStore";
import { deriveLifetimeStats } from "@/features/achievements/engine/deriveLifetimeStats";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { getItemDefinition } from "@/features/inventory/data/items";
import { attemptForge, forgeCostForLevel, forgeSuccessChance, FORGE_MAX_LEVEL } from "../engine/forgeEngine";

export function ForgeScreen() {
  const gold = usePlayerStore((s) => s.gold);
  const addGold = usePlayerStore((s) => s.addGold);
  const level = usePlayerStore((s) => s.level);
  const streak = usePlayerStore((s) => s.streak);
  const owned = useInventoryStore((s) => s.owned);
  const setUpgradeLevel = useInventoryStore((s) => s.setUpgradeLevel);
  const removeInstance = useInventoryStore((s) => s.removeInstance);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const counters = useLifetimeStatsStore((s) => s.counters);
  const evaluateAchievements = useAchievementStore((s) => s.evaluate);

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const upgradeable = owned.filter((i) => getItemDefinition(i.itemId)?.upgradeable);
  const selected = upgradeable.find((i) => i.instanceId === selectedInstanceId) ?? upgradeable[0];
  const selectedDef = selected ? getItemDefinition(selected.itemId) : undefined;

  const cost = selected ? forgeCostForLevel(selected.upgradeLevel) : null;
  const materialOwned = cost ? owned.find((i) => i.itemId === cost.materialItemId)?.quantity ?? 0 : 0;
  const canAfford = cost ? gold >= cost.gold && materialOwned >= cost.materialQuantity : false;
  const atMax = selected ? selected.upgradeLevel >= FORGE_MAX_LEVEL : true;

  const handleUpgrade = () => {
    if (!selected || !cost || !canAfford || atMax) return;
    const result = attemptForge(selected.upgradeLevel);
    addGold(-cost.gold);
    const materialInstance = owned.find((i) => i.itemId === cost.materialItemId);
    if (materialInstance) removeInstance(materialInstance.instanceId, cost.materialQuantity);
    if (result.success) setUpgradeLevel(selected.instanceId, result.newLevel);
    recordLifetime({ totalItemsCrafted: 1 });
    setFeedback(result.success ? `Upgrade succeeded — now +${result.newLevel}.` : "The upgrade failed. Materials were consumed.");
    evaluateAchievements(deriveLifetimeStats(counters, level, streak.longest));
  };

  return (
    <ScreenBackground accent="danger" particles={false}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionHeader title="The Forge" subtitle="Guaranteed through +5. Past that, it's a gamble." />
        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        {upgradeable.length === 0 ? (
          <Text style={styles.emptyText}>No upgradeable equipment yet — clear a Gate first.</Text>
        ) : (
          <View style={styles.itemList}>
            {upgradeable.map((instance) => {
              const def = getItemDefinition(instance.itemId);
              if (!def) return null;
              const active = instance.instanceId === selected?.instanceId;
              return (
                <Pressable key={instance.instanceId} onPress={() => setSelectedInstanceId(instance.instanceId)}>
                  <GlassPanel glow={active ? "danger" : "none"} style={styles.itemRow}>
                    <Ionicons name={def.icon} size={18} color={active ? colors.danger[300] : colors.slate} />
                    <Text style={styles.itemLabel}>
                      {def.name} {instance.upgradeLevel > 0 ? `+${instance.upgradeLevel}` : ""}
                    </Text>
                  </GlassPanel>
                </Pressable>
              );
            })}
          </View>
        )}

        {selected && selectedDef && cost ? (
          <GlassPanel glow="danger" style={styles.panel}>
            <Text style={styles.panelTitle}>
              {selectedDef.name} +{selected.upgradeLevel} → +{Math.min(selected.upgradeLevel + 1, FORGE_MAX_LEVEL)}
            </Text>
            <Text style={styles.panelLine}>Success chance: {Math.round(forgeSuccessChance(selected.upgradeLevel) * 100)}%</Text>
            <Text style={styles.panelLine}>
              Cost: {cost.gold} gold · {cost.materialQuantity}× {getItemDefinition(cost.materialItemId)?.name} (owned {materialOwned})
            </Text>
            <GlowButton
              label={atMax ? "Max level reached" : "Upgrade"}
              variant="danger"
              disabled={atMax || !canAfford}
              onPress={handleUpgrade}
              style={styles.upgradeButton}
            />
          </GlassPanel>
        ) : null}
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 12 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300] },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  itemList: { gap: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  itemLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.white },
  panel: { padding: 16, gap: 6 },
  panelTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  panelLine: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  upgradeButton: { marginTop: 8 },
});
