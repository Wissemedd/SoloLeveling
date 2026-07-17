import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ScreenBackground, GlassPanel, StatBar, GlowButton, Chip } from "@/design-system/components";
import { colors, fonts } from "@/design-system/theme";
import type { AdventureStackParamList } from "@/app/navigation/types";
import { usePlayerStore } from "@/features/player/store/playerStore";
import { useCharacterStore } from "@/features/character/store/characterStore";
import { AvatarSilhouette } from "@/features/character/components/AvatarSilhouette";
import { MonsterSprite } from "@/features/monsters/components/MonsterSprite";
import { useInventoryStore } from "@/features/inventory/store/inventoryStore";
import { EQUIPMENT_SLOT_IDS } from "@/features/inventory/types";
import type { CombatVisualState } from "@/design-system/combatVisuals";
import type { MonsterDefinition } from "@/features/monsters/types";
import { useRunGate, type RunGateSummary } from "../hooks/useRunGate";
import type { CombatEvent, CombatEventType } from "../types";
import { FloatingDamageText, type DamagePopupAnchor, type DamagePopupTone } from "../components/FloatingDamageText";

type Props = NativeStackScreenProps<AdventureStackParamList, "Combat">;

type PlaybackStep = {
  monster: MonsterDefinition;
  event: CombatEvent;
};

type DamagePopup = { id: number; text: string; tone: DamagePopupTone; anchor: DamagePopupAnchor };

const NORMAL_DURATIONS: Record<CombatEventType, number> = {
  attack: 500,
  crit: 650,
  dodge: 450,
  skill: 750,
  victory: 900,
  defeat: 900,
};
const FAST_DURATIONS: Record<CombatEventType, number> = {
  attack: 120,
  crit: 150,
  dodge: 120,
  skill: 150,
  victory: 250,
  defeat: 250,
};

function eventDuration(type: CombatEventType, fast: boolean): number {
  return (fast ? FAST_DURATIONS : NORMAL_DURATIONS)[type];
}

function eventText(step: PlaybackStep): string {
  const { event, monster } = step;
  if (event.type === "dodge") return `You dodge ${monster.name}'s attack.`;
  if (event.type === "victory") return `${monster.name} is defeated!`;
  if (event.type === "defeat") return `You were defeated by ${monster.name}.`;
  if (event.actor === "character") {
    const verb = event.type === "crit" ? "critically hit" : event.type === "skill" ? `use ${event.skillName} on` : "hit";
    return `You ${verb} ${monster.name} for ${event.damage}.`;
  }
  const verb = event.type === "crit" ? "critically hits" : "hits";
  return `${monster.name} ${verb} you for ${event.damage}.`;
}

/** Bar color shifts as HP depletes — full health = neon, wounded = gold, critical = danger. */
function hpAccent(value: number, max: number): "neon" | "gold" | "danger" {
  const pct = max > 0 ? value / max : 0;
  if (pct > 0.5) return "neon";
  if (pct > 0.2) return "gold";
  return "danger";
}

const IDLE_STATE: CombatVisualState = { phase: "idle", nonce: -1 };

