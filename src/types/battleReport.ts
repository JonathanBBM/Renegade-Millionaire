export type BattleHabit = {
  completed: boolean;
  name: string;
  streak: number;
  target_date: string;
};

export type BattleActionTask = {
  completed: boolean;
  text: string;
};

export type DailyBattleReport = {
  action_tasks: BattleActionTask[];
  biggest_win: string | null;
  category_focus: Record<string, string>;
  challenge_overcome: string | null;
  energy: number | null;
  executed_well: string | null;
  focus: number | null;
  follow_ups: string | null;
  gratitude: string | null;
  habits: BattleHabit[];
  id: string;
  lessons: string | null;
  mission_priorities: string[];
  mistake: string | null;
  report_date: string;
  self_improvement_hours: number | null;
  user_id: string;
  war_log: string | null;
  water_glasses: number | null;
  weight: number | null;
};

export type DailyBattleReportInput = Omit<DailyBattleReport, 'id' | 'user_id'>;

export type WeeklyBattleReport = {
  aligned_goals: boolean | null;
  aligned_goals_why_not: string | null;
  battle_objective: string | null;
  followed_priorities: boolean | null;
  followed_priorities_why_not: string | null;
  id: string;
  improve_area: string | null;
  improved_habits: boolean | null;
  improved_habits_why_not: string | null;
  key_targets: string[];
  lessons: string[];
  new_strategy: string | null;
  next_week_battle_cry: string | null;
  stop_doing: string | null;
  user_id: string;
  victories: string[];
  warrior_score: number | null;
  week_label: string | null;
  week_start_date: string;
};

export type WeeklyBattleReportInput = Omit<WeeklyBattleReport, 'id' | 'user_id'>;
