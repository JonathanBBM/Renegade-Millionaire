import { supabase } from '@/src/lib/supabase';
import { CourseModule, CourseSection, ModuleStatus, SectionProgress } from '@/src/types/course';

function sortCourse(modules: CourseModule[]) {
  return modules
    .sort((a, b) => a.unlock_order - b.unlock_order)
    .map((module) => ({
      ...module,
      chapters: [...(module.chapters ?? [])]
        .sort((a, b) => a.ordinal - b.ordinal)
        .map((chapter) => ({
          ...chapter,
          sections: [...(chapter.sections ?? [])].sort((a, b) => a.ordinal - b.ordinal),
        })),
    }));
}

export async function fetchCourseModules() {
  const { data, error } = await supabase
    .from('modules')
    .select(
      `
      id,
      slug,
      title,
      subtitle,
      module_number,
      description,
      unlock_order,
      is_published,
      chapters (
        id,
        module_id,
        title,
        ordinal,
        sections (
          id,
          chapter_id,
          slug,
          title,
          section_type,
          ordinal,
          content,
          exercise_config,
          estimated_minutes,
          is_required
        )
      )
    `,
    )
    .eq('is_published', true);

  if (error) {
    throw error;
  }

  return sortCourse((data ?? []) as CourseModule[]);
}

export async function fetchProgress(userId: string) {
  const { data, error } = await supabase
    .from('progress')
    .select('section_id,status,response,completed_at')
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return (data ?? []) as SectionProgress[];
}

export function getAllSections(modules: CourseModule[]) {
  return modules.flatMap((module) => module.chapters.flatMap((chapter) => chapter.sections));
}

export function getModuleSections(module: CourseModule) {
  return module.chapters.flatMap((chapter) => chapter.sections);
}

export function getSectionById(modules: CourseModule[], sectionId: string) {
  for (const module of modules) {
    for (const chapter of module.chapters) {
      const section = chapter.sections.find((item) => item.id === sectionId);
      if (section) {
        return { chapter, module, section };
      }
    }
  }

  return null;
}

export function getProgressMap(progress: SectionProgress[]) {
  return new Map(progress.map((item) => [item.section_id, item]));
}

export function isSectionComplete(sectionId: string, progressMap: Map<string, SectionProgress>) {
  return progressMap.get(sectionId)?.status === 'complete';
}

export function getModuleStatus(
  modules: CourseModule[],
  module: CourseModule,
  progressMap: Map<string, SectionProgress>,
): ModuleStatus {
  const previousModules = modules.filter((item) => item.unlock_order < module.unlock_order);
  const previousComplete = previousModules.every((item) =>
    getModuleSections(item)
      .filter((section) => section.is_required)
      .every((section) => isSectionComplete(section.id, progressMap)),
  );

  if (!previousComplete) {
    return 'locked';
  }

  const requiredSections = getModuleSections(module).filter((section) => section.is_required);
  const completedCount = requiredSections.filter((section) => isSectionComplete(section.id, progressMap)).length;

  if (requiredSections.length > 0 && completedCount === requiredSections.length) {
    return 'complete';
  }

  if (completedCount > 0) {
    return 'in_progress';
  }

  return 'not_started';
}

export function getNextSection(module: CourseModule, progressMap: Map<string, SectionProgress>) {
  return getModuleSections(module).find((section) => !isSectionComplete(section.id, progressMap)) ?? getModuleSections(module)[0];
}

export async function completeSection(userId: string, section: CourseSection, response: Record<string, unknown>) {
  const { error } = await supabase.from('progress').upsert(
    {
      completed_at: new Date().toISOString(),
      response,
      section_id: section.id,
      status: 'complete',
      user_id: userId,
    },
    { onConflict: 'user_id,section_id' },
  );

  if (error) {
    throw error;
  }
}