export function CombatScreen({ route, navigation }: Props) {
  const { gate } = route.params;
  const runGate = useRunGate();
  const [summary, setSummary] = useState<RunGateSummary | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [fastForward, setFastForward] = useState(false);
  const [popups, setPopups] = useState<DamagePopup[]>([]);
  const [playerVisual, setPlayerVisual] = useState<CombatVisualState>(IDLE_STATE);
  const [enemyVisual, setEnemyVisual] = useState<CombatVisualState>(IDLE_STATE);
  const popupIdRef = useRef(0);

  const rank = usePlayerStore((s) => s.rank);
  const appearance = useCharacterStore((s) => s.appearance);
  const equipped = useInventoryStore((s) => s.equipped);
  const equippedSlots = useMemo(
    () => Object.fromEntries(EQUIPMENT_SLOT_IDS.map((slot) => [slot, !!equipped[slot]])),
    [equipped],
  );

  // Runs the fight exactly once on mount — deliberately outside render (the
  // old lazy-useState-initializer version called this during render, which
  // triggers "setState while rendering a different component" since runGate
  // writes to several Zustand stores other screens subscribe to).
  useEffect(() => {
    setSummary(runGate(gate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const steps = useMemo<PlaybackStep[]>(() => {
    if (!summary?.log) return [];
    const all: PlaybackStep[] = [];
    for (const encounter of summary.log.encounters) {
      const monster = gate.encounterMonsters.find((m) => m.id === encounter.monsterId);
      if (!monster) continue;
      for (const event of encounter.events) all.push({ monster, event });
    }
    if (summary.log.bossEncounter) {
      for (const event of summary.log.bossEncounter.events) all.push({ monster: gate.boss, event });
    }
    return all;
  }, [summary, gate]);

  const addPopup = (text: string, tone: DamagePopupTone, anchor: DamagePopupAnchor) => {
    const id = popupIdRef.current++;
    setPopups((p) => [...p, { id, text, tone, anchor }]);
  };
  const removePopup = (id: number) => setPopups((p) => p.filter((x) => x.id !== id));

  useEffect(() => {
    if (!summary?.log || stepIndex >= steps.length) return;
    const step = steps[stepIndex];
    const { event } = step;

    if (event.type === "dodge") {
      setEnemyVisual({ phase: "attack", nonce: stepIndex });
      setPlayerVisual({ phase: "dodge", nonce: stepIndex });
      addPopup("Dodge!", "dodge", "player");
    } else if (event.type === "victory") {
      setPlayerVisual({ phase: "victory", nonce: stepIndex });
      setEnemyVisual({ phase: "defeat", nonce: stepIndex });
    } else if (event.type === "defeat") {
      setPlayerVisual({ phase: "defeat", nonce: stepIndex });
      setEnemyVisual({ phase: "victory", nonce: stepIndex });
    } else {
      const isCrit = event.type === "crit";
      const isSkill = event.type === "skill";
      const attackerPhase = isSkill ? "cast" : "attack";
      const defenderPhase = isCrit ? "crit-hit" : "hit";
      if (event.actor === "character") {
        setPlayerVisual({ phase: attackerPhase, nonce: stepIndex });
        setEnemyVisual({ phase: defenderPhase, nonce: stepIndex });
        addPopup(isSkill ? (event.skillName ?? "Skill!") : `-${event.damage}`, isCrit ? "crit" : isSkill ? "skill" : "damage", "enemy");
      } else {
        setEnemyVisual({ phase: attackerPhase, nonce: stepIndex });
        setPlayerVisual({ phase: defenderPhase, nonce: stepIndex });
        addPopup(`-${event.damage}`, isCrit ? "crit" : "damage", "player");
      }
    }

    const timer = setTimeout(() => setStepIndex((i) => i + 1), eventDuration(event.type, fastForward));
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, steps, summary, fastForward]);

  const scrollRef = useRef<ScrollView>(null);
  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [stepIndex]);

  if (!summary) {
    return <ScreenBackground accent="danger" particles={false}>{null}</ScreenBackground>;
  }

  const visibleSteps = steps.slice(0, stepIndex);
  const playbackDone = stepIndex >= steps.length;
  const lastStep = visibleSteps[visibleSteps.length - 1];

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

  const characterMaxHp = summary.characterMaxHealth ?? summary.log.finalCharacterHp ?? 1;
  const characterHp = (() => {
    for (let i = visibleSteps.length - 1; i >= 0; i--) {
      if (visibleSteps[i].event.actor === "enemy") return visibleSteps[i].event.targetHpAfter;
    }
    return characterMaxHp;
  })();

  const currentMonster = lastStep?.monster ?? steps[0]?.monster;
  const monsterHp = (() => {
    for (let i = visibleSteps.length - 1; i >= 0; i--) {
      if (visibleSteps[i].event.actor === "character" && visibleSteps[i].monster.id === currentMonster?.id) {
        return visibleSteps[i].event.targetHpAfter;
      }
    }
    return currentMonster?.maxHealth ?? 0;
  })();

  const currentMessage = lastStep ? eventText(lastStep) : `A ${currentMonster?.name ?? "creature"} blocks your path.`;

  const isBossEncounter = !!currentMonster?.isBoss;

  return (
    <ScreenBackground accent={isBossEncounter ? "gold" : "danger"} particles={false}>
      <View style={styles.content}>
        <Pressable style={styles.stage} onPress={() => setFastForward(true)}>
          <View style={styles.stageRow}>
            {currentMonster ? (
              <GlassPanel glow={isBossEncounter ? "gold" : "danger"} style={styles.hpPanel}>
                {isBossEncounter ? <Chip label="BOSS" tier="legendary" /> : null}
                <StatBar label={currentMonster.name} value={Math.max(0, monsterHp)} max={currentMonster.maxHealth} accent={hpAccent(monsterHp, currentMonster.maxHealth)} height={8} />
              </GlassPanel>
            ) : (
              <View style={styles.hpPanel} />
            )}
            {currentMonster ? (
              <View style={styles.enemySpriteWrap}>
                <MonsterSprite key={currentMonster.id} monster={currentMonster} facing="left" size={120} combatState={enemyVisual} />
              </View>
            ) : null}
          </View>

          <View style={styles.stageRow}>
            <View style={styles.playerSpriteWrap}>
              <AvatarSilhouette appearance={appearance} rank={rank} equippedSlots={equippedSlots} size={96} breathing combatState={playerVisual} />
            </View>
            <GlassPanel glow="neon" style={styles.hpPanel}>
              <StatBar label="Hunter" value={Math.max(0, characterHp)} max={characterMaxHp} accent={hpAccent(characterHp, characterMaxHp)} height={8} />
            </GlassPanel>
          </View>

          {popups.map((p) => (
            <FloatingDamageText key={p.id} text={p.text} tone={p.tone} anchor={p.anchor} onDone={() => removePopup(p.id)} />
          ))}
        </Pressable>

        <GlassPanel glow={isBossEncounter ? "gold" : "danger"} style={styles.messageBox}>
          <Text style={styles.messageText}>{currentMessage}</Text>
          {!playbackDone ? <Text style={styles.messageCue}>▼</Text> : null}
        </GlassPanel>

        {!playbackDone ? (
          <Pressable onPress={() => setStepIndex(steps.length)} style={styles.skipButton}>
            <Text style={styles.skipLabel}>Skip ▶▶</Text>
          </Pressable>
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
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 32, gap: 10 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontFamily: fonts.display, fontSize: 16, color: colors.white, textAlign: "center" },
  stage: { height: 320, position: "relative", gap: 8 },
  stageRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  hpPanel: { padding: 10, width: "56%", gap: 4 },
  enemySpriteWrap: { marginTop: 4 },
  playerSpriteWrap: { alignSelf: "flex-end", marginBottom: 4 },
  messageBox: { padding: 14, minHeight: 64, justifyContent: "center" },
  messageText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.white, lineHeight: 20 },
  messageCue: { position: "absolute", right: 12, bottom: 8, color: colors.slate, fontSize: 12 },
  skipButton: { alignSelf: "flex-end", paddingHorizontal: 10, paddingVertical: 4 },
  skipLabel: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.slate },
  log: { flex: 1 },
  logContent: { gap: 4, paddingBottom: 12 },
  logLine: { fontFamily: fonts.body, fontSize: 11, color: "rgba(137,145,184,0.7)" },
});
