import { useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CourseError, CourseLoading, CourseScreenShell, courseStyles } from '@/src/components/course/CourseChrome';
import { ExerciseRenderer } from '@/src/components/course/ExerciseRenderer';
import { useCourseData } from '@/src/hooks/useCourseData';
import { useAuth } from '@/src/providers/AuthProvider';
import { completeSection, getModuleStatus, getProgressMap, getSectionById } from '@/src/services/course';

export default function SectionScreen() {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { isLoading, modules, modulesError, progress, progressError } = useCourseData();
  const [response, setResponse] = useState<Record<string, unknown>>({});
  const [isSaving, setIsSaving] = useState(false);

  const progressMap = useMemo(() => getProgressMap(progress), [progress]);
  const match = getSectionById(modules, sectionId);
  const existingProgress = match ? progressMap.get(match.section.id) : undefined;

  useEffect(() => {
    setResponse(existingProgress?.response ?? {});
  }, [existingProgress?.completed_at, match?.section.id]);

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
  const isComplete = existingProgress?.status === 'complete';
  const body = section.content?.body ?? section.content?.summary ?? '';
  const actionLabel = section.exercise_config?.actionLabel ?? 'Mark complete';

  if (moduleStatus === 'locked') {
    return <CourseError message="Complete the previous module to unlock this section." />;
  }

  async function handleComplete() {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      await completeSection(user.id, section, {
        ...response,
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

        <ExerciseRenderer onChange={setResponse} response={response} section={section} />

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
});
