import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useBattleReportData } from '@/src/hooks/useBattleReportData';
import { useCourseData } from '@/src/hooks/useCourseData';
import { useGoalsData } from '@/src/hooks/useGoalsData';
import { useAuth } from '@/src/providers/AuthProvider';
import { fetchQuotes, pickDailyQuote } from '@/src/services/dashboard';
import { getAllSections, getModuleStatus, getProgressMap } from '@/src/services/course';

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

export default function DashboardScreen() {
  const { profile, user } = useAuth();
  const dateText = todayString();
  const weekStartDate = weekStartString(dateText);
  const { isLoading: courseLoading, modules, progress } = useCourseData();
  const { goals, isLoading: goalsLoading } = useGoalsData();
  const { daily, isLoading: battleLoading, weekly } = useBattleReportData(dateText, weekStartDate);
  const quotesQuery = useQuery({ queryFn: fetchQuotes, queryKey: ['quotes'] });

  const progressMap = useMemo(() => getProgressMap(progress), [progress]);
  const allSections = useMemo(() => getAllSections(modules).filter((section) => section.is_required), [modules]);
  const completedSections = allSections.filter((section) => progressMap.get(section.id)?.status === 'complete').length;
  const coursePercent = allSections.length > 0 ? Math.round((completedSections / allSections.length) * 100) : 0;
  const nextModule = modules.find((module) => getModuleStatus(modules, module, progressMap) !== 'complete');
  const activeGoals = goals.filter((goal) => goal.status === 'active');
  const topGoal = activeGoals[0] ?? goals[0] ?? null;
  const quote = pickDailyQuote(quotesQuery.data ?? [], dateText);
  const priorities = daily?.mission_priorities ?? [];
  const habitsDone = daily?.habits.filter((habit) => habit.completed).length ?? 0;
  const habitsTotal = daily?.habits.length ?? 0;

  const isLoading = courseLoading || goalsLoading || battleLoading || quotesQuery.isLoading;

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading command center...</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Command Center</Text>
          <Text style={styles.title}>Win Today</Text>
          <Text style={styles.copy}>Signed in as {profile?.full_name || user?.email}</Text>
        </View>

        <View style={styles.stats}>
          <Metric label="Course" value={`${coursePercent}%`} />
          <Metric label="Active Goals" value={String(activeGoals.length)} />
          <Metric label="Today Focus" value={daily?.focus ? `${daily.focus}/10` : '-'} />
          <Metric label="Habits" value={habitsTotal > 0 ? `${habitsDone}/${habitsTotal}` : '-'} />
        </View>

        {quote ? (
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>{quote.text}</Text>
            <Text style={styles.quoteAuthor}>{quote.author ?? 'Renegade Millionaire'}</Text>
          </View>
        ) : null}

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Next Course Move</Text>
            <Text style={styles.cardValue}>{nextModule ? `Module ${String(nextModule.module_number).padStart(2, '0')}` : 'Course complete'}</Text>
            <Text style={styles.copy}>{nextModule?.title ?? 'Every required section is complete.'}</Text>
            <Pressable onPress={() => router.push('/(app)/course' as never)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Open Course</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Top Goal</Text>
            <Text style={styles.cardValue}>{topGoal?.title ?? 'No goal yet'}</Text>
            <Text style={styles.copy}>{topGoal ? `${topGoal.progress_percent}% complete` : 'Create a WARRIOR target to drive execution.'}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${topGoal?.progress_percent ?? 0}%` }]} />
            </View>
            <Pressable onPress={() => router.push('/(app)/goals' as never)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Open Goals</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Today's Mission Priorities</Text>
            {priorities.length > 0 ? (
              priorities.slice(0, 4).map((priority) => (
                <Text key={priority} style={styles.listItem}>
                  {priority}
                </Text>
              ))
            ) : (
              <Text style={styles.copy}>No priorities logged for today yet.</Text>
            )}
            <Pressable onPress={() => router.push('/(app)/battle-report' as never)} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Log Battle Report</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Weekly Reset</Text>
            <Text style={styles.cardValue}>{weekly?.warrior_score ? `${weekly.warrior_score}` : 'No score yet'}</Text>
            <Text style={styles.copy}>{weekly?.next_week_battle_cry ?? "Set this week's battle cry and reset plan."}</Text>
            <Pressable onPress={() => router.push('/(app)/battle-report' as never)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Open Weekly Reset</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 10,
    minWidth: 280,
    padding: 16,
  },
  cardValue: { color: '#f5f1e8', fontSize: 22, fontWeight: '900', lineHeight: 28 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  content: { gap: 16, paddingBottom: 40 },
  copy: { color: '#c7cdbf', fontSize: 16, lineHeight: 23 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  header: { gap: 6 },
  kicker: { color: '#d5a84c', fontSize: 13, fontWeight: '800', letterSpacing: 0, textTransform: 'uppercase' },
  listItem: { color: '#c7cdbf', fontSize: 15, lineHeight: 22 },
  metric: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 130,
    padding: 14,
  },
  metricLabel: { color: '#8d9488', fontSize: 12, fontWeight: '800', marginTop: 4, textTransform: 'uppercase' },
  metricValue: { color: '#f5f1e8', fontSize: 26, fontWeight: '900' },
  muted: { color: '#8d9488', fontSize: 14, lineHeight: 20 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#d5a84c',
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#14170f', fontSize: 15, fontWeight: '900' },
  progressFill: { backgroundColor: '#d5a84c', borderRadius: 999, height: '100%' },
  progressTrack: { backgroundColor: '#2d342b', borderRadius: 999, height: 8, overflow: 'hidden' },
  quoteAuthor: { color: '#8d9488', fontSize: 13, fontWeight: '800', textTransform: 'uppercase' },
  quoteCard: {
    backgroundColor: '#201b12',
    borderColor: '#5c4722',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  quoteText: { color: '#f5f1e8', fontSize: 19, fontWeight: '800', lineHeight: 27 },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 20 },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#3a4037',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  secondaryButtonText: { color: '#f5f1e8', fontSize: 15, fontWeight: '800' },
  sectionTitle: { color: '#f5f1e8', fontSize: 20, fontWeight: '900', lineHeight: 25 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', lineHeight: 39 },
});
