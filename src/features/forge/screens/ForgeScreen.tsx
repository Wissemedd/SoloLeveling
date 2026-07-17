import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { ScreenBackground, GlassPanel, SectionHeader, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useLifetimeStatsStore } from "@/features/player/store/lifetimeStatsStore";
import { useEvaluateProgressionRewards } from "@/features/achievements/hooks/useEvaluateProgressionRewards";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { getItemDefinition } from "@/features/inventory/data/items";
import { ItemIcon } from "@/features/inventory/components/ItemIcon";
import type { InventoryItemInstance } from "@/features/inventory/types";
import { attemptForge, forgeCostForLevel, forgeSuccessChance, FORGE_MAX_LEVEL } from "../engine/forgeEngine";

export function ForgeScreen() {
  const gold = usePlayerStore((s) => s.gold);
  const addGold = usePlayerStore((s) => s.addGold);
  const level = usePlayerStore((s) => s.level);
  const owned = useInventoryStore((s) => s.owned);
  const setUpgradeLevel = useInventoryStore((s) => s.setUpgradeLevel);
  const removeInstance = useInventoryStore((s) => s.removeInstance);
  const recordLifetime = useLifetimeStatsStore((s) => s.record);
  const evaluateProgressionRewards = useEvaluateProgressionRewards();

  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // `owned` grows unboundedly over a save's lifetime — filter once here and
  // let FlatList virtualize rendering instead of a ScrollView rendering
  // every upgradeable item up front.
  const upgradeable = useMemo(() => owned.filter((i) => getItemDefinition(i.itemId)?.upgradeable), [owned]);
  const selected = useMemo(
    () => upgradeable.find((i) => i.instanceId === selectedInstanceId) ?? upgradeable[0],
    [upgradeable, selectedInstanceId],
  );
  const selectedDef = selected ? getItemDefinition(selected.itemId) : undefined;

  const cost = selected ? forgeCostForLevel(selected.upgradeLevel) : null;
  const materialOwned = useMemo(
    () => (cost ? owned.find((i) => i.itemId === cost.materialItemId)?.quantity ?? 0 : 0),
    [owned, cost],
  );
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
    evaluateProgressionRewards();
  };

  const handleSelect = useCallback((instanceId: string) => setSelectedInstanceId(instanceId), []);

  return (
    <ScreenBackground accent="danger" particles={false}>
      <FlatList
        contentContainerStyle={styles.content}
        data={upgradeable}
        keyExtractor={(item) => item.instanceId}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <SectionHeader title="The Forge" subtitle="Guaranteed through +5. Past that, it's a gamble." />
            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
            {upgradeable.length === 0 ? <Text style={styles.emptyText}>No upgradeable equipment yet — clear a Gate first.</Text> : null}
          </>
        }
        renderItem={({ item }) => {
          const def = getItemDefinition(item.itemId);
          if (!def) return null;
          return <ForgeItemRow instance={item} isActive={item.instanceId === selected?.instanceId} onSelect={handleSelect} />;
        }}
        ListFooterComponent={
          selected && selectedDef && cost ? (
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
          ) : null
        }
      />
    </ScreenBackground>
  );
}

const ForgeItemRow = React.memo(function ForgeItemRow({
  instance,
  isActive,
  onSelect,
}: {
  instance: InventoryItemInstance;
  isActive: boolean;
  onSelect: (instanceId: string) => void;
}) {
  const def = getItemDefinition(instance.itemId);
  if (!def) return null;
  return (
    <Pressable onPress={() => onSelect(instance.instanceId)}>
      <GlassPanel glow={isActive ? "danger" : "none"} style={styles.itemRow}>
        <ItemIcon def={def} size={32} upgradeLevel={instance.upgradeLevel} />
        <Text style={styles.itemLabel}>
          {def.name} {instance.upgradeLevel > 0 ? `+${instance.upgradeLevel}` : ""}
        </Text>
      </GlassPanel>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 8 },
  feedback: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.neon[300] },
  emptyText: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
  itemRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, marginBottom: 8 },
  itemLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.white },
  panel: { padding: 16, gap: 6, marginTop: 4 },
  panelTitle: { fontFamily: fonts.bodySemibold, fontSize: 14, color: colors.white },
  panelLine: { fontFamily: fonts.body, fontSize: 12, color: colors.slate },
  upgradeButton: { marginTop: 8 },
});
