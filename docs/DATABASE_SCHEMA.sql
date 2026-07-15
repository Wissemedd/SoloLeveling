-- SoloLeveling — Supabase/Postgres schema
--
-- Not deployed yet. The app runs entirely on-device (Zustand + AsyncStorage,
-- see src/features/*/store) for this foundation phase. This schema is the
-- target shape for the next phase: cross-device sync, guilds, and
-- leaderboards, wired through src/lib/supabase/client.ts.
--
-- Conventions:
--   * hunter_id always references auth.users(id) — Supabase Auth owns identity.
--   * Content tables (workouts, exercises, achievements, mission_templates,
--     bosses) are seeded/static and could equally ship as a bundled JSON
--     read-replica; they're modeled here so the API can serve them without
--     an app update.
--   * Row Level Security (RLS) is on for every hunter-owned table — a hunter
--     may only read/write rows where hunter_id = auth.uid(), unless noted.

create extension if not exists "uuid-ossp";

-- ============================================================
-- Identity & profile
-- ============================================================

create table hunters (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  avatar_id text not null,
  height_cm integer not null,
  weight_kg integer not null,
  gender text not null check (gender in ('male', 'female', 'unspecified')),
  fitness_level text not null check (fitness_level in ('beginner', 'intermediate', 'advanced', 'elite')),
  goals text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table hunters enable row level security;
create policy "hunters read own row" on hunters for select using (auth.uid() = id);
create policy "hunters write own row" on hunters for update using (auth.uid() = id);

-- Mutable RPG state, split from `hunters` since it changes on nearly every action.
create table hunter_progress (
  hunter_id uuid primary key references hunters(id) on delete cascade,
  xp bigint not null default 0,
  level integer not null default 1,
  rank text not null default 'E',
  gold bigint not null default 0,
  energy integer not null default 100 check (energy between 0 and 100),
  streak_current integer not null default 0,
  streak_longest integer not null default 0,
  streak_last_completed_date date,
  streak_shields integer not null default 0,
  active_title text,
  updated_at timestamptz not null default now()
);

alter table hunter_progress enable row level security;
create policy "progress owner rw" on hunter_progress for all using (auth.uid() = hunter_id);

create table hunter_stats (
  hunter_id uuid primary key references hunters(id) on delete cascade,
  strength integer not null default 10,
  agility integer not null default 10,
  endurance integer not null default 10,
  focus integer not null default 10,
  discipline integer not null default 10,
  vitality integer not null default 10
);

alter table hunter_stats enable row level security;
create policy "stats owner rw" on hunter_stats for all using (auth.uid() = hunter_id);

-- ============================================================
-- Content (seeded, read-mostly)
-- ============================================================

create table exercises (
  id text primary key,
  name text not null,
  description text not null,
  muscle_groups text[] not null,
  equipment text[] not null,
  metric text not null check (metric in ('reps', 'time', 'distance'))
);

create table workouts (
  id text primary key,
  title text not null,
  description text not null,
  difficulty text not null check (difficulty in ('beginner', 'intermediate', 'advanced', 'elite')),
  focus text[] not null,
  equipment text[] not null,
  duration_minutes integer not null,
  estimated_calories integer not null,
  xp_reward integer not null,
  stat_rewards jsonb not null default '{}',
  blocks jsonb not null, -- { warmup: [...], main: [...], cooldown: [...] }
  unlock_level integer not null default 1,
  tags text[] not null default '{}'
);

create table mission_templates (
  id text primary key,
  title text not null,
  description text not null,
  period text not null check (period in ('daily', 'weekly', 'monthly', 'legendary')),
  metric text not null,
  target_value numeric not null,
  xp_reward integer not null,
  gold_reward integer not null
);

create table achievements (
  id text primary key,
  title text not null,
  description text not null,
  metric text not null,
  target_value numeric not null,
  tier text not null check (tier in ('common', 'rare', 'epic', 'legendary'))
);

create table bosses (
  id text primary key,
  name text not null,
  title text not null,
  description text not null,
  max_health integer not null,
  accent text not null
);

-- Public read access — content tables have no user-specific data.
alter table exercises enable row level security;
alter table workouts enable row level security;
alter table mission_templates enable row level security;
alter table achievements enable row level security;
alter table bosses enable row level security;
create policy "content public read" on exercises for select using (true);
create policy "content public read" on workouts for select using (true);
create policy "content public read" on mission_templates for select using (true);
create policy "content public read" on achievements for select using (true);
create policy "content public read" on bosses for select using (true);

-- ============================================================
-- Hunter activity / history
-- ============================================================

create table workout_sessions (
  id uuid primary key default uuid_generate_v4(),
  hunter_id uuid not null references hunters(id) on delete cascade,
  workout_id text not null references workouts(id),
  completed_at timestamptz not null default now(),
  duration_minutes integer not null,
  calories_burned integer not null,
  xp_earned integer not null,
  stat_rewards jsonb not null default '{}'
);

create index workout_sessions_hunter_idx on workout_sessions (hunter_id, completed_at desc);
alter table workout_sessions enable row level security;
create policy "sessions owner rw" on workout_sessions for all using (auth.uid() = hunter_id);

create table mission_instances (
  id uuid primary key default uuid_generate_v4(),
  hunter_id uuid not null references hunters(id) on delete cascade,
  template_id text not null references mission_templates(id),
  progress numeric not null default 0,
  expires_at timestamptz not null,
  completed_at timestamptz,
  claimed_at timestamptz
);

create index mission_instances_hunter_idx on mission_instances (hunter_id, expires_at);
alter table mission_instances enable row level security;
create policy "missions owner rw" on mission_instances for all using (auth.uid() = hunter_id);

create table unlocked_achievements (
  hunter_id uuid not null references hunters(id) on delete cascade,
  achievement_id text not null references achievements(id),
  unlocked_at timestamptz not null default now(),
  primary key (hunter_id, achievement_id)
);

alter table unlocked_achievements enable row level security;
create policy "unlocks owner rw" on unlocked_achievements for all using (auth.uid() = hunter_id);

create table loot_events (
  id uuid primary key default uuid_generate_v4(),
  hunter_id uuid not null references hunters(id) on delete cascade,
  kind text not null,
  rarity text not null check (rarity in ('common', 'rare', 'epic', 'legendary')),
  label text not null,
  amount integer,
  created_at timestamptz not null default now()
);

alter table loot_events enable row level security;
create policy "loot owner rw" on loot_events for all using (auth.uid() = hunter_id);

create table boss_cycles (
  id uuid primary key default uuid_generate_v4(),
  hunter_id uuid not null references hunters(id) on delete cascade,
  week_id text not null,
  boss_id text not null references bosses(id),
  damage_dealt integer not null default 0,
  defeated_at timestamptz,
  unique (hunter_id, week_id)
);

alter table boss_cycles enable row level security;
create policy "boss cycles owner rw" on boss_cycles for all using (auth.uid() = hunter_id);

-- ============================================================
-- Social
-- ============================================================

create table guilds (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  emblem_color text not null,
  created_at timestamptz not null default now()
);

create table guild_members (
  guild_id uuid not null references guilds(id) on delete cascade,
  hunter_id uuid not null references hunters(id) on delete cascade,
  role text not null default 'member' check (role in ('leader', 'officer', 'member')),
  joined_at timestamptz not null default now(),
  primary key (guild_id, hunter_id)
);

create table friendships (
  id uuid primary key default uuid_generate_v4(),
  hunter_id uuid not null references hunters(id) on delete cascade,
  friend_id uuid not null references hunters(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'blocked')),
  created_at timestamptz not null default now(),
  unique (hunter_id, friend_id)
);

alter table guilds enable row level security;
alter table guild_members enable row level security;
alter table friendships enable row level security;
create policy "guilds public read" on guilds for select using (true);
create policy "guild members read own guild" on guild_members for select
  using (guild_id in (select guild_id from guild_members where hunter_id = auth.uid()));
create policy "friendships involving self" on friendships for all
  using (auth.uid() = hunter_id or auth.uid() = friend_id);

-- ============================================================
-- Leaderboard (read-only view, joins progress + stats)
-- ============================================================

create view leaderboard as
select
  h.id as hunter_id,
  h.name,
  hp.rank,
  hp.level,
  (hs.strength + hs.agility + hs.endurance + hs.focus + hs.discipline + hs.vitality) as power_level,
  rank() over (order by hp.level desc, (hs.strength + hs.agility + hs.endurance + hs.focus + hs.discipline + hs.vitality) desc) as position
from hunters h
join hunter_progress hp on hp.hunter_id = h.id
join hunter_stats hs on hs.hunter_id = h.id;
