import type { MissionTemplate } from "../types";

export const missionTemplates: MissionTemplate[] = [
  // Daily
  { id: "daily-pushups-100", title: "Century Push", description: "Complete 100 push-ups today, in any number of sets.", period: "daily", metric: "pushups", targetValue: 100, xpReward: 60, goldReward: 15 },
  { id: "daily-walk-5k", title: "Ground Cleared", description: "Walk 5 km before the day ends.", period: "daily", metric: "distance_km", targetValue: 5, xpReward: 50, goldReward: 15 },
  { id: "daily-water-3l", title: "Hydration Protocol", description: "Drink 3 liters of water.", period: "daily", metric: "water_liters", targetValue: 3, xpReward: 30, goldReward: 10 },
  { id: "daily-early-bird", title: "Dawn Hunter", description: "Complete a workout before 8 AM.", period: "daily", metric: "early_workout", targetValue: 1, xpReward: 45, goldReward: 15 },
  { id: "daily-burn-600", title: "Furnace Mode", description: "Burn 600 calories across your workouts today.", period: "daily", metric: "calories_burned", targetValue: 600, xpReward: 70, goldReward: 20 },
  { id: "daily-stretch-20", title: "Loosen the Joints", description: "Stretch for 20 minutes.", period: "daily", metric: "stretch_minutes", targetValue: 20, xpReward: 35, goldReward: 10 },
  { id: "daily-workout-1", title: "One Quest, No Excuses", description: "Complete at least one workout today.", period: "daily", metric: "workouts_completed", targetValue: 1, xpReward: 40, goldReward: 12 },
  { id: "daily-meditate-10", title: "Still Mind", description: "Meditate for 10 minutes.", period: "daily", metric: "meditation_minutes", targetValue: 10, xpReward: 30, goldReward: 10 },

  // Weekly
  { id: "weekly-streak-7", title: "Seven-Day Vow", description: "Keep a 7-day streak alive through the week.", period: "weekly", metric: "streak_days", targetValue: 7, xpReward: 220, goldReward: 60 },
  { id: "weekly-workouts-5", title: "Five Trials", description: "Complete 5 workouts this week.", period: "weekly", metric: "workouts_completed", targetValue: 5, xpReward: 200, goldReward: 55 },
  { id: "weekly-distance-20", title: "The Long Road", description: "Cover 20 km on foot this week.", period: "weekly", metric: "distance_km", targetValue: 20, xpReward: 180, goldReward: 50 },
  { id: "weekly-burn-3000", title: "Weekly Incineration", description: "Burn 3000 calories this week.", period: "weekly", metric: "calories_burned", targetValue: 3000, xpReward: 240, goldReward: 65 },

  // Monthly
  { id: "monthly-workouts-20", title: "Twenty Gates", description: "Complete 20 workouts this month.", period: "monthly", metric: "workouts_completed", targetValue: 20, xpReward: 900, goldReward: 220 },
  { id: "monthly-streak-25", title: "Unwavering Discipline", description: "Log a 25-day streak within this month.", period: "monthly", metric: "streak_days", targetValue: 25, xpReward: 1000, goldReward: 250 },

  // Legendary (rare, high-effort, long fuse)
  { id: "legendary-pushups-3000", title: "Trial of a Thousand Dawns", description: "Accumulate 3,000 push-ups across a full month.", period: "legendary", metric: "pushups", targetValue: 3000, xpReward: 2500, goldReward: 600 },
  { id: "legendary-distance-100", title: "The Hundred-Kilometer Oath", description: "Cover 100 km on foot within a month.", period: "legendary", metric: "distance_km", targetValue: 100, xpReward: 2200, goldReward: 550 },
];
