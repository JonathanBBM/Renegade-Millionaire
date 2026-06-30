import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppLoading, AppScreen } from '@/src/components/ui/AppShell';
import { useBattleReportData } from '@/src/hooks/useBattleReportData';
import { useAuth } from '@/src/providers/AuthProvider';
import { upsertDailyBattleReport, upsertWeeklyBattleReport } from '@/src/services/battleReport';
import {
  BattleActionTask,
  BattleHabit,
  DailyBattleReport,
  DailyBattleReportInput,
  WeeklyBattleReportInput,
} from '@/src/types/battleReport';

const warriorCategories = ['Warfare', 'Arsenal', 'Riches', 'Relationships', 'Identity & Purpose', 'Occupation', 'Resolve'];

type DailyForm = {
  actionTasks: BattleActionTask[];
  biggest_win: string;
  challenge_overcome: string;
  energy: string;
  executed_well: string;
  focus: string;
  follow_ups: string;
  gratitude: string;
  habits: BattleHabit[];
  lessons: string;
  missionPrioritiesText: string;
  mistake: string;
  self_improvement_hours: string;
  war_log: string;
  water_glasses: string;
  weight: string;
};

type WeeklyForm = {
  aligned_goals: boolean | null;
  aligned_goals_why_not: string;
  battle_objective: string;
  followed_priorities: boolean | null;
  followed_priorities_why_not: string;
  improve_area: string;
  improved_habits: boolean | null;
  improved_habits_why_not: string;
  keyTargetsText: string;
  lessonsText: string;
  new_strategy: string;
  next_week_battle_cry: string;
  stop_doing: string;
  victoriesText: string;
  warrior_score: string;
};

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function weekStartString(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

function splitLines(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function toNumber(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function dateDaysAgo(dateText: string, daysAgo: number) {
  const date = new Date(`${dateText}T00:00:00`);
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function normalizeHabitName(name: string) {
  return name.trim().toLowerCase();
}

function didCompleteHabit(report: DailyBattleReport | undefined, habitName: string) {
  const normalizedName = normalizeHabitName(habitName);
  if (!report || !normalizedName) return false;
  return report.habits.some((habit) => normalizeHabitName(habit.name) === normalizedName && habit.completed);
}

function computeHabitStreak(habit: BattleHabit, reportDate: string, history: DailyBattleReport[]) {
  if (!habit.completed || !habit.name.trim()) return 0;

  const historyByDate = new Map(history.filter((report) => report.report_date !== reportDate).map((report) => [report.report_date, report]));
  let streak = 1;

  for (let daysAgo = 1; daysAgo <= 29; daysAgo += 1) {
    const priorDate = dateDaysAgo(reportDate, daysAgo);
    const priorReport = historyByDate.get(priorDate);
    if (!didCompleteHabit(priorReport, habit.name)) break;
    streak += 1;
  }

  return streak;
}

function dayLabel(dateText: string) {
  const [, month, day] = dateText.split('-');
  return `${month}/${day}`;
}

const emptyDailyForm: DailyForm = {
  actionTasks: Array.from({ length: 4 }, () => ({ completed: false, text: '' })),
  biggest_win: '',
  challenge_overcome: '',
  energy: '',
  executed_well: '',
  focus: '',
  follow_ups: '',
  gratitude: '',
  habits: Array.from({ length: 4 }, () => ({ completed: false, name: '', streak: 0, target_date: '' })),
  lessons: '',
  missionPrioritiesText: '',
  mistake: '',
  self_improvement_hours: '',
  war_log: '',
  water_glasses: '',
  weight: '',
};

const emptyWeeklyForm: WeeklyForm = {
  aligned_goals: null,
  aligned_goals_why_not: '',
  battle_objective: '',
  followed_priorities: null,
  followed_priorities_why_not: '',
  improve_area: '',
  improved_habits: null,
  improved_habits_why_not: '',
  keyTargetsText: '',
  lessonsText: '',
  new_strategy: '',
  next_week_battle_cry: '',
  stop_doing: '',
  victoriesText: '',
  warrior_score: '',
};

export default function BattleReportScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [reportDate, setReportDate] = useState(todayString());
  const weekStartDate = useMemo(() => weekStartString(reportDate), [reportDate]);
  const { daily, dailyError, history, historyError, isLoading, weekly, weeklyError } = useBattleReportData(reportDate, weekStartDate);
  const [categoryFocus, setCategoryFocus] = useState<Record<string, string>>({});
  const [dailyForm, setDailyForm] = useState<DailyForm>(emptyDailyForm);
  const [weeklyForm, setWeeklyForm] = useState<WeeklyForm>(emptyWeeklyForm);
  const [isSavingDaily, setIsSavingDaily] = useState(false);
  const [isSavingWeekly, setIsSavingWeekly] = useState(false);
  const habitStreaks = useMemo(
    () => dailyForm.habits.map((habit) => computeHabitStreak(habit, reportDate, history)),
    [dailyForm.habits, history, reportDate],
  );
  const historyDays = useMemo(() => Array.from({ length: 14 }, (_, index) => dateDaysAgo(reportDate, 13 - index)), [reportDate]);

  useEffect(() => {
    if (!daily) {
      setCategoryFocus({});
      setDailyForm(emptyDailyForm);
      return;
    }

    setCategoryFocus(daily.category_focus ?? {});
    setDailyForm({
      actionTasks: [...daily.action_tasks, ...emptyDailyForm.actionTasks].slice(0, 4),
      biggest_win: daily.biggest_win ?? '',
      challenge_overcome: daily.challenge_overcome ?? '',
      energy: daily.energy ? String(daily.energy) : '',
      executed_well: daily.executed_well ?? '',
      focus: daily.focus ? String(daily.focus) : '',
      follow_ups: daily.follow_ups ?? '',
      gratitude: daily.gratitude ?? '',
      habits: [...daily.habits, ...emptyDailyForm.habits].slice(0, 4),
      lessons: daily.lessons ?? '',
      missionPrioritiesText: daily.mission_priorities.join('\n'),
      mistake: daily.mistake ?? '',
      self_improvement_hours: daily.self_improvement_hours ? String(daily.self_improvement_hours) : '',
      war_log: daily.war_log ?? '',
      water_glasses: daily.water_glasses ? String(daily.water_glasses) : '',
      weight: daily.weight ? String(daily.weight) : '',
    });
  }, [daily, reportDate]);

  useEffect(() => {
    if (!weekly) {
      setWeeklyForm(emptyWeeklyForm);
      return;
    }

    setWeeklyForm({
      aligned_goals: weekly.aligned_goals,
      aligned_goals_why_not: weekly.aligned_goals_why_not ?? '',
      battle_objective: weekly.battle_objective ?? '',
      followed_priorities: weekly.followed_priorities,
      followed_priorities_why_not: weekly.followed_priorities_why_not ?? '',
      improve_area: weekly.improve_area ?? '',
      improved_habits: weekly.improved_habits,
      improved_habits_why_not: weekly.improved_habits_why_not ?? '',
      keyTargetsText: weekly.key_targets.join('\n'),
      lessonsText: weekly.lessons.join('\n'),
      new_strategy: weekly.new_strategy ?? '',
      next_week_battle_cry: weekly.next_week_battle_cry ?? '',
      stop_doing: weekly.stop_doing ?? '',
      victoriesText: weekly.victories.join('\n'),
      warrior_score: weekly.warrior_score ? String(weekly.warrior_score) : '',
    });
  }, [weekly, weekStartDate]);

  function updateDaily<K extends keyof DailyForm>(key: K, value: DailyForm[K]) {
    setDailyForm((current) => ({ ...current, [key]: value }));
  }

  function updateWeekly<K extends keyof WeeklyForm>(key: K, value: WeeklyForm[K]) {
    setWeeklyForm((current) => ({ ...current, [key]: value }));
  }

  function updateHabit(index: number, patch: Partial<BattleHabit>) {
    setDailyForm((current) => {
      const habits = [...current.habits];
      habits[index] = { ...habits[index], ...patch };
      return { ...current, habits };
    });
  }

  function updateActionTask(index: number, patch: Partial<BattleActionTask>) {
    setDailyForm((current) => {
      const actionTasks = [...current.actionTasks];
      actionTasks[index] = { ...actionTasks[index], ...patch };
      return { ...current, actionTasks };
    });
  }

  async function refresh() {
    if (!user?.id) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['battle-report-daily', user.id, reportDate] }),
      queryClient.invalidateQueries({ queryKey: ['battle-report-history', user.id, reportDate] }),
      queryClient.invalidateQueries({ queryKey: ['battle-report-weekly', user.id, weekStartDate] }),
    ]);
  }

  async function saveDaily() {
    if (!user?.id || isSavingDaily) return;

    setIsSavingDaily(true);
    try {
      const input: DailyBattleReportInput = {
        action_tasks: dailyForm.actionTasks,
        biggest_win: dailyForm.biggest_win || null,
        category_focus: categoryFocus,
        challenge_overcome: dailyForm.challenge_overcome || null,
        energy: toNumber(dailyForm.energy),
        executed_well: dailyForm.executed_well || null,
        focus: toNumber(dailyForm.focus),
        follow_ups: dailyForm.follow_ups || null,
        gratitude: dailyForm.gratitude || null,
        habits: dailyForm.habits.map((habit, index) => ({ ...habit, streak: habitStreaks[index] ?? 0 })),
        lessons: dailyForm.lessons || null,
        mission_priorities: splitLines(dailyForm.missionPrioritiesText),
        mistake: dailyForm.mistake || null,
        report_date: reportDate,
        self_improvement_hours: toNumber(dailyForm.self_improvement_hours),
        war_log: dailyForm.war_log || null,
        water_glasses: toNumber(dailyForm.water_glasses),
        weight: toNumber(dailyForm.weight),
      };

      await upsertDailyBattleReport(user.id, input);
      await refresh();
      Alert.alert('Battle Report saved', 'Daily report updated.');
    } catch (error) {
      Alert.alert('Could not save daily report', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSavingDaily(false);
    }
  }

  async function saveWeekly() {
    if (!user?.id || isSavingWeekly) return;

    setIsSavingWeekly(true);
    try {
      const input: WeeklyBattleReportInput = {
        aligned_goals: weeklyForm.aligned_goals,
        aligned_goals_why_not: weeklyForm.aligned_goals_why_not || null,
        battle_objective: weeklyForm.battle_objective || null,
        followed_priorities: weeklyForm.followed_priorities,
        followed_priorities_why_not: weeklyForm.followed_priorities_why_not || null,
        improve_area: weeklyForm.improve_area || null,
        improved_habits: weeklyForm.improved_habits,
        improved_habits_why_not: weeklyForm.improved_habits_why_not || null,
        key_targets: splitLines(weeklyForm.keyTargetsText),
        lessons: splitLines(weeklyForm.lessonsText),
        new_strategy: weeklyForm.new_strategy || null,
        next_week_battle_cry: weeklyForm.next_week_battle_cry || null,
        stop_doing: weeklyForm.stop_doing || null,
        victories: splitLines(weeklyForm.victoriesText),
        warrior_score: toNumber(weeklyForm.warrior_score),
        week_label: `Week of ${weekStartDate}`,
        week_start_date: weekStartDate,
      };

      await upsertWeeklyBattleReport(user.id, input);
      await refresh();
      Alert.alert('Weekly reset saved', 'Weekly Battle Report updated.');
    } catch (error) {
      Alert.alert('Could not save weekly reset', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSavingWeekly(false);
    }
  }

  if (isLoading) {
    return <AppLoading label="Loading Battle Report..." />;
  }

  if (dailyError || weeklyError || historyError) {
    return (
      <AppScreen>
        <Text style={styles.title}>Battle Report unavailable</Text>
        <Text style={styles.copy}>{(dailyError ?? weeklyError ?? historyError)?.message ?? 'Could not load Battle Report.'}</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Phase 5</Text>
          <Text style={styles.title}>Battle Report</Text>
          <Text style={styles.copy}>Run the day from mission priorities, habit streaks, and honest evening review.</Text>
          <Field label="Report date" onChangeText={setReportDate} value={reportDate} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>History & Streaks</Text>
          <Text style={styles.copy}>Streaks are calculated from completed habits in prior daily reports with the same habit name.</Text>
          <View style={styles.historyStrip}>
            {historyDays.map((dateText) => {
              const report = history.find((item) => item.report_date === dateText);
              const completedHabits = report?.habits.filter((habit) => habit.completed).length ?? 0;
              const completedTasks = report?.action_tasks.filter((task) => task.completed).length ?? 0;
              const isCurrentDate = dateText === reportDate;
              return (
                <View key={dateText} style={[styles.historyDay, isCurrentDate ? styles.historyDayActive : null]}>
                  <Text style={styles.historyDate}>{dayLabel(dateText)}</Text>
                  <Text style={styles.historyMetric}>{report ? `${completedHabits}H/${completedTasks}T` : '-'}</Text>
                </View>
              );
            })}
          </View>
          {dailyForm.habits.some((habit) => habit.name.trim()) ? (
            <View style={styles.streakGrid}>
              {dailyForm.habits
                .map((habit, index) => ({ habit, index, streak: habitStreaks[index] ?? 0 }))
                .filter(({ habit }) => habit.name.trim())
                .map(({ habit, index, streak }) => (
                  <View key={`${habit.name}-${index}`} style={styles.streakCard}>
                    <Text style={styles.label}>Computed streak</Text>
                    <Text style={styles.streakValue}>{streak}</Text>
                    <Text style={styles.copy}>{habit.name}</Text>
                  </View>
                ))}
            </View>
          ) : (
            <Text style={styles.muted}>Add habits below to preview computed streaks.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Morning Setup</Text>
          <View style={styles.grid}>
            <Field keyboardType="numeric" label="Energy 1-10" onChangeText={(value) => updateDaily('energy', value)} value={dailyForm.energy} />
            <Field keyboardType="numeric" label="Focus 1-10" onChangeText={(value) => updateDaily('focus', value)} value={dailyForm.focus} />
            <Field keyboardType="numeric" label="Weight" onChangeText={(value) => updateDaily('weight', value)} value={dailyForm.weight} />
            <Field keyboardType="numeric" label="Water glasses" onChangeText={(value) => updateDaily('water_glasses', value)} value={dailyForm.water_glasses} />
          </View>
          <Text style={styles.label}>WARRIOR category focus</Text>
          {warriorCategories.map((category) => (
            <Field
              key={category}
              label={category}
              onChangeText={(value) => setCategoryFocus((current) => ({ ...current, [category]: value }))}
              value={categoryFocus[category] ?? ''}
            />
          ))}
          <Field
            label="Top mission priorities"
            multiline
            onChangeText={(value) => updateDaily('missionPrioritiesText', value)}
            placeholder="One priority per line"
            value={dailyForm.missionPrioritiesText}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habits & Action Tasks</Text>
          {dailyForm.habits.map((habit, index) => (
            <View key={`habit-${index}`} style={styles.rowBox}>
              <Text style={styles.rowTitle}>Habit {index + 1}</Text>
              <Field label="Habit" onChangeText={(value) => updateHabit(index, { name: value })} value={habit.name} />
              <View style={styles.grid}>
                <Field label="Target date" onChangeText={(value) => updateHabit(index, { target_date: value })} value={habit.target_date} />
                <View style={styles.computedBox}>
                  <Text style={styles.label}>Computed streak</Text>
                  <Text style={styles.computedValue}>{habitStreaks[index] ?? 0}</Text>
                </View>
              </View>
              <Toggle label="Done today" onChange={(value) => updateHabit(index, { completed: value })} value={habit.completed} />
            </View>
          ))}
          {dailyForm.actionTasks.map((task, index) => (
            <View key={`task-${index}`} style={styles.rowBox}>
              <Text style={styles.rowTitle}>Action Task {index + 1}</Text>
              <Field label="Task" onChangeText={(value) => updateActionTask(index, { text: value })} value={task.text} />
              <Toggle label="Complete" onChange={(value) => updateActionTask(index, { completed: value })} value={task.completed} />
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Evening Reflection</Text>
          <Field label="War log" multiline onChangeText={(value) => updateDaily('war_log', value)} value={dailyForm.war_log} />
          <Field label="Follow-ups" multiline onChangeText={(value) => updateDaily('follow_ups', value)} value={dailyForm.follow_ups} />
          <Field label="Lessons" multiline onChangeText={(value) => updateDaily('lessons', value)} value={dailyForm.lessons} />
          <Field label="Biggest win" multiline onChangeText={(value) => updateDaily('biggest_win', value)} value={dailyForm.biggest_win} />
          <Field label="Executed well" multiline onChangeText={(value) => updateDaily('executed_well', value)} value={dailyForm.executed_well} />
          <Field label="Challenge overcome" multiline onChangeText={(value) => updateDaily('challenge_overcome', value)} value={dailyForm.challenge_overcome} />
          <Field label="Mistake" multiline onChangeText={(value) => updateDaily('mistake', value)} value={dailyForm.mistake} />
          <Field label="Gratitude" multiline onChangeText={(value) => updateDaily('gratitude', value)} value={dailyForm.gratitude} />
          <Field
            keyboardType="numeric"
            label="Self-improvement hours"
            onChangeText={(value) => updateDaily('self_improvement_hours', value)}
            value={dailyForm.self_improvement_hours}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save daily Battle Report"
            disabled={isSavingDaily}
            onPress={saveDaily}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{isSavingDaily ? 'Saving...' : 'Save Daily Report'}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Weekly Reflection & Reset</Text>
          <Text style={styles.muted}>Week starts {weekStartDate}</Text>
          <Field label="Battle objective" multiline onChangeText={(value) => updateWeekly('battle_objective', value)} value={weeklyForm.battle_objective} />
          <Field label="Key targets" multiline onChangeText={(value) => updateWeekly('keyTargetsText', value)} value={weeklyForm.keyTargetsText} />
          <Field label="Victories" multiline onChangeText={(value) => updateWeekly('victoriesText', value)} value={weeklyForm.victoriesText} />
          <Field label="Lessons" multiline onChangeText={(value) => updateWeekly('lessonsText', value)} value={weeklyForm.lessonsText} />
          <Toggle label="Aligned with goals" onChange={(value) => updateWeekly('aligned_goals', value)} value={Boolean(weeklyForm.aligned_goals)} />
          <Field label="If not, why?" multiline onChangeText={(value) => updateWeekly('aligned_goals_why_not', value)} value={weeklyForm.aligned_goals_why_not} />
          <Toggle label="Followed priorities" onChange={(value) => updateWeekly('followed_priorities', value)} value={Boolean(weeklyForm.followed_priorities)} />
          <Field label="Priority notes" multiline onChangeText={(value) => updateWeekly('followed_priorities_why_not', value)} value={weeklyForm.followed_priorities_why_not} />
          <Toggle label="Improved habits" onChange={(value) => updateWeekly('improved_habits', value)} value={Boolean(weeklyForm.improved_habits)} />
          <Field label="Habit notes" multiline onChangeText={(value) => updateWeekly('improved_habits_why_not', value)} value={weeklyForm.improved_habits_why_not} />
          <Field label="Area to improve" multiline onChangeText={(value) => updateWeekly('improve_area', value)} value={weeklyForm.improve_area} />
          <Field label="New strategy" multiline onChangeText={(value) => updateWeekly('new_strategy', value)} value={weeklyForm.new_strategy} />
          <Field label="Stop doing" multiline onChangeText={(value) => updateWeekly('stop_doing', value)} value={weeklyForm.stop_doing} />
          <Field keyboardType="numeric" label="Warrior score" onChangeText={(value) => updateWeekly('warrior_score', value)} value={weeklyForm.warrior_score} />
          <Field label="Next week battle cry" multiline onChangeText={(value) => updateWeekly('next_week_battle_cry', value)} value={weeklyForm.next_week_battle_cry} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save weekly Battle Report reset"
            disabled={isSavingWeekly}
            onPress={saveWeekly}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{isSavingWeekly ? 'Saving...' : 'Save Weekly Reset'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function Field({
  keyboardType,
  label,
  multiline,
  onChangeText,
  placeholder,
  value,
}: {
  keyboardType?: 'default' | 'numeric';
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder?: string;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        keyboardType={keyboardType ?? 'default'}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder ?? label}
        placeholderTextColor="#828a80"
        style={[styles.input, multiline ? styles.textArea : null]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
    </View>
  );
}

function Toggle({ label, onChange, value }: { label: string; onChange: (value: boolean) => void; value: boolean }) {
  return (
    <Pressable onPress={() => onChange(!value)} style={[styles.toggle, value ? styles.toggleActive : null]}>
      <View style={[styles.checkbox, value ? styles.checkboxActive : null]}>
        {value ? <Text style={styles.checkmark}>✓</Text> : null}
      </View>
      <Text style={styles.toggleText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: '#596052',
    borderRadius: 6,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  checkmark: { color: '#14170f', fontSize: 14, fontWeight: '900' },
  computedBox: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    justifyContent: 'center',
    minHeight: 48,
    minWidth: 180,
    padding: 12,
  },
  computedValue: { color: '#f5f1e8', fontSize: 20, fontWeight: '900' },
  content: { gap: 16, paddingBottom: 40 },
  copy: { color: '#c7cdbf', fontSize: 16, lineHeight: 23 },
  field: { gap: 7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  header: { gap: 8 },
  historyDate: { color: '#8d9488', fontSize: 11, fontWeight: '800' },
  historyDay: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    gap: 3,
    minWidth: 64,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  historyDayActive: { borderColor: '#d5a84c' },
  historyMetric: { color: '#f5f1e8', fontSize: 13, fontWeight: '900' },
  historyStrip: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  input: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f5f1e8',
    fontSize: 16,
    minHeight: 48,
    minWidth: 180,
    padding: 12,
  },
  kicker: { color: '#d5a84c', fontSize: 13, fontWeight: '800', letterSpacing: 0, textTransform: 'uppercase' },
  label: { color: '#8d9488', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  muted: { color: '#8d9488', fontSize: 14, lineHeight: 20 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#d5a84c',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#14170f', fontSize: 15, fontWeight: '900' },
  rowBox: { borderColor: '#2d342b', borderRadius: 8, borderWidth: 1, gap: 10, padding: 12 },
  rowTitle: { color: '#d5a84c', fontSize: 13, fontWeight: '900' },
  sectionTitle: { color: '#f5f1e8', fontSize: 20, fontWeight: '900', lineHeight: 25 },
  streakCard: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minWidth: 180,
    padding: 12,
  },
  streakGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  streakValue: { color: '#d5a84c', fontSize: 28, fontWeight: '900' },
  textArea: { minHeight: 104 },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', lineHeight: 39 },
  toggle: {
    alignItems: 'center',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  toggleActive: { borderColor: '#d5a84c' },
  toggleText: { color: '#f5f1e8', fontSize: 15, fontWeight: '800' },
});
