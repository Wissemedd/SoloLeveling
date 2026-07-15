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

  // Push-ups
  { id: "pushups-100", title: "Century Fists", description: "Bank 100 lifetime push-ups.", metric: "totalPushups", targetValue: 100, tier: "common" },
  { id: "pushups-1000", title: "Iron Chest", description: "Bank 1,000 lifetime push-ups.", metric: "totalPushups", targetValue: 1000, tier: "rare" },
  { id: "pushups-10000", title: "Foundation of Steel", description: "Bank 10,000 lifetime push-ups.", metric: "totalPushups", targetValue: 10000, tier: "epic" },

  // Distance
  { id: "distance-10", title: "First Mile Marker", description: "Cover 10 km on foot.", metric: "totalDistanceKm", targetValue: 10, tier: "common" },
  { id: "distance-50", title: "Wanderer", description: "Cover 50 km on foot.", metric: "totalDistanceKm", targetValue: 50, tier: "common" },
  { id: "distance-100", title: "Pathfinder", description: "Cover 100 km on foot.", metric: "totalDistanceKm", targetValue: 100, tier: "rare" },
  { id: "distance-500", title: "Roadbound Hunter", description: "Cover 500 km on foot.", metric: "totalDistanceKm", targetValue: 500, tier: "epic" },
  { id: "distance-1000", title: "Horizon Chaser", description: "Cover 1,000 km on foot.", metric: "totalDistanceKm", targetValue: 1000, tier: "legendary" },

  // Streak
  { id: "streak-7", title: "One Week Vow", description: "Reach a 7-day streak.", metric: "longestStreak", targetValue: 7, tier: "common" },
  { id: "streak-30", title: "No Excuse", description: "Reach a 30-day streak.", metric: "longestStreak", targetValue: 30, tier: "rare" },
  { id: "streak-100", title: "Unshakable", description: "Reach a 100-day streak.", metric: "longestStreak", targetValue: 100, tier: "epic" },
  { id: "streak-365", title: "Full Cycle", description: "Reach a 365-day streak.", metric: "longestStreak", targetValue: 365, tier: "legendary" },

  // Calories
  { id: "calories-5000", title: "Spark Ignited", description: "Burn 5,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 5000, tier: "common" },
  { id: "calories-50000", title: "Furnace Core", description: "Burn 50,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 50000, tier: "rare" },
  { id: "calories-200000", title: "Wildfire", description: "Burn 200,000 lifetime calories.", metric: "totalCaloriesBurned", targetValue: 200000, tier: "epic" },

  // Level
  { id: "level-10", title: "D-Rank Awakening", description: "Reach hunter level 10.", metric: "level", targetValue: 10, tier: "common" },
  { id: "level-35", title: "B-Rank Ascension", description: "Reach hunter level 35.", metric: "level", targetValue: 35, tier: "rare" },
  { id: "level-70", title: "S-Rank Awakening", description: "Reach hunter level 70.", metric: "level", targetValue: 70, tier: "epic" },
  { id: "level-100", title: "National Level", description: "Reach hunter level 100.", metric: "level", targetValue: 100, tier: "legendary" },

  // Time-of-day
  { id: "morning-1", title: "Morning Warrior", description: "Complete a workout before 7 AM.", metric: "morningWorkouts", targetValue: 1, tier: "common" },
  { id: "morning-25", title: "Dawn's Vanguard", description: "Complete 25 workouts before 7 AM.", metric: "morningWorkouts", targetValue: 25, tier: "rare" },
  { id: "night-1", title: "Night Hunter", description: "Complete a workout after 10 PM.", metric: "nightWorkouts", targetValue: 1, tier: "common" },
  { id: "night-25", title: "Creature of Shadow", description: "Complete 25 workouts after 10 PM.", metric: "nightWorkouts", targetValue: 25, tier: "rare" },
];
