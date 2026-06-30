import { useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { useGoalsData } from '@/src/hooks/useGoalsData';
import { useAuth } from '@/src/providers/AuthProvider';
import { archiveGoal, createGoal, updateGoal, updateGoalProgress } from '@/src/services/goals';
import { Goal, GoalInput, GoalStatus } from '@/src/types/goals';

type GoalFormState = {
  actionsText: string;
  celebration_plan: string;
  deadline: string;
  description: string;
  measurement: string;
  progress_percent: string;
  resources: string;
  status: GoalStatus;
  title: string;
  warrior_category_id: string | null;
};

const emptyForm: GoalFormState = {
  actionsText: '',
  celebration_plan: '',
  deadline: '',
  description: '',
  measurement: '',
  progress_percent: '0',
  resources: '',
  status: 'active',
  title: '',
  warrior_category_id: null,
};

const statusOptions: GoalStatus[] = ['active', 'paused', 'complete'];

function goalToForm(goal: Goal): GoalFormState {
  return {
    actionsText: goal.top10_actions.join('\n'),
    celebration_plan: goal.celebration_plan ?? '',
    deadline: goal.deadline ?? '',
    description: goal.description ?? '',
    measurement: goal.measurement ?? '',
    progress_percent: String(goal.progress_percent),
    resources: goal.resources ?? '',
    status: goal.status === 'archived' ? 'active' : goal.status,
    title: goal.title,
    warrior_category_id: goal.warrior_category_id,
  };
}

function formToInput(form: GoalFormState): GoalInput {
  return {
    celebration_plan: form.celebration_plan,
    deadline: form.deadline,
    description: form.description,
    measurement: form.measurement,
    progress_percent: Number.parseInt(form.progress_percent, 10) || 0,
    resources: form.resources,
    status: form.status,
    title: form.title,
    top10_actions: form.actionsText
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 10),
    warrior_category_id: form.warrior_category_id,
  };
}

