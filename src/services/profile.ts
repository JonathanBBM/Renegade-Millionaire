import { supabase } from '@/src/lib/supabase';
import { Affirmation, Routine } from '@/src/types/profile';

export async function fetchAffirmations(userId: string) {
  const { data, error } = await supabase
    .from('affirmations')
    .select('id,user_id,category,text,is_custom,created_at')
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order('category', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Affirmation[];
}

export async function createCustomAffirmation(userId: string, category: string, text: string) {
  const { error } = await supabase.from('affirmations').insert({
    category: category.trim() || 'Custom',
    is_custom: true,
    text: text.trim(),
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function deleteCustomAffirmation(userId: string, affirmationId: string) {
  const { error } = await supabase.from('affirmations').delete().eq('id', affirmationId).eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function fetchRoutines(userId: string) {
  const { data, error } = await supabase
    .from('routines')
    .select('id,user_id,routine_type,habit_text,sort_order,is_active,created_at')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('routine_type', { ascending: true })
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Routine[];
}

export async function createRoutine(userId: string, routineType: Routine['routine_type'], habitText: string, sortOrder: number) {
  const { error } = await supabase.from('routines').insert({
    habit_text: habitText.trim(),
    routine_type: routineType,
    sort_order: sortOrder,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

export async function archiveRoutine(userId: string, routineId: string) {
  const { error } = await supabase
    .from('routines')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', routineId)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }
}

export async function updateWarriorCreed(userId: string, warriorCreed: string) {
  const { error } = await supabase
    .from('profiles')
    .update({ updated_at: new Date().toISOString(), warrior_creed: warriorCreed.trim() || null })
    .eq('id', userId);

  if (error) {
    throw error;
  }
}
