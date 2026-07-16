# SoloLeveling — Architecture

An RPG-fitness app: every workout is a quest, every stat is earned, and skipping a day costs a streak. This document describes what's built, how it's organized, and what's intentionally deferred.

## Status: foundation phase

This is a real, runnable Expo app — not a mockup — but it is **phase one** of a much larger brief. It covers the full client-side experience on local device storage. Backend sync, real multiplayer, a real AI model, and audio assets are scoped for the next phase (see "Next phase" below).

## Stack

| Concern | Choice | Notes |
|---|---|---|
| App shell | Expo SDK 57 (React Native 0.86, React 19) | Managed workflow |
| Language | TypeScript, strict mode | |
| Styling | NativeWind v4 + Tailwind | Custom theme in `tailwind.config.js` / `src/design-system/theme` |
| Navigation | React Navigation (native-stack + bottom-tabs) | |
| State | Zustand, one store per bounded context, `persist` + AsyncStorage | |
| Animation | Reanimated 4, Gesture Handler | |
| Vector/graphics | react-native-svg, expo-linear-gradient, expo-blur | Deliberately **not** using Skia/MMKV — see below |
| Icons/fonts | @expo/vector-icons (Ionicons), @expo-google-fonts (Orbitron + Inter) | |
| Backend (defined, not wired) | Supabase (`@supabase/supabase-js`) | `src/lib/supabase/client.ts`, schema in `DATABASE_SCHEMA.sql` |
| Tests | Jest + jest-expo | `src/features/player/__tests__` |

### Why not Skia / MMKV / Victory Native yet

The brief lists `react-native-skia`, `react-native-mmkv`, and Victory Native. All three need a custom dev client (`expo prebuild` + `expo run:android/ios`) — they don't run in plain Expo Go. Since the goal for this phase was "something you can actually run and feel" immediately, particles/charts/rings are built with Reanimated + `react-native-svg` instead (see `ParticleField`, `ProgressRing`, `WeeklyProgressStrip`), and persistence uses AsyncStorage behind a `StateStorage` interface (`src/lib/storage/storage.ts`). Swapping in MMKV later means implementing that same interface over an MMKV instance — no store code changes.

## Folder structure

```
src/
  app/                    navigation graph + top-level providers
    navigation/           RootNavigator → Onboarding | MainTabNavigator
    providers/             AppProviders (gesture root, safe area, nav theme)
  design-system/
    theme/                 colors, typography, spacing — single source of truth
    components/            ScreenBackground, GlassPanel, GlowButton, StatBar,
                            RankBadge, ProgressRing, Chip, SectionHeader, ParticleField,
                            GateEmblem, ShadowSigil (original decorative motifs — no
                            licensed artwork; see "Original visual motifs" below)
  features/
    player/                XP/level/rank/RPG-stat engine + store (the core loop)
    workouts/               exercise + workout data, session engine, screens
    missions/               daily/weekly/monthly/legendary mission generator + store
    rewards/                loot table engine + chest-reveal UI
    achievements/           metric-threshold achievement engine + store
    bosses/                 weekly rotating boss, damage-from-xp, store
    classes/                class evolution tree, engine + store (see "Class evolution" below)
    onboarding/             cinematic intro + hunter creation wizard
    home/                   Command Center screen + widgets
    profile/                profile screen (+ class evolution screen)
    ai-coach/               rule-based coach tip engine (LLM integration point)
    health/                 Health Connect integration — steps sync, counted as exercise
    notifications/          local notification copy + scheduler (expo-notifications)
    sound/                  sound manager (silent until real SFX assets are added)
    social/                 types only — no backend yet, see "Next phase"
  lib/
    storage/                AsyncStorage-backed Zustand persist adapter + hydration gate
    supabase/               client factory (inert until env vars are set)
docs/
  ARCHITECTURE.md           this file
  DATABASE_SCHEMA.sql       target Postgres/Supabase schema
```

