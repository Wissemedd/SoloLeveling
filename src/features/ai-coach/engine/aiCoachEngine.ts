import type { CoachContext, CoachTip, CoachTipCategory } from "../types";

/**
 * Rule-based placeholder for the AI Coach. It reasons over the same signals
 * a real model would (streak risk, energy, recent load, momentum) so the
 * call site never has to change shape. Swap the body of `generateCoachTip`
 * for a call to an LLM (e.g. the Claude API with a player-telemetry prompt)
 * once that integration exists — `CoachContext` is already the payload
 * you'd send.
 */
const MESSAGE_POOL: Record<CoachTipCategory, string[]> = {
  streak_warning: [
    "Your discipline is fading — one quest today keeps the streak alive.",
    "The gate closes at midnight. Don't let today be the day you stopped.",
  ],
  recovery_suggestion: [
    "Your energy is low. A mobility or recovery session will hit harder than skipping entirely.",
    "Hunters who rest smart outlast hunters who grind blind. Consider a lighter session today.",
  ],
  intensity_adjustment: [
    "Six sessions this week — strong. Consider a lighter day so the gains actually land.",
    "You're pushing hard. A deload day now prevents a forced one later.",
  ],
  comeback_encouragement: [
    "It's been a few days. The gate doesn't judge — it just waits. Step back in.",
    "Momentum is easier to keep than to rebuild. One small quest today restarts it.",
  ],
  celebration: [
    "Strength stat rising. Whatever you're doing, it's working — keep going.",
    "Consistent, not perfect. That's exactly how ranks are earned.",
  ],
};

function pick(category: CoachTipCategory): CoachTip {
  const pool = MESSAGE_POOL[category];
  return { category, message: pool[Math.floor(Math.random() * pool.length)] };
}

export function generateCoachTip(context: CoachContext): CoachTip {
  if (context.isStreakAtRisk) return pick("streak_warning");
  if (context.energy < 30) return pick("recovery_suggestion");
  if (context.workoutsInLast7Days >= 6) return pick("intensity_adjustment");
  if (context.daysSinceLastWorkout !== null && context.daysSinceLastWorkout >= 2) {
    return pick("comeback_encouragement");
  }
  return pick("celebration");
}
