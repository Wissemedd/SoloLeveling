import { useEffect, useMemo, useRef, useState } from "react";
import type { MonsterDefinition } from "@/features/monsters/types";
import type { Gate } from "@/features/dungeons/types";
import type { SkillDefinition } from "@/features/skills/types";
import type { CombatEvent, CombatLog, EncounterResult } from "../types";
import { createFighter, createRng, resolveFight, resolveRound, type CombatAction, type Fighter } from "../engine/combatEngine";
import { usePrepareGateRun, type PreparedGateRun } from "./usePrepareGateRun";

export type { CombatAction } from "../engine/combatEngine";

export type PlaybackStep = { monster: MonsterDefinition; event: CombatEvent };

export type InteractiveCombat = {
  /** False until the Gate-entry check (spend energy, derive attributes) has resolved. */
  ready: boolean;
  /** Set when the Gate couldn't be entered at all (e.g. not enough energy) — nothing else below is meaningful in that case. */
  denied: string | null;
  /** The monster currently up next / being fought — may already be one encounter ahead of what's still animating in `steps`. */
  monster: MonsterDefinition | null;
  /** Every event resolved so far, in order — the screen animates through this at its own pace. */
  steps: PlaybackStep[];
  /** True once the whole run (all monsters + boss, or an earlier defeat) has resolved. */
  concluded: boolean;
  finalLog: CombatLog | null;
  characterMaxHp: number;
  activeSkill?: SkillDefinition;
  canUseSkill: boolean;
  /** Resolves one round of the current encounter with the player's chosen action. */
  act: (action: CombatAction) => void;
  /** Auto-resolves the rest of the current encounter (skill-when-ready AI), like the old "Skip". */
  autoResolveEncounter: () => void;
};

/**
 * Drives a Gate run round by round so the player can pick an action each
 * turn (Pokémon-style), instead of the old batch-simulate-then-animate
 * flow. Rewards are granted separately by useFinalizeGateRun once the
 * screen has finished animating the concluded run's `finalLog`.
 */
export function useInteractiveCombat(gate: Gate): InteractiveCombat {
  const prepareGateRun = usePrepareGateRun();
  const [prepared, setPrepared] = useState<PreparedGateRun | null>(null);

  // Spends energy and derives attributes exactly once, outside render —
  // calling it during render would trigger "setState while rendering a
  // different component" since it writes to the player store.
  useEffect(() => {
    setPrepared(prepareGateRun(gate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const queue = useMemo(() => [...gate.encounterMonsters, gate.boss], [gate]);

  const fighterRef = useRef<Fighter | null>(null);
  const rngRef = useRef<(() => number) | null>(null);
  const skillCooldownRef = useRef({ remaining: 0 });
  const monsterHpRef = useRef(queue[0]?.maxHealth ?? 0);
  const roundRef = useRef(1);
  const encounterIndexRef = useRef(0);
  const currentEncounterEventsRef = useRef<CombatEvent[]>([]);
  const finishedEncountersRef = useRef<EncounterResult[]>([]);
  const concludedRef = useRef(false);

  useEffect(() => {
    if (prepared?.ok && !fighterRef.current) {
      fighterRef.current = createFighter(prepared.attributes);
      rngRef.current = createRng(Date.now());
    }
  }, [prepared]);

  const [steps, setSteps] = useState<PlaybackStep[]>([]);
  const [skillReady, setSkillReady] = useState(true);
  const [concluded, setConcluded] = useState(false);
  const [finalLog, setFinalLog] = useState<CombatLog | null>(null);
  const [currentMonster, setCurrentMonster] = useState<MonsterDefinition | null>(queue[0] ?? null);

  function finishEncounter(monster: MonsterDefinition, won: boolean) {
    finishedEncountersRef.current.push({ monsterId: monster.id, monsterName: monster.name, won, events: currentEncounterEventsRef.current });
    currentEncounterEventsRef.current = [];
    roundRef.current = 1;

    if (!won) {
      concludeRun();
      return;
    }
    const nextIndex = encounterIndexRef.current + 1;
    encounterIndexRef.current = nextIndex;
    if (nextIndex >= queue.length) {
      concludeRun();
      return;
    }
    monsterHpRef.current = queue[nextIndex].maxHealth;
    setCurrentMonster(queue[nextIndex]);
  }

  function concludeRun() {
    concludedRef.current = true;
    const encounters = finishedEncountersRef.current.slice(0, gate.encounterMonsters.length);
    const bossEncounter = finishedEncountersRef.current.length > gate.encounterMonsters.length ? finishedEncountersRef.current[gate.encounterMonsters.length] : null;
    setFinalLog({
      encounters,
      bossEncounter,
      gateCleared: bossEncounter?.won ?? false,
      finalCharacterHp: fighterRef.current?.hp ?? 0,
    });
    setConcluded(true);
  }

  function act(action: CombatAction) {
    if (!prepared?.ok || concludedRef.current || !fighterRef.current || !rngRef.current) return;
    const monster = queue[encounterIndexRef.current];
    if (!monster) return;

    const outcome = resolveRound(roundRef.current, fighterRef.current, monster, monsterHpRef.current, rngRef.current, action, prepared.activeSkill, skillCooldownRef.current);

    monsterHpRef.current = outcome.monsterHp;
    roundRef.current += 1;
    currentEncounterEventsRef.current.push(...outcome.events);
    setSteps((prev) => [...prev, ...outcome.events.map((event) => ({ monster, event }))]);
    setSkillReady(skillCooldownRef.current.remaining <= 0);

    if (outcome.encounterOver) finishEncounter(monster, outcome.won);
  }

  function autoResolveEncounter() {
    if (!prepared?.ok || concludedRef.current || !fighterRef.current || !rngRef.current) return;
    const monster = queue[encounterIndexRef.current];
    if (!monster) return;

    const result = resolveFight(fighterRef.current, monster, rngRef.current, prepared.activeSkill, skillCooldownRef.current, monsterHpRef.current, roundRef.current);

    currentEncounterEventsRef.current.push(...result.events);
    setSteps((prev) => [...prev, ...result.events.map((event) => ({ monster, event }))]);
    setSkillReady(skillCooldownRef.current.remaining <= 0);
    finishEncounter(monster, result.won);
  }

  return {
    ready: prepared !== null,
    denied: prepared && !prepared.ok ? prepared.reason : null,
    monster: currentMonster,
    steps,
    concluded,
    finalLog,
    characterMaxHp: prepared?.ok ? prepared.attributes.maxHealth : 0,
    activeSkill: prepared?.ok ? prepared.activeSkill : undefined,
    canUseSkill: !!(prepared?.ok && prepared.activeSkill) && skillReady,
    act,
    autoResolveEncounter,
  };
}
