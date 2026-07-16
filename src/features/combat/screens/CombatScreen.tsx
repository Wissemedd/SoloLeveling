import React, { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, StatBar, GlowButton } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { useRunGate, type RunGateSummary } from "../hooks/useRunGate";
import type { CombatEvent } from "../types";

type Props = NativeStackScreenProps<AdventureStackParamList, "Combat">;

type PlaybackStep = {
  monsterName: string;
  monsterMaxHealth: number;
  event: CombatEvent;
};

function eventText(step: PlaybackStep): string {
  const { event, monsterName } = step;
  if (event.type === "dodge") return `You dodge ${monsterName}'s attack.`;
  if (event.type === "victory") return `${monsterName} is defeated!`;
  if (event.type === "defeat") return `You were defeated by ${monsterName}.`;
  if (event.actor === "character") {
    const verb = event.type === "crit" ? "critically hit" : event.type === "skill" ? `uses ${event.skillName} on` : "hits";
    return `You ${verb} ${monsterName} for ${event.damage}.`;
  }
  const verb = event.type === "crit" ? "critically hits" : "hits";
  return `${monsterName} ${verb} you for ${event.damage}.`;
}

export function CombatScreen({ route, navigation }: Props) {
  const { gate } = route.params;
  const runGate = useRunGate();
  const [summary] = useState<RunGateSummary>(() => runGate(gate));
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo<PlaybackStep[]>(() => {
    if (!summary.log) return [];
    const all: PlaybackStep[] = [];
    for (const encounter of summary.log.encounters) {
      const monster = gate.encounterMonsters.find((m) => m.id === encounter.monsterId);
      for (const event of encounter.events) all.push({ monsterName: encounter.monsterName, monsterMaxHealth: monster?.maxHealth ?? 1, event });
    }
    if (summary.log.bossEncounter) {
      for (const event of summary.log.bossEncounter.events) {
        all.push({ monsterName: summary.log.bossEncounter.monsterName, monsterMaxHealth: gate.boss.maxHealth, event });
      }
    }
    return all;
  }, [summary, gate]);

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (stepIndex >= steps.length) return;
    const timer = setTimeout(() => setStepIndex((i) => i + 1), 280);
    return () => clearTimeout(timer);
  }, [stepIndex, steps.length]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [stepIndex]);

  const visibleSteps = steps.slice(0, stepIndex);
  const playbackDone = stepIndex >= steps.length;
  const lastStep = visibleSteps[visibleSteps.length - 1];

  const characterMaxHp = summary.characterMaxHealth ?? summary.log?.finalCharacterHp ?? 1;
  const characterHp = useMemo(() => {
    for (let i = visibleSteps.length - 1; i >= 0; i--) {
      if (visibleSteps[i].event.actor === "enemy") return visibleSteps[i].event.targetHpAfter;
    }
    return characterMaxHp;
  }, [visibleSteps, characterMaxHp]);

  const currentMonster = lastStep ?? steps[0];
  const monsterHp = useMemo(() => {
    for (let i = visibleSteps.length - 1; i >= 0; i--) {
      if (visibleSteps[i].event.actor === "character" && visibleSteps[i].monsterName === currentMonster?.monsterName) {
        return visibleSteps[i].event.targetHpAfter;
      }
    }
    return currentMonster?.monsterMaxHealth ?? 0;
  }, [visibleSteps, currentMonster]);

  if (!summary.ok || !summary.log) {
    return (
      <ScreenBackground accent="danger" particles={false}>
        <View style={styles.centered}>
          <Text style={styles.title}>{summary.reason ?? "Unable to enter this Gate."}</Text>
          <GlowButton label="Back" variant="ghost" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground accent="danger" particles={false}>
      <View style={styles.content}>
        <GlassPanel glow="neon" style={styles.hudPanel}>
          <StatBar label="Hunter" value={Math.max(0, characterHp)} max={characterMaxHp} accent="neon" />
        </GlassPanel>
        {currentMonster ? (
          <GlassPanel glow="danger" style={styles.hudPanel}>
            <StatBar label={currentMonster.monsterName} value={Math.max(0, monsterHp)} max={currentMonster.monsterMaxHealth} accent="danger" />
          </GlassPanel>
        ) : null}

        <ScrollView ref={scrollRef} style={styles.log} contentContainerStyle={styles.logContent}>
          {visibleSteps.map((step, i) => (
            <Text key={i} style={styles.logLine}>
              {eventText(step)}
            </Text>
          ))}
        </ScrollView>

        {playbackDone ? (
          <GlowButton
            label={summary.log.gateCleared ? "Claim rewards" : "Retreat"}
            variant={summary.log.gateCleared ? "gold" : "ghost"}
            size="lg"
            onPress={() => navigation.replace("CombatResults", { summary })}
          />
        ) : null}
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, gap: 12 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontFamily: fonts.display, fontSize: 16, color: colors.white, textAlign: "center" },
  hudPanel: { padding: 14 },
  log: { flex: 1, marginTop: 4 },
  logContent: { gap: 6, paddingBottom: 12 },
  logLine: { fontFamily: fonts.body, fontSize: 13, color: colors.slate },
});
