import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CourseError, CourseLoading, CourseScreenShell, courseStyles } from '@/src/components/course/CourseChrome';
import { useCourseData } from '@/src/hooks/useCourseData';
import { getModuleSections, getModuleStatus, getProgressMap } from '@/src/services/course';

export default function ModuleScreen() {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { isLoading, modules, modulesError, progress, progressError } = useCourseData();

  if (isLoading) {
    return <CourseLoading />;
  }

  if (modulesError || progressError) {
    return <CourseError message={(modulesError ?? progressError)?.message ?? 'Could not load module.'} />;
  }

  const progressMap = getProgressMap(progress);
  const module = modules.find((item) => item.id === moduleId);

  if (!module) {
    return <CourseError message="Module not found." />;
  }

  const status = getModuleStatus(modules, module, progressMap);

  if (status === 'locked') {
    return <CourseError message="Complete the previous module to unlock this one." />;
  }

  return (
    <CourseScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable onPress={() => router.push('/(app)/course' as never)} style={courseStyles.buttonSecondary}>
          <Text style={courseStyles.buttonSecondaryText}>Back to course</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={courseStyles.label}>Module {String(module.module_number).padStart(2, '0')}</Text>
          <Text style={courseStyles.title}>{module.title}</Text>
          {module.description ? <Text style={courseStyles.copy}>{module.description}</Text> : null}
        </View>

        {module.chapters.map((chapter) => (
          <View key={chapter.id} style={styles.chapter}>
            <Text style={courseStyles.sectionTitle}>{chapter.title}</Text>
            {chapter.sections.map((section) => {
              const isComplete = progressMap.get(section.id)?.status === 'complete';

              return (
                <Pressable
                  key={section.id}
                  onPress={() => router.push(`/(app)/course/section/${section.id}` as never)}
                  style={courseStyles.card}>
                  <View style={styles.sectionRow}>
                    <View style={styles.sectionText}>
                      <Text style={courseStyles.label}>{section.section_type}</Text>
                      <Text style={styles.sectionTitle}>{section.title}</Text>
                      <Text style={courseStyles.muted}>
                        {section.estimated_minutes ? `${section.estimated_minutes} min` : 'Self-paced'}
                      </Text>
                    </View>
                    <Text style={[styles.status, isComplete && styles.statusComplete]}>
                      {isComplete ? 'Complete' : 'Open'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </CourseScreenShell>
  );
}

const styles = StyleSheet.create({
  chapter: { gap: 12 },
  content: { gap: 18, paddingBottom: 40 },
  header: { gap: 8 },
  sectionRow: { alignItems: 'center', flexDirection: 'row', gap: 14, justifyContent: 'space-between' },
  sectionText: { flex: 1, gap: 4 },
  sectionTitle: { color: '#f5f1e8', fontSize: 17, fontWeight: '800', lineHeight: 23 },
  status: { color: '#c7cdbf', fontSize: 13, fontWeight: '800' },
  statusComplete: { color: '#d5a84c' },
});
