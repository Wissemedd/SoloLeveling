import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { GlassPanel, StatBar } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import { useHealthStore, type HealthConnectionStatus } from "../store/healthStore";
import { useSyncSteps } from "../hooks/useSyncSteps";
import { stepsToDistanceKm } from "../engine/stepsEngine";

const DAILY_STEP_GOAL = 8000;

const STATUS_COPY: Partial<Record<HealthConnectionStatus, string>> = {
  "needs-update": "Update the Health Connect app to resume syncing steps.",
  unavailable: "Install Health Connect to sync Samsung Health steps here.",
  "unsupported-platform": "Pedometer sync needs Android + Health Connect.",
};

/**
 * Samsung Health steps flow into the OS-level Health Connect hub — this
 * widget reads from that hub, so it works for Samsung Health, Google Fit,
 * or any other app that writes steps into it. See docs/ARCHITECTURE.md.
 */
export function StepsWidget() {
  const status = useHealthStore((s) => s.status);
  const todaySteps = useHealthStore((s) => s.todaySteps);
  const refreshStatus = useHealthStore((s) => s.refreshStatus);
  const connect = useHealthStore((s) => s.connect);
  const syncSteps = useSyncSteps();
  const [busy, setBusy] = useState(false);
  const [lastXp, setLastXp] = useState<number | null>(null);

  useEffect(() => {
    refreshStatus().catch(() => {});
  }, [refreshStatus]);

  useEffect(() => {
    if (status !== "connected") return;
    syncSteps()
      .then((summary) => setLastXp(summary && summary.xpEarned > 0 ? summary.xpEarned : null))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleConnect = async () => {
    setBusy(true);
    try {
      await connect();
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const summary = await syncSteps();
      setLastXp(summary && summary.xpEarned > 0 ? summary.xpEarned : null);
    } finally {
      setBusy(false);
    }
  };

  if (status === "connected") {
    const km = stepsToDistanceKm(todaySteps);
    return (
      <Pressable onPress={handleRefresh} disabled={busy}>
        <GlassPanel glow="neon" style={styles.panel}>
          <View style={styles.headerRow}>
            <Ionicons name="footsteps-outline" size={20} color={colors.neon[300]} />
            <Text style={styles.title}>Today's Steps</Text>
            {busy ? <ActivityIndicator color={colors.neon[300]} size="small" /> : <Text style={styles.source}>Samsung Health</Text>}
          </View>
          <Text style={styles.stepsValue}>{todaySteps.toLocaleString()}</Text>
          <Text style={styles.subLabel}>
            {km.toFixed(2)} km covered{lastXp ? ` · +${lastXp} XP earned` : ""}
          </Text>
          <StatBar label="Daily Goal" value={Math.min(todaySteps, DAILY_STEP_GOAL)} max={DAILY_STEP_GOAL} accent="neon" height={6} />
        </GlassPanel>
      </Pressable>
    );
  }

  return (
    <GlassPanel glow="none" style={styles.panel}>
      <View style={styles.headerRow}>
        <Ionicons name="footsteps-outline" size={20} color={colors.slate} />
        <Text style={styles.title}>Pedometer</Text>
      </View>
      {status === "disconnected" ? (
        <Pressable onPress={handleConnect} disabled={busy} style={styles.connectRow}>
          {busy ? (
            <ActivityIndicator color={colors.neon[300]} size="small" />
          ) : (
            <>
              <Text style={styles.connectLabel}>Connect Samsung Health</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.slate} />
            </>
          )}
        </Pressable>
      ) : (
        <Text style={styles.subLabel}>{STATUS_COPY[status] ?? "Pedometer unavailable on this device."}</Text>
      )}
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  panel: { marginHorizontal: 20, marginTop: 20, padding: 16, gap: 10 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontFamily: fonts.bodySemibold, fontSize: 13, color: colors.white, flex: 1 },
  source: { fontFamily: fonts.body, fontSize: 10, color: colors.slate, textTransform: "uppercase", letterSpacing: 0.5 },
  stepsValue: { fontFamily: fonts.display, fontSize: 28, color: colors.white },
  subLabel: { fontFamily: fonts.body, fontSize: 11, color: colors.slate },
  connectRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 4 },
  connectLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.neon[300] },
});
