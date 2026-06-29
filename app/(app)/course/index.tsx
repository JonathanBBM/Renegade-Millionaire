import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CourseError, CourseLoading, CourseScreenShell, courseStyles } from '@/src/components/course/CourseChrome';
import { useCourseData } from '@/src/hooks/useCourseData';
import { getModuleSections, getModuleStatus, getNextSection, getProgressMap } from '@/src/services/course';

export default function CourseScreen() {
  const { isLoading, modules, modulesError, progress, progressError } = useCourseData();

  if (isLoading) {
    return <CourseLoading />;
  }

  if (modulesError || progressError) {
    return <CourseError message={(modulesError ?? progressError)?.message ?? 'Could not load course data.'} />;
  }

  const progressMap = getProgressMap(progress);

  return (
    <CourseScreenShell>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={courseStyles.label}>Course</Text>
          <Text style={courseStyles.title}>Warrior Path</Text>
          <Text style={courseStyles.copy}>
            Work through each module in order. Complete the required sections to unlock the next stage.
          </Text>
        </View>

        {modules.map((module: any) => {
          const status = getModuleStatus(modules, module, progressMap);
          const moduleSections = getModuleSections(module);
          const completedCount = moduleSections.filter((section: any) => progressMap.get(section.id)?.status === 'complete').length;
          const nextSection = status === 'locked' ? null : getNextSection(module, progressMap);

          return (
            <Pressable
              disabled={status === 'locked'}
              key={module.id}
              onPress={() => {
                if (nextSection) {
                  router.push(`/(app)/course/${module.id}` as never);
                }
              }}
              style={[courseStyles.card, status === 'locked' && styles.lockedCard]}>
              <View style={styles.cardTop}>
                <Text style={courseStyles.badge}>
                  {status === 'locked' ? 'Locked' : status.replace('_', ' ')}
                </Text>
                <Text style={styles.moduleNumber}>M{String(module.module_number).padStart(2, '0')}</Text>
              </View>
              <Text style={courseStyles.sectionTitle}>{module.title}</Text>
              {module.subtitle ? <Text style={courseStyles.muted}>{module.subtitle}</Text> : null}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${moduleSections.length ? (completedCount / moduleSections.length) * 100 : 0}%` },
                  ]}
                />
              </View>
              <Text style={courseStyles.muted}>
                {completedCount}/{moduleSections.length} sections complete
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </CourseScreenShell>
  );
}

const styles = StyleSheet.create({
  cardTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  content: { gap: 14, paddingBottom: 40 },
  header: { gap: 8, marginBottom: 10 },
  lockedCard: { opacity: 0.52 },
  moduleNumber: { color: '#d5a84c', fontSize: 14, fontWeight: '900' },
  progressFill: { backgroundColor: '#d5a84c', borderRadius: 999, height: '100%' },
  progressTrack: {
    backgroundColor: '#2b3029',
    borderRadius: 999,
    height: 8,
    overflow: 'hidden',
  },
});
