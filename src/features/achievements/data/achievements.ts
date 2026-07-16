import type { Achievement } from "../types";

/**
 * Every achievement is a (metric, threshold) pair — adding more is a data
 * change, not an engine change. This seed list covers the categories from
 * the design brief; production would grow this into the hundreds the same
 * way.
 */
export const achievements: Achievement[] = [
  // First steps
  { id: "first-workout", title: "First Steps", description: "Complete your very first workout.", metric: "totalWorkouts", targetValue: 1, tier: "common" },
  { id: "workouts-10", title: "Getting Serious", description: "Complete 10 workouts.", metric: "totalWorkouts", targetValue: 10, tier: "common" },
  { id: "workouts-50", title: "Half Century", description: "Complete 50 workouts.", metric: "totalWorkouts", targetValue: 50, tier: "rare" },
  { id: "workouts-100", title: "Centurion", description: "Complete 100 workouts.", metric: "totalWorkouts", targetValue: 100, tier: "epic" },
  { id: "workouts-500", title: "Legend Rank", description: "Complete 500 workouts.", metric: "totalWorkouts", targetValue: 500, tier: "legendary" },
  { id: "workouts-1000", title: "Monarch's Discipline", description: "Complete 1,000 workouts.", metric: "totalWorkouts", targetValue: 1000, tier: "legendary" },

  // Push-ups
  { id: "pushups-100", title: "Century Fists", description: "Bank 100 lifetime push-ups.", metric: "totalPushups", targetValue: 100, tier: "common" },
  { id: "pushups-1000", title: "Iron Chest", description: "Bank 1,000 lifetime push-ups.", metric: "totalPushups", targetValue: 1000, tier: "rare" },
  { id: "pushups-10000", title: "Foundation of Steel", description: "Bank 10,000 lifetime push-ups.", metric: "totalPushups", targetValue: 10000, tier: "epic" },
  { id: "pushups-50000", title: "Endless Ascension", description: "Bank 50,000 lifetime push-ups.", metric: "totalPushups", targetValue: 50000, tier: "legendary" },

  // Distance
  { id: "distance-10", title: "First Mile Marker", description: "Cover 10 km on foot.", metric: "totalDistanceKm", targetValue: 10, tier: "common" },
  { id: "distance-50", title: "Wanderer", description: "Cover 50 km on foot.", metric: "totalDistanceKm", targetValue: 50, tier: "common" },
  { id: "distance-100", title: "Pathfinder", description: "Cover 100 km on foot.", metric: "totalDistanceKm", targetValue: 100, tier: "rare" },
  { id: "distance-500", title: "Roadbound Hunter", description: "Cover 500 km on foot.", metric: "totalDistanceKm", targetValue: 500, tier: "epic" },
  { id: "distance-1000", title: "Horizon Chaser", description: "Cover 1,000 km on foot.", metric: "totalDistanceKm", targetValue: 1000, tier: "legendary" },

  // Steps — synced from a connected pedometer (Samsung Health via Health Connect)
  { id: "steps-1000", title: "Beyond the Gate", description: "Log 1,000 lifetime steps through a connected pedometer.", metric: "totalSteps", targetValue: 1000, tier: "common" },
  { id: "steps-25000", title: "Dungeon Scout", description: "Log 25,000 lifetime steps.", metric: "totalSteps", targetValue: 25000, tier: "common" },
  { id: "steps-100000", title: "Path of the Hunter", description: "Log 100,000 lifetime steps.", metric: "totalSteps", targetValue: 100000, tier: "rare" },
  { id: "steps-500000", title: "Continental Wanderer", description: "Log 500,000 lifetime steps.", metric: "totalSteps", targetValue: 500000, tier: "epic" },
  { id: "steps-1000000", title: "World Walker", description: "Log 1,000,000 lifetime steps.", metric: "totalSteps", targetValue: 1000000, tier: "legendary" },

  // Streak
  { id: "streak-3", title: "First Vow", description: "Reach a 3-day streak.", metric: "longestStreak", targetValue: 3, tier: "common" },
  { id: "streak-7", title: "One Week Vow", description: "Reach a 7-day streak.", metric: "longestStreak", targetValue: 7, tier: "common" },
  { id: "streak-30", title: "No Excuse", description: "Reach a 30-day streak.", metric: "longestStreak", targetValue: 30, tier: "rare" },
  { id: "streak-100", title: "Unshakable", description: "Reach a 100-day streak.", metric: "longestStreak", targetValue: 100, tier: "epic" },
  { id: "streak-365", title: "Full Cycle", description: "Reach a 365-day streak.", metric: "longestStreak", targetValue: 365, tier: "legendary" },

  // Calories
  { id: "calories-5000", title: "Spark Ignited", description: "Burn 5,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 5000, tier: "common" },
  { id: "calories-50000", title: "Furnace Core", description: "Burn 50,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 50000, tier: "rare" },
  { id: "calories-200000", title: "Wildfire", description: "Burn 200,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 200000, tier: "epic" },
  { id: "calories-1000000", title: "Sovereign's Furnace", description: "Burn 1,000,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 1000000, tier: "legendary" },

  // Level
  { id: "level-10", title: "D-Rank Awakening", description: "Reach hunter level 10.", metric: "level", targetValue: 10, tier: "common" },
  { id: "level-35", title: "B-Rank Ascension", description: "Reach hunter level 35.", metric: "level", targetValue: 35, tier: "rare" },
  { id: "level-70", title: "S-Rank Awakening", description: "Reach hunter level 70.", metric: "level", targetValue: 70, tier: "epic" },
  { id: "level-100", title: "National Level", description: "Reach hunter level 100.", metric: "level", targetValue: 100, tier: "legendary" },
  { id: "level-150", title: "S-Rank Transcendence", description: "Reach hunter level 150.", metric: "level", targetValue: 150, tier: "legendary" },
  { id: "level-200", title: "Peak of the Board", description: "Reach hunter level 200 — the edge of the rankings.", metric: "level", targetValue: 200, tier: "legendary" },

  // Time-of-day
  { id: "morning-1", title: "Morning Warrior", description: "Complete a workout before 7 AM.", metric: "morningWorkouts", targetValue: 1, tier: "common" },
  { id: "morning-25", title: "Dawn's Vanguard", description: "Complete 25 workouts before 7 AM.", metric: "morningWorkouts", targetValue: 25, tier: "rare" },
  { id: "morning-100", title: "Sunlit Vanguard", description: "Complete 100 workouts before 7 AM.", metric: "morningWorkouts", targetValue: 100, tier: "epic" },
  { id: "night-1", title: "Night Hunter", description: "Complete a workout after 10 PM.", metric: "nightWorkouts", targetValue: 1, tier: "common" },
  { id: "night-25", title: "Creature of Shadow", description: "Complete 25 workouts after 10 PM.", metric: "nightWorkouts", targetValue: 25, tier: "rare" },
  { id: "night-100", title: "Sovereign of Night", description: "Complete 100 workouts after 10 PM.", metric: "nightWorkouts", targetValue: 100, tier: "epic" },

  // Adventure — Gates cleared (see src/features/dungeons)
  { id: "dungeons-1", title: "First Gate", description: "Clear your first Gate.", metric: "totalDungeonsCleared", targetValue: 1, tier: "common" },
  { id: "dungeons-25", title: "Gatebreaker", description: "Clear 25 Gates.", metric: "totalDungeonsCleared", targetValue: 25, tier: "rare" },
  { id: "dungeons-100", title: "Warden of Thresholds", description: "Clear 100 Gates.", metric: "totalDungeonsCleared", targetValue: 100, tier: "epic" },
  { id: "dungeons-500", title: "Sovereign of Gates", description: "Clear 500 Gates.", metric: "totalDungeonsCleared", targetValue: 500, tier: "legendary" },

  // Adventure — Monsters defeated
  { id: "monsters-100", title: "Cull of the Weak", description: "Defeat 100 monsters.", metric: "totalMonstersDefeated", targetValue: 100, tier: "common" },
  { id: "monsters-1000", title: "Exterminator", description: "Defeat 1,000 monsters.", metric: "totalMonstersDefeated", targetValue: 1000, tier: "rare" },
  { id: "monsters-10000", title: "Harbinger of the Hunt", description: "Defeat 10,000 monsters.", metric: "totalMonstersDefeated", targetValue: 10000, tier: "epic" },

  // Adventure — Bosses defeated
  { id: "bosses-1", title: "Boss Slayer", description: "Defeat your first Gate boss.", metric: "totalBossesDefeated", targetValue: 1, tier: "rare" },
  { id: "bosses-25", title: "Bane of Sovereigns", description: "Defeat 25 Gate bosses.", metric: "totalBossesDefeated", targetValue: 25, tier: "epic" },
  { id: "bosses-100", title: "Sovereign's Reckoning", description: "Defeat 100 Gate bosses.", metric: "totalBossesDefeated", targetValue: 100, tier: "legendary" },

  // Adventure — Forge
  { id: "crafted-1", title: "First Forging", description: "Upgrade your first piece of equipment at the Forge.", metric: "totalItemsCrafted", targetValue: 1, tier: "common" },
  { id: "crafted-50", title: "Master Smith", description: "Upgrade equipment 50 times at the Forge.", metric: "totalItemsCrafted", targetValue: 50, tier: "epic" },
];