export default function GoalsScreen() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { categories, categoriesError, goals, goalsError, isLoading } = useGoalsData();
  const [form, setForm] = useState<GoalFormState>(emptyForm);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const activeGoals = useMemo(
    () => goals.filter((goal) => !selectedCategoryId || goal.warrior_category_id === selectedCategoryId),
    [goals, selectedCategoryId],
  );
  const selectedGoal = goals.find((goal) => goal.id === editingGoalId) ?? null;
  const completedCount = goals.filter((goal) => goal.status === 'complete').length;
  const averageProgress =
    goals.length > 0 ? Math.round(goals.reduce((total, goal) => total + goal.progress_percent, 0) / goals.length) : 0;

  function updateForm<K extends keyof GoalFormState>(key: K, value: GoalFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingGoalId(null);
    setForm(emptyForm);
  }

  function editGoal(goal: Goal) {
    setEditingGoalId(goal.id);
    setForm(goalToForm(goal));
  }

  async function refreshGoals() {
    if (!user?.id) return;
    await queryClient.invalidateQueries({ queryKey: ['goals', user.id] });
  }

  async function handleSaveGoal() {
    if (!user?.id || isSaving) return;

    if (!form.title.trim()) {
      Alert.alert('Goal needs a target', 'Add a clear goal title before saving.');
      return;
    }

    setIsSaving(true);
    try {
      if (editingGoalId) {
        await updateGoal(user.id, editingGoalId, formToInput(form));
      } else {
        await createGoal(user.id, formToInput(form));
      }
      resetForm();
      await refreshGoals();
    } catch (error) {
      Alert.alert('Could not save goal', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleProgress(goal: Goal, delta: number) {
    if (!user?.id) return;

    const nextProgress = Math.min(100, Math.max(0, goal.progress_percent + delta));
    const nextStatus = nextProgress === 100 ? 'complete' : goal.status === 'complete' ? 'active' : goal.status;

    try {
      await updateGoalProgress(user.id, goal.id, nextProgress, nextStatus);
      await refreshGoals();
    } catch (error) {
      Alert.alert('Could not update progress', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  async function handleArchive(goal: Goal) {
    if (!user?.id) return;

    const archive = async () => {
      try {
        await archiveGoal(user.id, goal.id);
        if (editingGoalId === goal.id) {
          resetForm();
        }
        await refreshGoals();
      } catch (error) {
        Alert.alert('Could not archive goal', error instanceof Error ? error.message : 'Please try again.');
      }
    };

    if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
      if (window.confirm(`Archive "${goal.title}"?`)) {
        await archive();
      }
      return;
    }

    Alert.alert('Archive goal?', `Archive "${goal.title}"?`, [
      { style: 'cancel', text: 'Cancel' },
      { onPress: archive, style: 'destructive', text: 'Archive' },
    ]);
  }

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.centered]}>
        <ActivityIndicator />
        <Text style={styles.muted}>Loading goals...</Text>
      </View>
    );
  }

  if (categoriesError || goalsError) {
    return (
      <View style={styles.screen}>
        <Text style={styles.title}>Goals unavailable</Text>
        <Text style={styles.copy}>{(categoriesError ?? goalsError)?.message ?? 'Could not load goals.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>Phase 4</Text>
            <Text style={styles.title}>Goals</Text>
            <Text style={styles.copy}>Build the WARRIOR target list that future Battle Reports will execute against.</Text>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{goals.length}</Text>
              <Text style={styles.statLabel}>Active goals</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{averageProgress}%</Text>
              <Text style={styles.statLabel}>Average progress</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{completedCount}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.filters}>
          <Pressable
            onPress={() => setSelectedCategoryId(null)}
            style={[styles.filterButton, selectedCategoryId === null ? styles.filterButtonActive : null]}
          >
            <Text style={[styles.filterText, selectedCategoryId === null ? styles.filterTextActive : null]}>All</Text>
          </Pressable>
          {categories.map((category) => (
            <Pressable
              key={category.id}
              onPress={() => setSelectedCategoryId(category.id)}
              style={[styles.filterButton, selectedCategoryId === category.id ? styles.filterButtonActive : null]}
            >
              <Text style={[styles.filterText, selectedCategoryId === category.id ? styles.filterTextActive : null]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.layout}>
          <View style={styles.listColumn}>
            {activeGoals.length === 0 ? (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>No goals yet</Text>
                <Text style={styles.copy}>Create the first active target, assign a WARRIOR category, and track progress here.</Text>
              </View>
            ) : (
              activeGoals.map((goal) => (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleBlock}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      <Text style={styles.goalMeta}>
                        {goal.warrior_category?.name ?? 'Uncategorized'} {goal.deadline ? ` / Due ${goal.deadline}` : ''}
                      </Text>
                    </View>
                    <Text style={[styles.status, goal.status === 'complete' ? styles.statusComplete : null]}>{goal.status}</Text>
                  </View>

                  {goal.description ? <Text style={styles.goalDescription}>{goal.description}</Text> : null}

                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${goal.progress_percent}%` }]} />
                  </View>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>{goal.progress_percent}% complete</Text>
                    <View style={styles.progressActions}>
                      <Pressable onPress={() => handleProgress(goal, -10)} style={styles.smallButton}>
                        <Text style={styles.smallButtonText}>-10</Text>
                      </Pressable>
                      <Pressable onPress={() => handleProgress(goal, 10)} style={styles.smallButton}>
                        <Text style={styles.smallButtonText}>+10</Text>
                      </Pressable>
                    </View>
                  </View>

                  {goal.top10_actions.length > 0 ? (
                    <View style={styles.actionsBox}>
                      <Text style={styles.label}>Top actions</Text>
                      {goal.top10_actions.slice(0, 3).map((action) => (
                        <Text key={action} style={styles.actionItem}>
                          {action}
                        </Text>
                      ))}
                    </View>
                  ) : null}

                  <View style={styles.cardActions}>
                    <Pressable onPress={() => editGoal(goal)} style={styles.secondaryButton}>
                      <Text style={styles.secondaryButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => handleArchive(goal)} style={styles.dangerButton}>
                      <Text style={styles.dangerButtonText}>Archive</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.formCard}>
            <View style={styles.formHeader}>
              <Text style={styles.sectionTitle}>{selectedGoal ? 'Edit Goal' : 'New Goal'}</Text>
              {selectedGoal ? (
                <Pressable onPress={resetForm} style={styles.ghostButton}>
                  <Text style={styles.ghostButtonText}>Cancel</Text>
                </Pressable>
              ) : null}
            </View>

            <Field label="Goal title" onChangeText={(value) => updateForm('title', value)} value={form.title} />
            <Field
              label="Description"
              multiline
              onChangeText={(value) => updateForm('description', value)}
              value={form.description}
            />

            <Text style={styles.label}>WARRIOR category</Text>
            <View style={styles.options}>
              {categories.map((category) => {
                const active = form.warrior_category_id === category.id;
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => updateForm('warrior_category_id', active ? null : category.id)}
                    style={[styles.option, active ? styles.optionActive : null]}
                  >
                    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{category.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.formGrid}>
              <Field label="Deadline" onChangeText={(value) => updateForm('deadline', value)} value={form.deadline} />
              <Field
                keyboardType="numeric"
                label="Progress %"
                onChangeText={(value) => updateForm('progress_percent', value)}
                value={form.progress_percent}
              />
            </View>

            <Field label="Measurement" onChangeText={(value) => updateForm('measurement', value)} value={form.measurement} />
            <Field label="Resources" multiline onChangeText={(value) => updateForm('resources', value)} value={form.resources} />
            <Field
              label="Celebration plan"
              multiline
              onChangeText={(value) => updateForm('celebration_plan', value)}
              value={form.celebration_plan}
            />
            <Field
              label="Top 10 actions"
              multiline
              onChangeText={(value) => updateForm('actionsText', value)}
              placeholder="One action per line"
              value={form.actionsText}
            />

            <Text style={styles.label}>Status</Text>
            <View style={styles.options}>
              {statusOptions.map((status) => {
                const active = form.status === status;
                return (
                  <Pressable
                    key={status}
                    onPress={() => updateForm('status', status)}
                    style={[styles.option, active ? styles.optionActive : null]}
                  >
                    <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{status}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable disabled={isSaving} onPress={handleSaveGoal} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : selectedGoal ? 'Save Changes' : 'Create Goal'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
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

const styles = StyleSheet.create({
  actionItem: { color: '#c7cdbf', fontSize: 14, lineHeight: 20 },
  actionsBox: { gap: 6, marginTop: 4 },
  card: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  cardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  centered: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  content: { gap: 18, paddingBottom: 40 },
  copy: { color: '#c7cdbf', fontSize: 16, lineHeight: 23 },
  dangerButton: {
    alignItems: 'center',
    borderColor: '#70413c',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dangerButtonText: { color: '#ffb0a7', fontSize: 14, fontWeight: '800' },
  field: { gap: 7 },
  filterButton: {
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterButtonActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  filterText: { color: '#c7cdbf', fontSize: 14, fontWeight: '800' },
  filterTextActive: { color: '#14170f' },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formCard: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    gap: 14,
    minWidth: 300,
    padding: 16,
  },
  formGrid: { gap: 12 },
  formHeader: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  ghostButton: { paddingHorizontal: 8, paddingVertical: 6 },
  ghostButtonText: { color: '#d5a84c', fontSize: 14, fontWeight: '900' },
  goalCard: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  goalDescription: { color: '#c7cdbf', fontSize: 15, lineHeight: 22 },
  goalHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  goalMeta: { color: '#8d9488', fontSize: 13, fontWeight: '700', lineHeight: 18, marginTop: 4 },
  goalTitle: { color: '#f5f1e8', fontSize: 19, fontWeight: '900', lineHeight: 24 },
  goalTitleBlock: { flex: 1, gap: 2 },
  header: { gap: 16 },
  headerText: { gap: 6 },
  input: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f5f1e8',
    fontSize: 16,
    minHeight: 48,
    padding: 12,
  },
  kicker: { color: '#d5a84c', fontSize: 13, fontWeight: '800', letterSpacing: 0, textTransform: 'uppercase' },
  label: { color: '#8d9488', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  layout: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  listColumn: { flex: 1.3, gap: 12, minWidth: 300 },
  muted: { color: '#8d9488', fontSize: 14, lineHeight: 20 },
  option: {
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionActive: { backgroundColor: '#d5a84c', borderColor: '#d5a84c' },
  optionText: { color: '#c7cdbf', fontSize: 14, fontWeight: '800' },
  optionTextActive: { color: '#14170f' },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#d5a84c',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  primaryButtonText: { color: '#14170f', fontSize: 15, fontWeight: '900' },
  progressActions: { flexDirection: 'row', gap: 8 },
  progressFill: { backgroundColor: '#d5a84c', borderRadius: 999, height: '100%' },
  progressRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  progressText: { color: '#c7cdbf', fontSize: 14, fontWeight: '800' },
  progressTrack: { backgroundColor: '#2d342b', borderRadius: 999, height: 8, overflow: 'hidden' },
  screen: { backgroundColor: '#0f1210', flex: 1, padding: 20 },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#3a4037',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  secondaryButtonText: { color: '#f5f1e8', fontSize: 14, fontWeight: '800' },
  sectionTitle: { color: '#f5f1e8', fontSize: 20, fontWeight: '900', lineHeight: 25 },
  smallButton: {
    alignItems: 'center',
    borderColor: '#3a4037',
    borderRadius: 8,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    width: 44,
  },
  smallButtonText: { color: '#f5f1e8', fontSize: 13, fontWeight: '900' },
  stat: {
    backgroundColor: '#171c17',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    minWidth: 120,
    padding: 14,
  },
  statLabel: { color: '#8d9488', fontSize: 12, fontWeight: '800', marginTop: 4, textTransform: 'uppercase' },
  statValue: { color: '#f5f1e8', fontSize: 24, fontWeight: '900' },
  stats: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  status: {
    borderColor: '#3a4037',
    borderRadius: 999,
    borderWidth: 1,
    color: '#c7cdbf',
    fontSize: 12,
    fontWeight: '900',
    overflow: 'hidden',
    paddingHorizontal: 9,
    paddingVertical: 5,
    textTransform: 'uppercase',
  },
  statusComplete: { borderColor: '#d5a84c', color: '#d5a84c' },
  textArea: { minHeight: 104 },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', lineHeight: 39 },
});
