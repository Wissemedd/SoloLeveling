import type { FitnessGoal, FitnessLevel } from "@/features/player/types";

export const goalOptions: { value: FitnessGoal; label: string; description: string }[] = [
  { value: "lose_fat", label: "Lose Fat", description: "Cut through the excess, reveal the hunter beneath." },
  { value: "build_muscle", label: "Build Muscle", description: "Forge raw strength, one set at a time." },
  { value: "get_stronger", label: "Get Stronger", description: "Chase heavier lifts and harder reps." },
  { value: "improve_cardio", label: "Improve Cardio", description: "Outlast anything the gate throws at you." },
  { value: "healthy_lifestyle", label: "Healthy Lifestyle", description: "Consistency over intensity, every day." },
  { value: "hybrid_athlete", label: "Hybrid Athlete", description: "Strength, speed, and endurance — all of it." },
];

export const fitnessLevelOptions: { value: FitnessLevel; label: string; description: string }[] = [
  { value: "beginner", label: "Beginner", description: "New to training, or returning after a break." },
  { value: "intermediate", label: "Intermediate", description: "Training consistently for a few months." },
  { value: "advanced", label: "Advanced", description: "Years of consistent, structured training." },
  { value: "elite", label: "Elite", description: "Competitive-level conditioning." },
];
