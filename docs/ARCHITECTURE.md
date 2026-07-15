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
                            RankBadge, ProgressRing, Chip, SectionHeader, ParticleField
  features/
    player/                XP/level/rank/RPG-stat engine + store (the core loop)
    workouts/               exercise + workout data, session engine, screens
    missions/               daily/weekly/monthly/legendary mission generator + store
    rewards/                loot table engine + chest-reveal UI
    achievements/           metric-threshold achievement engine + store
    bosses/                 weekly rotating boss, damage-from-xp, store
    onboarding/             cinematic intro + hunter creation wizard
    home/                   Command Center screen + widgets
    profile/                profile screen
    ai-coach/               rule-based coach tip engine (LLM integration point)
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
2. `WorkoutResultsScreen` renders the aggregate summary: level-up banner, loot reveal, boss-defeated banner, new achievements.

This composition-hook pattern (rather than stores calling each other directly) keeps every store independently testable and avoids circular store imports.

## Design system

`tailwind.config.js` and `src/design-system/theme/colors.ts` are the same palette expressed twice (Tailwind className usage vs. raw values for SVG/Reanimated/LinearGradient) — keep them in sync if the palette changes. Palette: deep black base, dark-blue panels, electric purple (arcane) for progression/rarity, neon cyan for the primary active state, gold reserved for legendary rewards, red reserved for danger/boss/streak-at-risk.

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
