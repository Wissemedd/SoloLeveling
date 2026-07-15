/**
 * Data model for the social layer. No backend is wired up yet — these types
 * define the contract the Supabase schema (docs/DATABASE_SCHEMA.sql) and a
 * future API layer should satisfy. UI is intentionally not built against
 * fake multi-user data; ProfileScreen links here as "Coming soon".
 */

export type Friendship = {
  id: string;
  hunterId: string;
  friendId: string;
  status: "pending" | "accepted" | "blocked";
  createdAt: string;
};

export type Guild = {
  id: string;
  name: string;
  emblemColor: string;
  memberCount: number;
  totalPowerLevel: number;
};

export type GuildMember = {
  guildId: string;
  hunterId: string;
  role: "leader" | "officer" | "member";
  joinedAt: string;
};

export type GuildBoss = {
  id: string;
  guildId: string;
  bossId: string;
  maxHealth: number;
  damageDealt: number;
  cycleEndsAt: string;
};

export type LeaderboardEntry = {
  hunterId: string;
  name: string;
  rank: string; // HunterRank, kept as string to avoid a cross-feature type dependency here
  level: number;
  powerLevel: number;
  position: number;
};

export type WorkoutShareCard = {
  id: string;
  hunterId: string;
  workoutId: string;
  caption: string;
  createdAt: string;
  reactionCount: number;
};
