export type ReminderType = 'habit' | 'quote' | 'module-unlock' | 'battle-report';

export type ReminderSchedule = {
  day?: string;
  frequency?: 'daily' | 'weekdays' | 'weekly';
  time?: string;
};

export type ReminderPayload = {
  label?: string;
  routine_id?: string;
};

export type Reminder = {
  created_at: string;
  id: string;
  is_enabled: boolean;
  payload: ReminderPayload;
  reminder_type: ReminderType;
  schedule: ReminderSchedule;
  timezone: string | null;
  user_id: string;
};

export type ReminderInput = {
  is_enabled?: boolean;
  payload: ReminderPayload;
  reminder_type: ReminderType;
  schedule: ReminderSchedule;
  timezone?: string | null;
};