Each `features/<name>` follows the same internal shape where it applies: `types.ts`, `data/` (static content), `engine/` (pure functions, unit-testable), `store/` (Zustand + persistence), `screens/` + `components/` (UI). Pure engine logic never imports React or a store — stores call engines, screens call stores. This is what makes `xpEngine`, `rankEngine`, and `streakEngine` unit-testable without any RN runtime (see `__tests__`).

## The core progression loop

1. A hunter completes a workout → `useCompleteWorkout()` (`src/features/workouts/hooks/useCompleteWorkout.ts`) is the single seam that fans out into every system:
   - `xpEngine.grantXp` → level/rank via `rankEngine`
   - `statsEngine.applyStatGains` → RPG stats
   - `streakEngine.recordDailyCompletion` → streak, with a shield/halving grace mechanic instead of a hard reset
   - `lifetimeStatsStore` → cumulative counters feeding achievements
   - `missionStore.incrementProgress` → daily/weekly mission progress
   - `bossStore.dealDamageFromXp` → weekly boss HP
   - `lootEngine.rollChest` → gold + cosmetic rewards
   - `achievementStore.evaluate` → newly unlocked achievements
   - `classEngine.getEligibleEvolutions` → whether the hunter's class can now evolve (surfaced, not auto-applied — see "Class evolution")
2. `WorkoutResultsScreen` renders the aggregate summary: level-up banner, loot reveal, boss-defeated banner, new achievements, class-evolution-available banner.

This composition-hook pattern (rather than stores calling each other directly) keeps every store independently testable and avoids circular store imports.

## Design system

`tailwind.config.js` and `src/design-system/theme/colors.ts` are the same palette expressed twice (Tailwind className usage vs. raw values for SVG/Reanimated/LinearGradient) — keep them in sync if the palette changes. Palette: deep black base, dark-blue panels, electric purple (arcane) for progression/rarity, neon cyan for the primary active state, gold reserved for legendary rewards, red reserved for danger/boss/streak-at-risk.

### Original visual motifs

`GateEmblem` (a rotating rune-ringed portal) and `ShadowSigil` (a hooded silhouette with a glowing eye) are original `react-native-svg` compositions evoking the app's own dungeon-gate fiction (see `bosses.ts`). Same rule as everywhere else in this repo: no licensed artwork, screenshots, or character likenesses — homage through original geometry and terminology only. They're layered behind `RankBadge` on the Home header and Profile, as a boss-banner watermark, on the onboarding "gate has opened" beat, and as unlock icons for epic/legendary achievements.

### Pedometer integration (Health Connect)

Samsung Health doesn't expose a public SDK a third-party app can just integrate with — instead, Samsung Health writes step data into **Health Connect**, Android's OS-level health data hub, and that's what `features/health` talks to via `react-native-health-connect`. This requires a native module, so it only works in a dev-client/EAS build (not Expo Go) and only on Android (`unsupported-platform` status on iOS).

- `services/healthConnectService.ts` — the only file that imports the native library. Every call is platform-gated and wrapped in try/catch, since `TurboModuleRegistry.getEnforcing` throws the instant its JS evaluates on a build without the native module linked (iOS, Expo Go, or a stale dev client).
- `store/healthStore.ts` — connection status, today's step count, and a per-date "already credited" ledger so re-syncing the same day only counts the delta.
- `engine/stepsEngine.ts` — pure conversion functions (steps → km / calories / XP / endurance stat gains), unit-tested like the other engines.
- `hooks/useSyncSteps.ts` — mirrors `useCompleteWorkout`: fans new steps into XP, lifetime counters, mission progress, and achievements, so synced steps are counted as real exercise rather than a cosmetic-only counter. It deliberately does **not** increment `totalWorkouts` — that stays reserved for structured workout sessions.
- `components/StepsWidget.tsx` — Home-screen card with a connect CTA, today's step count, and a tap-to-resync action. `ProfileScreen` also exposes a "Samsung Health" row that toggles the connection.

