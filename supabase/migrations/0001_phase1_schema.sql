create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  course_start_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  module_number integer not null unique,
  description text,
  unlock_order integer not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  title text not null,
  ordinal integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, ordinal)
);

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  slug text not null,
  title text not null,
  section_type text not null check (section_type in ('reading', 'reflection', 'form', 'rating')),
  ordinal integer not null,
  content jsonb not null default '{}'::jsonb,
  exercise_config jsonb not null default '{}'::jsonb,
  estimated_minutes integer,
  is_required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, slug),
  unique (chapter_id, ordinal)
);

create table public.warrior_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  ordinal integer not null unique
);

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  section_id uuid not null references public.sections(id) on delete cascade,
  status text not null default 'not_started' check (status in ('not_started', 'in_progress', 'complete')),
  response jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, section_id)
);

create table public.vision_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_slug text,
  prompt_key text,
  response text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  warrior_category_id uuid references public.warrior_categories(id),
  title text not null,
  description text,
  deadline date,
  measurement text,
  resources text,
  celebration_plan text,
  top10_actions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'paused', 'complete', 'archived')),
  progress_percent integer not null default 0 check (progress_percent between 0 and 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.goal_reasons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid not null references public.goals(id) on delete cascade,
  reason_type text not null check (reason_type in ('why', 'consequence')),
  text text not null,
  ordinal integer not null check (ordinal between 1 and 100),
  created_at timestamptz not null default now(),
  unique (goal_id, reason_type, ordinal)
);

create table public.mission_statement (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  values_list jsonb not null default '[]'::jsonb,
  strengths jsonb not null default '[]'::jsonb,
  passions jsonb not null default '[]'::jsonb,
  template_fields jsonb not null default '{}'::jsonb,
  final_statement text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mission_brief (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_text text,
  category text check (category in ('Wealth', 'Strength', 'Brotherhood', 'Purpose', 'Legacy', 'Other')),
  deadline date,
  sacrifices text,
  plan_of_attack text,
  oath_signed_at timestamptz,
  witness_name text,
  signature_path text,
  vision_board_image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.time_horizon_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  warrior_category_id uuid references public.warrior_categories(id),
  time_band text not null check (time_band in ('6mo', '1yr', '2-3yr', '4-6yr', '7-10yr', '10-15yr')),
  text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.monthly_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  warrior_category_id uuid references public.warrior_categories(id),
  month_number integer not null check (month_number between 1 and 12),
  year integer,
  text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.weekly_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  warrior_category_id uuid references public.warrior_categories(id),
  week_start_date date,
  text text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.daily_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete set null,
  warrior_category_id uuid references public.warrior_categories(id),
  action_date date not null,
  text text not null default '',
  is_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hourly_plan (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_date date not null,
  time_slot time not null,
  action text not null default '',
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.task_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_text text not null,
  duration_bucket integer not null check (duration_bucket between 1 and 5),
  impact_bucket integer not null check (impact_bucket between 1 and 10),
  score integer generated always as (duration_bucket * impact_bucket) stored,
  disposition text check (disposition in ('Do', 'Delegate', 'Date', 'Dump')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.battle_reports_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_date date not null,
  energy integer check (energy between 1 and 10),
  weight numeric,
  water_glasses integer,
  focus integer check (focus between 1 and 10),
  category_focus jsonb not null default '{}'::jsonb,
  mission_priorities jsonb not null default '[]'::jsonb,
  habits jsonb not null default '[]'::jsonb,
  action_tasks jsonb not null default '[]'::jsonb,
  war_log text,
  follow_ups text,
  lessons text,
  biggest_win text,
  executed_well text,
  challenge_overcome text,
  mistake text,
  gratitude text,
  self_improvement_hours numeric,
  daily_quote_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, report_date)
);

create table public.battle_reports_weekly (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_start_date date not null,
  week_label text,
  battle_objective text,
  key_targets jsonb not null default '[]'::jsonb,
  victories jsonb not null default '[]'::jsonb,
  lessons jsonb not null default '[]'::jsonb,
  aligned_goals boolean,
  aligned_goals_why_not text,
  followed_priorities boolean,
  followed_priorities_why_not text,
  improved_habits boolean,
  improved_habits_why_not text,
  improve_area text,
  new_strategy text,
  stop_doing text,
  warrior_score integer,
  next_week_battle_cry text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_start_date)
);

create table public.affirmations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  category text,
  text text not null,
  is_custom boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((is_custom = false and user_id is null) or (is_custom = true and user_id is not null))
);

