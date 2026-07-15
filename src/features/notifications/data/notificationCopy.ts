export type NotificationTrigger =
  | "gate_reminder"
  | "boss_appeared"
  | "streak_at_risk"
  | "encouragement"
  | "morning_call";

export const notificationCopy: Record<NotificationTrigger, { title: string; body: string }[]> = {
  gate_reminder: [
    { title: "The Gate is Open", body: "The gate opens in 30 minutes. Hunters who arrive late still arrive." },
    { title: "A Quest Awaits", body: "Today's quest is ready. It won't complete itself." },
  ],
  boss_appeared: [
    { title: "A Boss Has Appeared", body: "This week's boss is active. Every workout deals damage." },
    { title: "Reckoning Begins", body: "The weekly boss won't fall on its own. Enter the gate." },
  ],
  streak_at_risk: [
    { title: "Your Discipline is Fading...", body: "Your streak is on the line. One quest keeps it alive." },
    { title: "Don't Break the Chain", body: "You've come this far. Don't let today be the gap." },
  ],
  encouragement: [
    { title: "Only True Hunters Train Today", body: "The weak rest by default. The strong rest by choice." },
    { title: "You Are Stronger Than Yesterday", body: "Prove it with one more rep than you think you have." },
  ],
  morning_call: [
    { title: "Dawn Breaks", body: "Early quests grant the same XP with none of the excuses." },
  ],
};

export function randomNotificationFor(trigger: NotificationTrigger) {
  const pool = notificationCopy[trigger];
  return pool[Math.floor(Math.random() * pool.length)];
}
