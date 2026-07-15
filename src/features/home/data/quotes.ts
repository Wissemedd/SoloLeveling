export const dailyQuotes: string[] = [
  "The weak stay weak by choice. Today, choose otherwise.",
  "Every gate you avoid gets harder to close.",
  "Strength is a debt you repay one rep at a time.",
  "You are not who you were yesterday. Prove it.",
  "Discipline is the quiet version of power.",
  "The hunter who shows up beats the hunter who's talented.",
  "Comfort is the first monster you must defeat today.",
  "A rank is earned in silence, long before anyone notices.",
  "Your future self is watching what you do right now.",
  "Small quests, repeated, become legendary streaks.",
  "The gate doesn't care how you feel. Neither should you.",
  "Growth hides inside the rep you wanted to skip.",
];

/** Deterministic per-day pick so the quote doesn't change on re-render or app restart. */
export function quoteForDate(date: Date = new Date()): string {
  const dayIndex = Math.floor(date.getTime() / 86_400_000);
  return dailyQuotes[dayIndex % dailyQuotes.length];
}
