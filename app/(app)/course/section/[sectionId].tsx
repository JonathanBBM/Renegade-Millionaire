import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CourseError, CourseLoading, CourseScreenShell, courseStyles } from '@/src/components/course/CourseChrome';
import { useCourseData } from '@/src/hooks/useCourseData';
import { useAuth } from '@/src/providers/AuthProvider';
import { completeSection, getModuleStatus, getProgressMap, getSectionById } from '@/src/services/course';

export default function SectionScreen() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, modules, modulesError, progress, progressError } = useCourseData();
  const [responseText, setResponseText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const progressMap = useMemo(() => getProgressMap(progress), [progress]);
  const match = getSectionById(modules, sectionId);

  if (isLoading) {
    return <CourseLoading />;
  }

  if (modulesError || progressError) {
    return <CourseError message={(modulesError ?? progressError)?.message ?? 'Could not load section.'} />;
  }

  if (!match) {
    return <CourseError message="Section not found." />;
  }

  const { module, section } = match;
  const moduleStatus = getModuleStatus(modules, module, progressMap);
  const existingProgress = progressMap.get(section.id);
  const isComplete = existingProgress?.status === 'complete';
  const body = section.content?.body ?? section.content?.summary ?? '';
  const prompts = section.content?.prompts ?? [];
  const actionLabel = section.exercise_config?.actionLabel ?? 'Mark complete';

  if (moduleStatus === 'locked') {
    return <CourseError message="Complete the previous module to unlock this section." />;
  }

  async function handleComplete() {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await completeSection(user.id, section, {
        text: responseText || existingProgress?.response?.text || '',
        completedFrom: 'section-renderer',
      });
      await queryClient.invalidateQueries({ queryKey: ['course-progress', user.id] });
      router.push(`/(app)/course/${module.id}` as never);
    } catch (error) {
      Alert.alert('Could not save progress', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <CourseScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.push(`/(app)/course/${module.id}` as never)} style={courseStyles.buttonSecondary}>
          <Text style={courseStyles.buttonSecondaryText}>Back to module</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={courseStyles.label}>
            Module {String(module.module_number).padStart(2, '0')} / {section.section_type}
          </Text>
          <Text style={courseStyles.title}>{section.title}</Text>
          {isComplete ? <Text style={styles.complete}>Completed</Text> : null}
        </View>

        {body ? (
          <View style={courseStyles.card}>
            {body.split('\n').map((paragraph, index) => (
              <Text key={`${paragraph}-${index}`} style={courseStyles.copy}>
                {paragraph}
              </Text>
            ))}
          </View>
        ) : null}

        {prompts.length > 0 ? (
          <View style={courseStyles.card}>
            <Text style={courseStyles.sectionTitle}>Reflection</Text>
            {prompts.map((prompt) => (
              <Text key={prompt} style={courseStyles.copy}>
                {prompt}
              </Text>
            ))}
            <TextInput
              multiline
              onChangeText={setResponseText}
              placeholder="Write your notes here..."
              placeholderTextColor="#828a80"
              style={styles.textArea}
              value={responseText || String(existingProgress?.response?.text ?? '')}
            />
          </View>
        ) : null}

        {section.section_type === 'rating' ? (
          <View style={courseStyles.card}>
            <Text style={courseStyles.sectionTitle}>Rating Drill</Text>
            <Text style={courseStyles.copy}>
              Score each category from {section.exercise_config?.scale?.min ?? 1} to {section.exercise_config?.scale?.max ?? 10}.
              Detailed sliders arrive in Phase 3; for now, complete this section when you have done the assessment.
            </Text>
          </View>
        ) : null}

        <Pressable disabled={isSaving} onPress={handleComplete} style={courseStyles.button}>
          <Text style={courseStyles.buttonText}>{isSaving ? 'Saving...' : actionLabel}</Text>
        </Pressable>
      </ScrollView>
    </CourseScreenShell>
  );
}

const styles = StyleSheet.create({
  complete: { color: '#d5a84c', fontSize: 14, fontWeight: '900' },
  content: { gap: 16, paddingBottom: 40 },
  header: { gap: 8 },
  textArea: {
    backgroundColor: '#101410',
    borderColor: '#343a32',
    borderRadius: 8,
    borderWidth: 1,
    color: '#f5f1e8',
    fontSize: 16,
    minHeight: 140,
    padding: 12,
    textAlignVertical: 'top',
  },
});
