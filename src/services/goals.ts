import { supabase } from '@/src/lib/supabase';
import { Goal, GoalInput, WarriorCategory } from '@/src/types/goals';

type GoalRow = Omit<Goal, 'warrior_category'> & {
  warrior_categories: WarriorCategory | WarriorCategory[] | null;
};

function normalizeGoal(row: GoalRow): Goal {
  const category = Array.isArray(row.warrior_categories) ? (row.warrior_categories[0] ?? null) : row.warrior_categories;

  return {
    ...row,
    top10_actions: Array.isArray(row.top10_actions) ? row.top10_actions.map(String) : [],
    warrior_category: category,
  };
}

function cleanGoalInput(input: GoalInput, userId: string) {
  return {
    celebration_plan: input.celebration_plan?.trim() || null,
    deadline: input.deadline?.trim() || null,
    description: input.description?.trim() || null,
    measurement: input.measurement?.trim() || null,
    progress_percent: Math.min(100, Math.max(0, input.progress_percent ?? 0)),
    resources: input.resources?.trim() || null,
    status: input.status ?? 'active',
    title: input.title.trim(),
    top10_actions: input.top10_actions?.filter(Boolean) ?? [],
    user_id: userId,
    warrior_category_id: input.warrior_category_id || null,
  };
}

export async function fetchWarriorCategories() {
  const { data, error } = await supabase
    .from('warrior_categories')
    .select('id,slug,name,ordinal')
    .order('ordinal', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as WarriorCategory[];
}

export async function fetchGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select(
      `
      id,
      user_id,
      warrior_category_id,
      title,
      description,
      deadline,
      measurement,
      resources,
      celebration_plan,
      top10_actions,
      status,
      progress_percent,
      created_at,
      updated_at,
      warrior_categories (
        id,
        slug,
        name,
        ordinal
      )
    `,
    )
    .eq('user_id', userId)
    .neq('status', 'archived')
    .order('deadline', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return ((data ?? []) as GoalRow[]).map(normalizeGoal);
}

export async function createGoal(userId: string, input: GoalInput) {
  const payload = cleanGoalInput(input, userId);

  const { data, error } = await supabase
    .from('goals')
    .insert(payload)
    .select(
      `
      id,
      user_id,
      warrior_category_id,
      title,
      description,
      deadline,
      measurement,
      resources,
      celebration_plan,
      top10_actions,
      status,
      progress_percent,
      created_at,
      updated_at,
      warrior_categories (
        id,
        slug,
        name,
        ordinal
      )
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return normalizeGoal(data as GoalRow);
}

export async function updateGoal(userId: string, goalId: string, input: GoalInput) {
  const payload = {
    ...cleanGoalInput(input, userId),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('goals').update(payload).eq('id', goalId).eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function updateGoalProgress(userId: string, goalId: string, progressPercent: number, status?: Goal['status']) {
  const payload: { progress_percent: number; status?: Goal['status']; updated_at: string } = {
    progress_percent: Math.min(100, Math.max(0, progressPercent)),
    updated_at: new Date().toISOString(),
  };

  if (status) {
    payload.status = status;
  }

  const { error } = await supabase.from('goals').update(payload).eq('id', goalId).eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function archiveGoal(userId: string, goalId: string) {
  const { error } = await supabase
    .from('goals')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}
