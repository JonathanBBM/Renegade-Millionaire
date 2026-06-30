import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { Reminder } from '@/src/types/reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function parseTime(timeText?: string) {
  if (!timeText) return null;
  const [hourText, minuteText] = timeText.split(':');
  const hour = Number(hourText);
  const minute = Number(minuteText);
  if (!Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function notificationContent(reminder: Reminder) {
  const label = reminder.payload.label ?? reminder.reminder_type.replace('-', ' ');
  if (reminder.reminder_type === 'battle-report') {
    return { body: 'Open your Battle Report and set the day in motion.', title: label };
  }
  if (reminder.reminder_type === 'quote') {
    return { body: 'Read today\'s quote and reinforce the standard.', title: label };
  }
  if (reminder.reminder_type === 'module-unlock') {
    return { body: 'Continue the next course move.', title: label };
  }
  return { body: 'Complete the habit you committed to.', title: label };
}

export async function syncLocalNotifications(reminders: Reminder[]) {
  if (Platform.OS === 'web') {
    return { scheduledCount: 0, skippedReason: 'Local notifications are only scheduled on native iOS and Android builds.' };
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('renegade-millionaire', {
      importance: Notifications.AndroidImportance.MAX,
      name: 'Renegade Millionaire',
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const permissions = await Notifications.getPermissionsAsync();
  const finalPermissions = permissions.status === 'granted' ? permissions : await Notifications.requestPermissionsAsync();
  if (finalPermissions.status !== 'granted') {
    return { scheduledCount: 0, skippedReason: 'Notification permission was not granted.' };
  }

  await Notifications.cancelAllScheduledNotificationsAsync();

  let scheduledCount = 0;
  for (const reminder of reminders.filter((item) => item.is_enabled)) {
    const parsedTime = parseTime(reminder.schedule.time);
    if (!parsedTime) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        ...notificationContent(reminder),
        data: { reminderId: reminder.id, reminderType: reminder.reminder_type },
      },
      trigger: {
        channelId: 'renegade-millionaire',
        hour: parsedTime.hour,
        minute: parsedTime.minute,
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
      },
    });
    scheduledCount += 1;
  }

  return { scheduledCount, skippedReason: null };
}
