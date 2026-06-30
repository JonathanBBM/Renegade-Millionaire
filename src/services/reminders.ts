import { supabase } from '@/src/lib/supabase';
import { Reminder, ReminderInput, ReminderPayload, ReminderSchedule } from '@/src/types/reminders';

function toSchedule(value: unknown): ReminderSchedule {
  if (typeof value !== 'object' || value === null) return {};
  const row = value as ReminderSchedule;
  return {
    day: row.day ? String(row.day) : undefined,
    frequency: row.frequency,
    time: row.time ? String(row.time) : undefined,
  };
}

function toPayload(value: unknown): ReminderPayload {
  if (typeof value !== 'object' || value === null) return {};
  const row = value as ReminderPayload;
  return {
    label: row.label ? String(row.label) : undefined,
    routine_id: row.routine_id ? String(row.routine_id) : undefined,
  };
}

function normalizeReminder(row: Reminder): Reminder {
  return {
    ...row,
    payload: toPayload(row.payload),
    schedule: toSchedule(row.schedule),
  };
}

export async function fetchReminders(userId: string) {
  const { data, error } = await supabase
    .from('reminders')
    .select('id,user_id,reminder_type,schedule,timezone,payload,is_enabled,created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => normalizeReminder(row as Reminder));
}

export async function createReminder(userId: string, input: ReminderInput) {
  const { error } = await supabase.from('reminders').insert({
    is_enabled: input.is_enabled ?? true,
    payload: input.payload,
    reminder_type: input.reminder_type,
    schedule: input.schedule,
    timezone: input.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function setReminderEnabled(userId: string, reminderId: string, isEnabled: boolean) {
  const { error } = await supabase
    .from('reminders')
    .update({ is_enabled: isEnabled, updated_at: new Date().toISOString() })
    .eq('id', reminderId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function deleteReminder(userId: string, reminderId: string) {
  const { error } = await supabase.from('reminders').delete().eq('id', reminderId).eq('user_id', userId);

  if (error) {
    throw error;
  }
}
