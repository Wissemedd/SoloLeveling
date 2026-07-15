import * as Notifications from "expo-notifications";
import { randomNotificationFor } from "../data/notificationCopy";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const DAILY_REMINDER_ID = "solo-leveling.daily-gate-reminder";
const STREAK_RISK_ID = "solo-leveling.streak-at-risk";

export async function requestNotificationPermission(): Promise<boolean> {
  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
}

/** One local reminder per day at the given hour — the "gate opens" nudge. */
export async function scheduleDailyGateReminder(hour = 18, minute = 0): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_REMINDER_ID).catch(() => {});
  const { title, body } = randomNotificationFor("gate_reminder");
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_REMINDER_ID,
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

/** Fired once, same evening, only when the streak is genuinely on the line. */
export async function scheduleStreakAtRiskNudge(hour = 21, minute = 0): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(STREAK_RISK_ID).catch(() => {});
  const { title, body } = randomNotificationFor("streak_at_risk");
  const now = new Date();
  const trigger = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);
  if (trigger.getTime() <= now.getTime()) return;

  await Notifications.scheduleNotificationAsync({
    identifier: STREAK_RISK_ID,
    content: { title, body },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: trigger },
  });
}

export async function cancelAllScheduledNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
