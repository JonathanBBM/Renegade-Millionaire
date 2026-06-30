export type WarriorCategory = {
  id: string;
  name: string;
  ordinal: number;
  slug: string;
};

export type GoalStatus = 'active' | 'paused' | 'complete' | 'archived';

export type Goal = {
  celebration_plan: string | null;
  created_at: string;
  deadline: string | null;
  description: string | null;
  id: string;
  measurement: string | null;
  progress_percent: number;
  resources: string | null;
  status: GoalStatus;
  title: string;
  top10_actions: string[];
  updated_at: string;
  user_id: string;
  warrior_category: WarriorCategory | null;
  warrior_category_id: string | null;
};

export type GoalInput = {
  celebration_plan?: string;
  deadline?: string;
  description?: string;
  measurement?: string;
  progress_percent?: number;
  resources?: string;
  status?: GoalStatus;
  title: string;
  top10_actions?: string[];
  warrior_category_id?: string | null;
};
