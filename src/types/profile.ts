export type Affirmation = {
  category: string | null;
  created_at: string;
  id: string;
  is_custom: boolean;
  text: string;
  user_id: string | null;
};

export type Routine = {
  created_at: string;
  habit_text: string;
  id: string;
  is_active: boolean;
  routine_type: 'morning' | 'evening';
  sort_order: number;
  user_id: string;
};