create table public.routines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  routine_type text not null check (routine_type in ('morning', 'evening')),
  habit_text text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_type text not null check (reminder_type in ('habit', 'quote', 'module-unlock', 'battle-report')),
  schedule jsonb not null default '{}'::jsonb,
  timezone text,
  payload jsonb not null default '{}'::jsonb,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author text,
  source text not null default 'course' check (source in ('course', 'external')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles', 'modules', 'chapters', 'sections', 'progress', 'vision_entries', 'goals',
    'mission_statement', 'mission_brief', 'time_horizon_goals', 'monthly_goals',
    'weekly_actions', 'daily_actions', 'hourly_plan', 'task_scores', 'battle_reports_daily',
    'battle_reports_weekly', 'affirmations', 'routines', 'reminders'
  ]
  loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;

insert into public.warrior_categories (slug, name, ordinal) values
  ('warfare', 'Warfare', 1),
  ('arsenal', 'Arsenal', 2),
  ('riches', 'Riches', 3),
  ('relationships', 'Relationships', 4),
  ('identity-purpose', 'Identity & Purpose', 5),
  ('occupation', 'Occupation', 6),
  ('resolve', 'Resolve', 7)
on conflict (slug) do nothing;

alter table public.profiles enable row level security;
alter table public.modules enable row level security;
alter table public.chapters enable row level security;
alter table public.sections enable row level security;
alter table public.warrior_categories enable row level security;
alter table public.progress enable row level security;
alter table public.vision_entries enable row level security;
alter table public.goals enable row level security;
alter table public.goal_reasons enable row level security;
alter table public.mission_statement enable row level security;
alter table public.mission_brief enable row level security;
alter table public.time_horizon_goals enable row level security;
alter table public.monthly_goals enable row level security;
alter table public.weekly_actions enable row level security;
alter table public.daily_actions enable row level security;
alter table public.hourly_plan enable row level security;
alter table public.task_scores enable row level security;
alter table public.battle_reports_daily enable row level security;
alter table public.battle_reports_weekly enable row level security;
alter table public.affirmations enable row level security;
alter table public.routines enable row level security;
alter table public.reminders enable row level security;
alter table public.quotes enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "modules_read" on public.modules for select to anon, authenticated using (is_published = true);
create policy "chapters_read" on public.chapters for select to anon, authenticated using (
  exists (
    select 1
    from public.modules
    where modules.id = chapters.module_id
      and modules.is_published = true
  )
);
create policy "sections_read" on public.sections for select to anon, authenticated using (
  exists (
    select 1
    from public.chapters
    join public.modules on modules.id = chapters.module_id
    where chapters.id = sections.chapter_id
      and modules.is_published = true
  )
);
create policy "warrior_categories_read" on public.warrior_categories for select to anon, authenticated using (true);
create policy "quotes_read" on public.quotes for select to authenticated using (true);

create policy "affirmations_read" on public.affirmations for select to authenticated using (user_id is null or user_id = auth.uid());
create policy "affirmations_insert_own" on public.affirmations for insert to authenticated with check (user_id = auth.uid() and is_custom = true);
create policy "affirmations_update_own" on public.affirmations for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid() and is_custom = true);
create policy "affirmations_delete_own" on public.affirmations for delete to authenticated using (user_id = auth.uid());

create policy "progress_all_own" on public.progress for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "vision_entries_all_own" on public.vision_entries for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "goals_all_own" on public.goals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "goal_reasons_all_own" on public.goal_reasons for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mission_statement_all_own" on public.mission_statement for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mission_brief_all_own" on public.mission_brief for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "time_horizon_goals_all_own" on public.time_horizon_goals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "monthly_goals_all_own" on public.monthly_goals for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "weekly_actions_all_own" on public.weekly_actions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "daily_actions_all_own" on public.daily_actions for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "hourly_plan_all_own" on public.hourly_plan for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "task_scores_all_own" on public.task_scores for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "battle_reports_daily_all_own" on public.battle_reports_daily for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "battle_reports_weekly_all_own" on public.battle_reports_weekly for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "routines_all_own" on public.routines for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "reminders_all_own" on public.reminders for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
