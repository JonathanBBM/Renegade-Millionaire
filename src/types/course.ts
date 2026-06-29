export type SectionType = 'reading' | 'reflection' | 'form' | 'rating';

export type SectionContent = {
  body?: string;
  summary?: string;
  prompts?: string[];
};

export type ExerciseConfig = {
  actionLabel?: string;
  fields?: Array<{
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'slider';
  }>;
  scale?: {
    min: number;
    max: number;
    labels?: string[];
  };
};

export type CourseSection = {
  chapter_id: string;
  content: SectionContent;
  estimated_minutes: number | null;
  exercise_config: ExerciseConfig;
  id: string;
  is_required: boolean;
  ordinal: number;
  section_type: SectionType;
  slug: string;
  title: string;
};

export type CourseChapter = {
  id: string;
  module_id: string;
  ordinal: number;
  sections: CourseSection[];
  title: string;
};

export type CourseModule = {
  chapters: CourseChapter[];
  description: string | null;
  id: string;
  is_published: boolean;
  module_number: number;
  slug: string;
  subtitle: string | null;
  title: string;
  unlock_order: number;
};

export type SectionProgress = {
  completed_at: string | null;
  response: Record<string, unknown>;
  section_id: string;
  status: 'not_started' | 'in_progress' | 'complete';
};

export type ModuleStatus = 'locked' | 'not_started' | 'in_progress' | 'complete';