Enabling it end-to-end requires: `npx expo prebuild` (regenerates `android/`, already gitignored) then a fresh dev-client build (`expo run:android` or a new EAS dev build) — the `react-native-health-connect` and `expo-build-properties` (`minSdkVersion: 26`) plugins in `app.json` only take effect after that regeneration.

### Class evolution

`features/classes` turns the four onboarding archetypes (Vanguard/Phantom/Priest/Mage — picked as `HunterProfile.avatarId`) into full evolution trees, plus a fifth secret one.

- `data/classTree.ts` — a flat `ClassNode[]` (parent-linked, like a tree stored as a list). Each archetype has a 2-node shared trunk (tier E → D) that forks into 3 branches of 4 tiers each (C → B → A → S), mirroring `HunterRank`. Branch gating (`ClassRequirement`) combines a `minLevel`, one or two "dominant" `RpgStatKey`s the hunter must currently be training toward (top-2 stats), and an achievement-style `metric`/`metricThreshold` pulled from the same `LifetimeStats` achievements already read — so evolution reflects real exercise history (pushups, distance, streak, time-of-day, etc.), not just level.
- `engine/classEngine.ts` — pure functions: `getEligibleEvolutions` (children of the current node the hunter can evolve into right now), `getNextCandidates` (children regardless of eligibility, for previewing a locked fork), `isRequirementMet` / `requirementProgress`, `getPath` (root-to-current breadcrumb). `isWissem(name)` gates the secret archetype.
- `store/classStore.ts` — persists `currentNodeId`, the locked-in `chosenBranch` (once a fork is taken, the other two branches are gone for good), and an evolution `history`. `initForArchetype` runs once at hunter creation; `ProfileScreen` also calls it lazily for hunters created before this feature shipped (persisted state has no migration step, so this is the backfill).
- Evolution is **manual, not automatic**: `useCompleteWorkout` and `ProfileScreen` both compute eligibility live and surface it (a results-screen banner, a pulsing "Evolution Ready" chip on the Class panel), but the hunter confirms the promotion themselves on `ClassEvolutionScreen` (pushed from the Profile tab's own stack, `ProfileStackNavigator`).
- **Secret Monarch path**: if the name typed in onboarding step 1 is "Wissem" (case-insensitive), a fifth archetype option appears — a single-line, no-branch tree ending in `Shadow Monarch` at rank S. `Shadow Monarch` is intentionally excluded from every other tree's mythic-tier pool so it stays unique to that path.

## Next phase (not built yet)

- **Backend sync**: wire `src/lib/supabase/client.ts` to real auth + the tables in `DATABASE_SCHEMA.sql`; migrate each Zustand store's persisted state to read/write Supabase instead of (or in addition to) AsyncStorage.
- **Real AI coach**: `aiCoachEngine.generateCoachTip` is rule-based today; replace its body with a call to an LLM using `CoachContext` as the prompt payload (streak risk, energy, recent load).
- **Social**: `features/social/types.ts` defines the guild/friend/leaderboard contract; no UI is built against fake multi-user data. Build once the backend exists.
- **Sound**: `soundManager.playSound()` is fully wired at every reward/level-up/mission moment but no-ops until real SFX files are registered in `SOUND_ASSETS`.
- **Push notifications**: only local, on-device notifications are implemented (`notificationScheduler.ts`). Remote push needs an Expo push token + a server to send from.
- **Equipment/cosmetics inventory UI**: loot currently lands in `rewardsStore.collection` and shows as chips on Profile; a full equip/preview screen isn't built.
- **MMKV/Skia**: swap-in points are documented above; do this once the project moves to a dev client build.

## Running it

```
npm install
npm run start      # Expo Go on a physical device, or an emulator/simulator
npm test           # jest — engine unit tests
npx tsc --noEmit   # typecheck
```
