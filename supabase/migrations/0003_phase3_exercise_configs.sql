with configs(slug, config) as (
  values
    (
      'warrior-map',
      $json${
        "actionLabel": "Save WARRIOR map",
        "description": "Rate the current strength of each WARRIOR category.",
        "ratings": {
          "min": 1,
          "max": 10,
          "labels": ["Warfare", "Arsenal", "Riches", "Relationships", "Identity & Purpose", "Occupation", "Resolve"]
        },
        "fields": [
          {"key": "priority_areas", "label": "Priority areas", "type": "textarea", "placeholder": "Which categories need the most attention now?"},
          {"key": "next_action", "label": "Next action", "type": "textarea", "placeholder": "What will you do first?"}
        ]
      }$json$::jsonb
    ),
    (
      'next-3-major-goals',
      $json${
        "actionLabel": "Save 3 goals",
        "groups": [{
          "key": "goals",
          "label": "Next 3 Major Goals",
          "repeat": 3,
          "fields": [
            {"key": "target", "label": "Exact target", "type": "textarea"},
            {"key": "deadline", "label": "Deadline", "type": "text", "placeholder": "YYYY-MM-DD or clear date"},
            {"key": "actions", "label": "Daily or weekly actions", "type": "textarea"},
            {"key": "obstacles", "label": "Obstacles", "type": "textarea"},
            {"key": "counterattack", "label": "Counterattack", "type": "textarea"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'top-3-goals',
      $json${
        "actionLabel": "Save top goals",
        "groups": [{
          "key": "top_goals",
          "label": "Top 3 Goals",
          "repeat": 3,
          "fields": [
            {"key": "outcome", "label": "Outcome", "type": "textarea"},
            {"key": "target_date", "label": "Target date", "type": "text"},
            {"key": "top_10_actions", "label": "Top 10 actions", "type": "textarea"},
            {"key": "progress_measure", "label": "Progress measure", "type": "text"},
            {"key": "resources_needed", "label": "Resources needed", "type": "textarea"},
            {"key": "celebration", "label": "Celebration plan", "type": "textarea"},
            {"key": "positive_goal_statement", "label": "Positive goal statement", "type": "textarea"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      '100-reasons-why',
      $json${
        "actionLabel": "Save reasons",
        "description": "Use one textarea per goal. Number the reasons or paste a list as you build toward 100.",
        "groups": [{
          "key": "goal_reasons",
          "label": "Reasons Why",
          "repeat": 3,
          "fields": [
            {"key": "goal_ref", "label": "Goal", "type": "text"},
            {"key": "reasons", "label": "Reasons list", "type": "textarea"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      '100-consequences',
      $json${
        "actionLabel": "Save consequences",
        "description": "Use one textarea per goal. Number the consequences or paste a list as you build toward 100.",
        "groups": [{
          "key": "goal_consequences",
          "label": "Consequences",
          "repeat": 3,
          "fields": [
            {"key": "goal_ref", "label": "Goal", "type": "text"},
            {"key": "consequences", "label": "Consequences list", "type": "textarea"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'create-mission-brief',
      $json${
        "actionLabel": "Save mission brief",
        "fields": [
          {"key": "visual_direction", "label": "Visual or image direction", "type": "textarea"},
          {"key": "precise_mission", "label": "Precise mission", "type": "textarea"},
          {"key": "deadline", "label": "Deadline", "type": "text"},
          {"key": "victory_statement", "label": "Victory statement in present tense", "type": "textarea"},
          {"key": "daily_review_location", "label": "Daily review location", "type": "text"}
        ]
      }$json$::jsonb
    ),
    (
      'craft-statement-of-desire',
      $json${
        "actionLabel": "Save statement",
        "fields": [
          {"key": "mission", "label": "Mission", "type": "textarea"},
          {"key": "deadline", "label": "Deadline", "type": "text"},
          {"key": "sacrifice", "label": "What you will give or sacrifice", "type": "textarea"},
          {"key": "why_it_matters", "label": "Why it matters", "type": "textarea"},
          {"key": "final_declaration", "label": "Final declaration", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'discover-your-mission',
      $json${
        "actionLabel": "Save mission inputs",
        "fields": [
          {"key": "top_5_values", "label": "Top 5 values", "type": "textarea"},
          {"key": "top_3_strengths", "label": "Top 3 strengths", "type": "textarea"},
          {"key": "top_3_passions", "label": "Top 3 passions", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'craft-mission-statement',
      $json${
        "actionLabel": "Save mission statement",
        "fields": [
          {"key": "mission_is_to", "label": "My mission is to...", "type": "textarea"},
          {"key": "i_will_do_this_by", "label": "I will do this by...", "type": "textarea"},
          {"key": "values_included", "label": "Values included", "type": "textarea"},
          {"key": "impact_on_others", "label": "Impact on others", "type": "textarea"},
          {"key": "final_mission_statement", "label": "Final mission statement", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'mission-brief-declaration',
      $json${
        "actionLabel": "Save declaration",
        "fields": [
          {"key": "category", "label": "Category", "type": "select", "options": ["Wealth", "Strength", "Brotherhood", "Purpose", "Legacy", "Other"]},
          {"key": "specific_goal", "label": "Specific goal", "type": "textarea"},
          {"key": "deadline", "label": "Deadline", "type": "text"},
          {"key": "sacrifices", "label": "Sacrifices", "type": "textarea"},
          {"key": "plan_of_attack", "label": "Plan of attack", "type": "textarea"},
          {"key": "oath", "label": "Oath", "type": "textarea"},
          {"key": "signature_date", "label": "Signature date", "type": "text"},
          {"key": "accountability_person", "label": "Witness or accountability person", "type": "text"}
        ]
      }$json$::jsonb
    ),
    (
      '15-year-warrior-vision',
      $json${
        "actionLabel": "Save vision grid",
        "groups": [{
          "key": "warrior_categories",
          "label": "WARRIOR Time Horizon Grid",
          "rowLabels": ["Warfare", "Arsenal", "Riches", "Relationships", "Identity & Purpose", "Occupation", "Resolve"],
          "fields": [
            {"key": "six_month_goal", "label": "6 months", "type": "textarea"},
            {"key": "one_year_goal", "label": "1 year", "type": "textarea"},
            {"key": "two_three_year_goal", "label": "2-3 years", "type": "textarea"},
            {"key": "four_six_year_goal", "label": "4-6 years", "type": "textarea"},
            {"key": "seven_ten_year_goal", "label": "7-10 years", "type": "textarea"},
            {"key": "ten_fifteen_year_goal", "label": "10-15 years", "type": "textarea"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'monthly-battle-plans',
      $json${
        "actionLabel": "Save monthly plan",
        "groups": [{
          "key": "months",
          "label": "Monthly Battle Plans",
          "repeat": 12,
          "fields": [
            {"key": "primary_objective", "label": "Primary objective", "type": "textarea"},
            {"key": "warrior_category_goals", "label": "WARRIOR category goals", "type": "textarea"},
            {"key": "success_metric", "label": "Success metric", "type": "text"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'daily-strikes',
      $json${
        "actionLabel": "Save daily strikes",
        "groups": [{
          "key": "daily_actions",
          "label": "Daily Strikes",
          "rowLabels": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "fields": [
            {"key": "category", "label": "WARRIOR category", "type": "select", "options": ["Warfare", "Arsenal", "Riches", "Relationships", "Identity & Purpose", "Occupation", "Resolve", "All", "Other"]},
            {"key": "strike", "label": "Daily strike", "type": "textarea"},
            {"key": "daily_log", "label": "Daily log", "type": "textarea"},
            {"key": "visualise_done", "label": "Visualised", "type": "checkbox"},
            {"key": "complete", "label": "Complete", "type": "checkbox"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'task-scoring-tool',
      $json${
        "actionLabel": "Save task scores",
        "description": "Score duration and impact from 1-10, then choose the disposition.",
        "groups": [{
          "key": "scored_tasks",
          "label": "Scored Tasks",
          "repeat": 5,
          "fields": [
            {"key": "task", "label": "Task", "type": "textarea"},
            {"key": "duration_bucket", "label": "Duration score", "type": "number"},
            {"key": "impact_bucket", "label": "Impact score", "type": "number"},
            {"key": "computed_score", "label": "Computed score", "type": "number"},
            {"key": "disposition", "label": "Disposition", "type": "select", "options": ["Do", "Delegate", "Date", "Dump"]}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'four-pillars',
      $json${
        "actionLabel": "Save pillar scores",
        "ratings": {
          "min": 1,
          "max": 10,
          "labels": ["Productivity", "Persuasion", "Physiology", "Psychology"]
        },
        "fields": [
          {"key": "one_week_improvement", "label": "One-week improvement", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'morning-routine',
      $json${
        "actionLabel": "Save morning routine",
        "groups": [{
          "key": "habits",
          "label": "Morning Routine",
          "repeat": 5,
          "fields": [
            {"key": "habit", "label": "Habit", "type": "text"},
            {"key": "enabled", "label": "Enabled", "type": "checkbox"},
            {"key": "duration_minutes", "label": "Minutes", "type": "number"},
            {"key": "order", "label": "Order", "type": "number"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'evening-routine',
      $json${
        "actionLabel": "Save evening routine",
        "groups": [{
          "key": "habits",
          "label": "Evening Routine",
          "repeat": 5,
          "fields": [
            {"key": "habit", "label": "Habit", "type": "text"},
            {"key": "enabled", "label": "Enabled", "type": "checkbox"},
            {"key": "duration_minutes", "label": "Minutes", "type": "number"},
            {"key": "order", "label": "Order", "type": "number"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'warrior-check-in',
      $json${
        "actionLabel": "Save check-in",
        "ratings": {
          "min": 1,
          "max": 10,
          "labels": ["Warfare", "Arsenal", "Riches", "Relationships", "Identity & Purpose", "Occupation", "Resolve"]
        },
        "fields": [
          {"key": "focus_for_week", "label": "Focus for the week", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'morning-setup',
      $json${
        "actionLabel": "Save morning setup",
        "fields": [
          {"key": "sleep_hours", "label": "Sleep hours", "type": "number"},
          {"key": "energy", "label": "Energy 1-10", "type": "number"},
          {"key": "weight", "label": "Weight", "type": "number"},
          {"key": "water_target", "label": "Water target", "type": "number"},
          {"key": "focus_score", "label": "Focus score 1-10", "type": "number"},
          {"key": "daily_category_focus", "label": "Daily WARRIOR focus", "type": "select", "options": ["Warfare", "Arsenal", "Riches", "Relationships", "Identity & Purpose", "Occupation", "Resolve"]},
          {"key": "top_mission_priorities", "label": "Top mission priorities", "type": "textarea"}
        ],
        "groups": [{
          "key": "habits",
          "label": "Active habits",
          "repeat": 4,
          "fields": [
            {"key": "habit", "label": "Habit", "type": "text"},
            {"key": "streak", "label": "Current streak", "type": "number"},
            {"key": "done", "label": "Done today", "type": "checkbox"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'habit-streaks',
      $json${
        "actionLabel": "Save habit streaks",
        "groups": [{
          "key": "habits",
          "label": "Habit Streaks",
          "repeat": 4,
          "fields": [
            {"key": "habit", "label": "Habit", "type": "text"},
            {"key": "target_date", "label": "Target date", "type": "text"},
            {"key": "current_streak", "label": "Current streak", "type": "number"},
            {"key": "completed_today", "label": "Completed today", "type": "checkbox"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'evening-reflection',
      $json${
        "actionLabel": "Save evening reflection",
        "fields": [
          {"key": "war_log", "label": "War log", "type": "textarea"},
          {"key": "follow_ups", "label": "Follow-ups", "type": "textarea"},
          {"key": "lessons", "label": "Lessons", "type": "textarea"},
          {"key": "biggest_win", "label": "Biggest win", "type": "textarea"},
          {"key": "executed_well", "label": "Executed well", "type": "textarea"},
          {"key": "challenge_overcome", "label": "Challenge overcome", "type": "textarea"},
          {"key": "mistake", "label": "Mistake", "type": "textarea"},
          {"key": "gratitude", "label": "Gratitude", "type": "textarea"},
          {"key": "quote_or_insight", "label": "Quote or insight", "type": "textarea"},
          {"key": "self_improvement_minutes", "label": "Self-improvement minutes", "type": "number"}
        ]
      }$json$::jsonb
    ),
    (
      'weekly-reset',
      $json${
        "actionLabel": "Save weekly reset",
        "fields": [
          {"key": "victories", "label": "Victories", "type": "textarea"},
          {"key": "lessons", "label": "Lessons", "type": "textarea"},
          {"key": "goal_alignment", "label": "Goal alignment", "type": "textarea"},
          {"key": "priority_follow_through", "label": "Priority follow-through", "type": "textarea"},
          {"key": "habit_improvement", "label": "Habit improvement", "type": "textarea"},
          {"key": "tactical_adjustments", "label": "Tactical adjustments", "type": "textarea"},
          {"key": "next_week_battle_cry", "label": "Next week battle cry", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'daily-targets',
      $json${
        "actionLabel": "Save daily targets",
        "groups": [{
          "key": "critical_actions",
          "label": "Critical Actions",
          "repeat": 3,
          "fields": [
            {"key": "action", "label": "Action", "type": "textarea"},
            {"key": "done", "label": "Done", "type": "checkbox"}
          ]
        }]
      }$json$::jsonb
    ),
    (
      'craft-warriors-creed',
      $json${
        "actionLabel": "Save creed",
        "groups": [{
          "key": "life_areas",
          "label": "Life Areas",
          "repeat": 7,
          "fields": [
            {"key": "area", "label": "Area", "type": "text"},
            {"key": "goal", "label": "Goal", "type": "textarea"},
            {"key": "victory_statement", "label": "Victory statement", "type": "textarea"}
          ]
        }],
        "fields": [
          {"key": "final_creed", "label": "Final creed", "type": "textarea"}
        ]
      }$json$::jsonb
    ),
    (
      'daily-practice',
      $json${
        "actionLabel": "Save practice",
        "fields": [
          {"key": "morning_read_aloud_done", "label": "Morning read-aloud done", "type": "checkbox"},
          {"key": "evening_read_aloud_done", "label": "Evening read-aloud done", "type": "checkbox"},
          {"key": "visualization_note", "label": "Visualization note", "type": "textarea"}
        ]
      }$json$::jsonb
    )
)
update public.sections as s
set exercise_config = configs.config
from configs
where s.slug = configs.slug;
