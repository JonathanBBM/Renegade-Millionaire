import { supabase } from '@/src/lib/supabase';
import {
  BattleActionTask,
  BattleHabit,
  DailyBattleReport,
  DailyBattleReportInput,
  WeeklyBattleReport,
  WeeklyBattleReportInput,
} from '@/src/types/battleReport';

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function toHabits(value: unknown): BattleHabit[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as Partial<BattleHabit>;
    return {
      completed: Boolean(row.completed),
      name: String(row.name ?? ''),
      streak: Number(row.streak ?? 0),
      target_date: String(row.target_date ?? ''),
    };
  });
}

function toActionTasks(value: unknown): BattleActionTask[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const row = item as Partial<BattleActionTask>;
    return {
      completed: Boolean(row.completed),
      text: String(row.text ?? ''),
    };
  });
}

function normalizeDaily(row: DailyBattleReport): DailyBattleReport {
  return {
    ...row,
    action_tasks: toActionTasks(row.action_tasks),
    category_focus: typeof row.category_focus === 'object' && row.category_focus !== null ? row.category_focus : {},
    habits: toHabits(row.habits),
    mission_priorities: toStringArray(row.mission_priorities),
  };
}

function normalizeWeekly(row: WeeklyBattleReport): WeeklyBattleReport {
  return {
    ...row,
    key_targets: toStringArray(row.key_targets),
    lessons: toStringArray(row.lessons),
    victories: toStringArray(row.victories),
  };
}

export async function fetchDailyBattleReport(userId: string, reportDate: string) {
  const { data, error } = await supabase
    .from('battle_reports_daily')
    .select('*')
    .eq('user_id', userId)
    .eq('report_date', reportDate)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeDaily(data as DailyBattleReport) : null;
}

function dateDaysAgo(dateText: string, daysAgo: number) {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

export async function fetchDailyBattleReportHistory(userId: string, endDate: string, days = 30) {
  const startDate = dateDaysAgo(endDate, days - 1);
  const { data, error } = await supabase
    .from('battle_reports_daily')
    .select('*')
    .eq('user_id', userId)
    .gte('report_date', startDate)
    .lte('report_date', endDate)
    .order('report_date', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => normalizeDaily(row as DailyBattleReport));
}

export async function upsertDailyBattleReport(userId: string, input: DailyBattleReportInput) {
  const { error } = await supabase.from('battle_reports_daily').upsert(
    {
      ...input,
      action_tasks: input.action_tasks.filter((task) => task.text.trim()),
      habits: input.habits.filter((habit) => habit.name.trim()),
      mission_priorities: input.mission_priorities.filter(Boolean),
      updated_at: new Date().toISOString(),
      user_id: userId,
    },
    { onConflict: 'user_id,report_date' },
  );

  if (error) {
    throw error;
  }
}

export async function fetchWeeklyBattleReport(userId: string, weekStartDate: string) {
  const { data, error } = await supabase
    .from('battle_reports_weekly')
    .select('*')
    .eq('user_id', userId)
    .eq('week_start_date', weekStartDate)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeWeekly(data as WeeklyBattleReport) : null;
}

export async function upsertWeeklyBattleReport(userId: string, input: WeeklyBattleReportInput) {
  const { error } = await supabase.from('battle_reports_weekly').upsert(
    {
      ...input,
      key_targets: input.key_targets.filter(Boolean),
      lessons: input.lessons.filter(Boolean),
      updated_at: new Date().toISOString(),
      user_id: userId,
      victories: input.victories.filter(Boolean),
    },
    { onConflict: 'user_id,week_start_date' },
  );

  if (error) {
    throw error;
  }
}
