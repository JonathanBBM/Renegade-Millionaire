import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppLoading, AppScreen, EmptyState } from '@/src/components/ui/AppShell';
import { useProfileData } from '@/src/hooks/useProfileData';
import { useRemindersData } from '@/src/hooks/useRemindersData';
import { useAuth } from '@/src/providers/AuthProvider';
import { syncLocalNotifications } from '@/src/services/localNotifications';
import { archiveRoutine, createCustomAffirmation, createRoutine, deleteCustomAffirmation } from '@/src/services/profile';
import { createReminder, deleteReminder, setReminderEnabled } from '@/src/services/reminders';
import { Routine } from '@/src/types/profile';
import { Reminder, ReminderType } from '@/src/types/reminders';

const reminderTypes: ReminderType[] = ['battle-report', 'habit', 'quote', 'module-unlock'];

export default function ProfileScreen() {
  const { profile, user } = useAuth();
  const queryClient = useQueryClient();
  const { affirmations, affirmationsError, isLoading, routines, routinesError } = useProfileData();
  const { isLoading: remindersLoading, reminders, remindersError } = useRemindersData();
  const [affirmationCategory, setAffirmationCategory] = useState('Custom');
  const [affirmationText, setAffirmationText] = useState('');
  const [morningHabit, setMorningHabit] = useState('');
  const [eveningHabit, setEveningHabit] = useState('');
  const [reminderLabel, setReminderLabel] = useState('');
  const [reminderTime, setReminderTime] = useState('07:00');
  const [reminderType, setReminderType] = useState<ReminderType>('battle-report');
  const [isSaving, setIsSaving] = useState(false);

  const customAffirmations = affirmations.filter((affirmation) => affirmation.is_custom);
  const seedAffirmations = affirmations.filter((affirmation) => !affirmation.is_custom);
  const morningRoutines = routines.filter((routine) => routine.routine_type === 'morning');
  const eveningRoutines = routines.filter((routine) => routine.routine_type === 'evening');

  async function refresh() {
    if (!user?.id) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['affirmations', user.id] }),
      queryClient.invalidateQueries({ queryKey: ['reminders', user.id] }),
      queryClient.invalidateQueries({ queryKey: ['routines', user.id] }),
    ]);
  }

  async function saveAffirmation() {
    if (!user?.id || isSaving) return;
    if (!affirmationText.trim()) {
      Alert.alert('Affirmation needed', 'Write the affirmation before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await createCustomAffirmation(user.id, affirmationCategory, affirmationText);
      setAffirmationText('');
      await refresh();
    } catch (error) {
      Alert.alert('Could not save affirmation', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeAffirmation(affirmationId: string) {
    if (!user?.id) return;
    try {
      await deleteCustomAffirmation(user.id, affirmationId);
      await refresh();
    } catch (error) {
      Alert.alert('Could not delete affirmation', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  async function saveRoutine(type: Routine['routine_type']) {
    if (!user?.id || isSaving) return;
    const habit = type === 'morning' ? morningHabit : eveningHabit;
    if (!habit.trim()) {
      Alert.alert('Routine habit needed', 'Write a habit before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await createRoutine(user.id, type, habit, type === 'morning' ? morningRoutines.length : eveningRoutines.length);
      if (type === 'morning') setMorningHabit('');
      if (type === 'evening') setEveningHabit('');
      await refresh();
    } catch (error) {
      Alert.alert('Could not save routine', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeRoutine(routineId: string) {
    if (!user?.id) return;
    try {
      await archiveRoutine(user.id, routineId);
      await refresh();
    } catch (error) {
      Alert.alert('Could not remove routine', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  async function saveReminder() {
    if (!user?.id || isSaving) return;
    if (!reminderTime.trim()) {
      Alert.alert('Reminder time needed', 'Add a time like 07:00 before saving.');
      return;
    }

    setIsSaving(true);
    try {
      await createReminder(user.id, {
        payload: { label: reminderLabel.trim() || reminderType.replace('-', ' ') },
        reminder_type: reminderType,
        schedule: { frequency: 'daily', time: reminderTime.trim() },
      });
      setReminderLabel('');
      await refresh();
    } catch (error) {
      Alert.alert('Could not save reminder', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleReminder(reminder: Reminder) {
    if (!user?.id) return;
    try {
      await setReminderEnabled(user.id, reminder.id, !reminder.is_enabled);
      await refresh();
    } catch (error) {
      Alert.alert('Could not update reminder', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  async function removeReminder(reminderId: string) {
    if (!user?.id) return;
    try {
      await deleteReminder(user.id, reminderId);
      await refresh();
    } catch (error) {
      Alert.alert('Could not delete reminder', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  async function syncNotifications() {
    try {
      const result = await syncLocalNotifications(reminders);
      if (result.skippedReason) {
        Alert.alert('Notifications not scheduled', result.skippedReason);
        return;
      }
      Alert.alert('Notifications scheduled', `${result.scheduledCount} enabled reminders synced on this device.`);
    } catch (error) {
      Alert.alert('Could not sync notifications', error instanceof Error ? error.message : 'Please try again.');
    }
  }

  if (isLoading || remindersLoading) {
    return <AppLoading label="Loading profile..." />;
  }

  if (affirmationsError || routinesError || remindersError) {
    return (
      <AppScreen>
        <Text style={styles.title}>Profile unavailable</Text>
        <Text style={styles.copy}>{(affirmationsError ?? routinesError ?? remindersError)?.message ?? 'Could not load profile.'}</Text>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Profile & Practice</Text>
          <Text style={styles.title}>{profile?.full_name || user?.email || 'Warrior'}</Text>
          <Text style={styles.copy}>Manage affirmations, creed language, and the routines that anchor execution.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Custom Affirmation</Text>
          <Field label="Category" onChangeText={setAffirmationCategory} value={affirmationCategory} />
          <Field label="Affirmation" multiline onChangeText={setAffirmationText} value={affirmationText} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save custom affirmation"
            disabled={isSaving}
            onPress={saveAffirmation}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save Affirmation'}</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          <RoutineCard
            habit={morningHabit}
            onArchive={removeRoutine}
            onChangeHabit={setMorningHabit}
            onSave={() => saveRoutine('morning')}
            routines={morningRoutines}
            title="Morning Routine"
          />
          <RoutineCard
            habit={eveningHabit}
            onArchive={removeRoutine}
            onChangeHabit={setEveningHabit}
            onSave={() => saveRoutine('evening')}
            routines={eveningRoutines}
            title="Evening Routine"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Reminder Schedule</Text>
          <Text style={styles.copy}>Set daily reminder preferences for Battle Reports, habits, quotes, and module unlocks.</Text>

          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <View key={reminder.id} style={styles.reminderRow}>
                <View style={styles.rowText}>
                  <Text style={styles.label}>{reminder.reminder_type}</Text>
                  <Text style={styles.copy}>
                    {reminder.payload.label ?? 'Reminder'} at {reminder.schedule.time ?? 'time not set'}
                  </Text>
                  <Text style={styles.muted}>{reminder.is_enabled ? 'Enabled' : 'Disabled'}</Text>
                </View>
                <View style={styles.rowActions}>
                  <Pressable onPress={() => toggleReminder(reminder)} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>{reminder.is_enabled ? 'Disable' : 'Enable'}</Text>
                  </Pressable>
                  <Pressable onPress={() => removeReminder(reminder.id)} style={styles.dangerButton}>
                    <Text style={styles.dangerButtonText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <EmptyState copy="Add a daily reminder preference to make routines and Battle Reports harder to miss." title="No reminders yet" />
          )}

          <Text style={styles.label}>Reminder type</Text>
          <View style={styles.options}>
            {reminderTypes.map((type) => {
              const active = reminderType === type;
              return (
                <Pressable key={type} onPress={() => setReminderType(type)} style={[styles.option, active ? styles.optionActive : null]}>
                  <Text style={[styles.optionText, active ? styles.optionTextActive : null]}>{type}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={styles.formGrid}>
            <Field label="Label" onChangeText={setReminderLabel} value={reminderLabel} />
            <Field label="Time" onChangeText={setReminderTime} value={reminderTime} />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Save reminder"
            disabled={isSaving}
            onPress={saveReminder}
            style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save Reminder'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Sync local notifications" onPress={syncNotifications} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Sync Local Notifications</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My Creed Lines</Text>
          {customAffirmations.length > 0 ? (
            customAffirmations.map((affirmation) => (
              <View key={affirmation.id} style={styles.row}>
                <View style={styles.rowText}>
                  <Text style={styles.label}>{affirmation.category ?? 'Custom'}</Text>
                  <Text style={styles.copy}>{affirmation.text}</Text>
                </View>
                <Pressable onPress={() => removeAffirmation(affirmation.id)} style={styles.dangerButton}>
                  <Text style={styles.dangerButtonText}>Delete</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <EmptyState copy="Save custom affirmations here to build a personal creed you can practice daily." title="No custom creed lines" />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Affirmation Library</Text>
          {seedAffirmations.map((affirmation) => (
            <View key={affirmation.id} style={styles.libraryRow}>
              <Text style={styles.label}>{affirmation.category}</Text>
              <Text style={styles.copy}>{affirmation.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppScreen>
  );
}

function RoutineCard({
  habit,
  onArchive,
  onChangeHabit,
  onSave,
  routines,
  title,
}: {
  habit: string;
  onArchive: (routineId: string) => void;
  onChangeHabit: (value: string) => void;
  onSave: () => void;
  routines: Routine[];
  title: string;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {routines.length > 0 ? (
        routines.map((routine) => (
          <View key={routine.id} style={styles.row}>
            <Text style={styles.copy}>{routine.habit_text}</Text>
            <Pressable onPress={() => onArchive(routine.id)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Remove</Text>
            </Pressable>
          </View>
        ))
      ) : (
        <EmptyState copy="Add the first habit that belongs in this routine." title="No habits saved" />
      )}
      <Field label="Add habit" onChangeText={onChangeHabit} value={habit} />
      <Pressable accessibilityRole="button" accessibilityLabel={`Add habit to ${title}`} onPress={onSave} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>Add Habit</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  multiline,
  onChangeText,
  value,
}: {
  label: string;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  value: string;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#828a80"
        style={[styles.input, multiline ? styles.textArea : null]}
        textAlignVertical={multiline ? 'top' : 'center'}
        value={value}
      />
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
    gap: 12,
    minWidth: 300,
    padding: 16,
  },
  content: { gap: 16, paddingBottom: 40 },
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
  formGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  header: { gap: 6 },
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
  libraryRow: { borderColor: '#2d342b', borderRadius: 8, borderWidth: 1, gap: 6, padding: 12 },
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
  row: { alignItems: 'center', flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  rowActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' },
  rowText: { flex: 1, gap: 4 },
  reminderRow: {
    alignItems: 'center',
    borderColor: '#2d342b',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 12,
  },
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
  textArea: { minHeight: 104 },
  title: { color: '#f5f1e8', fontSize: 34, fontWeight: '900', lineHeight: 39 },
});
