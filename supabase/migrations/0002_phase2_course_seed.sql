do $$
declare
  module_item jsonb;
  section_item jsonb;
  seeded_module_id uuid;
  seeded_chapter_id uuid;
  section_ordinal integer;
begin
  for module_item in
    select *
    from jsonb_array_elements($seed$
[
  {
    "module_number": 0,
    "unlock_order": 0,
    "slug": "forging-your-destiny-introduction",
    "title": "Forging Your Destiny - Introduction",
    "subtitle": "Orientation and commitment",
    "description": "Start the program, understand the layout, and commit to applied execution.",
    "sections": [
      {"slug":"welcome-warriors-code","title":"Welcome to The Warrior's Code","type":"reading","minutes":6,"body":"This orientation sets the standard for the Renegade Millionaire path: applied knowledge, daily execution, and ownership of your future."},
      {"slug":"applied-knowledge","title":"Applied Knowledge vs I Know That","type":"reflection","minutes":8,"body":"Knowing is not execution. This program is built to turn insight into action.","prompts":["Where are you currently knowing but not applying?","What is one lesson you already understand but need to execute this week?"]},
      {"slug":"future-created-today","title":"Your Future Is Created by What You Do Today","type":"reading","minutes":5,"body":"The course is sequential because identity, goals, mission, time, and execution compound through repeated action."},
      {"slug":"program-layout","title":"Program Layout","type":"reading","minutes":6,"body":"You will progress from vision and goals into mission, time planning, daily battle reporting, discipline, and creed work."},
      {"slug":"course-commitment","title":"Course Commitment","type":"reflection","minutes":8,"body":"Make a clear commitment before starting the modules.","prompts":["What are you committing to execute during this program?","What excuses are you retiring before Module 1?"]}
    ]
  },
  {
    "module_number": 1,
    "unlock_order": 1,
    "slug": "warriors-vision-commanding-your-future",
    "title": "The Warrior's Vision - Commanding Your Future",
    "subtitle": "Define the battlefield and the future you are building",
    "description": "Map your vision, assess the seven WARRIOR categories, and forge your next three major goals.",
    "sections": [
      {"slug":"importance-of-goal-setting","title":"The Importance of Goal Setting","type":"reading","minutes":7,"body":"Goals turn desire into a target. The warrior defines the target before choosing tactics."},
      {"slug":"defining-your-battlefield","title":"The Warrior's Vision: Defining Your Battlefield","type":"reading","minutes":7,"body":"Your battlefield includes your body, relationships, occupation, money, discipline, and identity."},
      {"slug":"vision-mapping-drill","title":"Vision Mapping Drill","type":"reflection","minutes":14,"body":"Describe your peak future in practical detail.","prompts":["What does strength look like in your future?","What routines anchor your day?","What occupation, wealth, brotherhood, and spiritual alignment are you building?"]},
      {"slug":"dream-life-immersion","title":"Dream Life Immersion","type":"reflection","minutes":16,"body":"Immerse yourself in the daily experience of the life you are choosing.","prompts":["Where do you live?","Who is in your circle?","How do you lead and serve?","What legacy are you creating?"]},
      {"slug":"big-domino","title":"The Big Domino","type":"reflection","minutes":10,"body":"One decisive goal can make many other goals easier or unnecessary.","prompts":["What one goal or action would make everything else easier or unnecessary?"]},
      {"slug":"warrior-map","title":"The WARRIOR Map","type":"rating","minutes":12,"body":"Rate each WARRIOR category from 1 to 10, then choose the priority areas that need action.","exercise_config":{"scale":{"min":1,"max":10,"labels":["Warfare","Arsenal","Riches","Relationships","Identity & Purpose","Occupation","Resolve"]}}},
      {"slug":"next-3-major-goals","title":"Forge Your Next 3 Major Goals","type":"form","minutes":18,"body":"Define three major goals and the actions required to attack them.","prompts":["For each goal, define the exact target, daily or weekly actions, obstacles, and counterattack."]},
      {"slug":"warrior-declaration","title":"Warrior Declaration","type":"reflection","minutes":8,"body":"Commit to execution without excuses.","prompts":["Write your personal commitment to execute without excuses."]},
      {"slug":"recap-reflection","title":"Recap & Reflection","type":"reflection","minutes":8,"body":"Lock in the clarity created in this module.","prompts":["How does clarity feel?","What excites you?","What challenge will you overcome starting today?"]}
    ]
  },
  {
    "module_number": 2,
    "unlock_order": 2,
    "slug": "forging-your-destiny-from-dreams-to-reality",
    "title": "Forging Your Destiny - From Dreams to Reality",
    "subtitle": "Convert vision into measurable goals",
    "description": "Turn dreams into goals, define the top three, and build the why strong enough to execute.",
    "sections": [
      {"slug":"from-vision-to-action","title":"From Vision to Action","type":"reading","minutes":6,"body":"A dream becomes useful when it has a deadline, measurement, and next action."},
      {"slug":"dreams-to-actionable-goals","title":"Rewrite Dream Life Into Actionable Goals","type":"form","minutes":18,"body":"Convert each dream into a concrete goal.","prompts":["For each dream, define what, when or deadline, and WARRIOR category."]},
      {"slug":"top-3-goals","title":"Defining Your Top 3 Goals","type":"form","minutes":22,"body":"Choose the three goals that matter most now.","prompts":["For each goal, capture outcome, date, top 10 actions, progress measure, resources, celebration, and final positive goal statement."]},
      {"slug":"discovering-your-why","title":"Discovering Your Why","type":"reading","minutes":7,"body":"Willpower gets stronger when the reason is emotionally real and repeatedly reviewed."},
      {"slug":"100-reasons-why","title":"100 Reasons Why","type":"form","minutes":20,"body":"Build the emotional case for each top goal.","prompts":["For each Top 3 goal, list reasons you must achieve this. Phase 3 will add the chunked 100-item input."]},
      {"slug":"100-consequences","title":"100 Consequences of Failure","type":"form","minutes":20,"body":"Face the cost of inaction clearly.","prompts":["For each Top 3 goal, list consequences if you fail to act. Phase 3 will add the chunked 100-item input."]},
      {"slug":"persistence-willpower","title":"Persistence & Willpower","type":"reflection","minutes":10,"body":"Persistence is trained by daily hard action.","prompts":["Which reason makes this goal non-negotiable?","What daily hard action will strengthen your willpower?"]},
      {"slug":"recap-reflection","title":"Recap & Reflection","type":"reflection","minutes":8,"body":"Review alignment and choose the next step.","prompts":["Do these goals align with the warrior you are becoming?","What is the next step?"]}
    ]
  },
  {
    "module_number": 3,
    "unlock_order": 3,
    "slug": "warriors-battle-cards-mission-brief",
    "title": "The Warrior's Battle Cards - Mission Brief & Statement of Desire",
    "subtitle": "Keep the mission visible",
    "description": "Create a visual mission brief and statement of desire you can review daily.",
    "sections": [
      {"slug":"why-mission-brief","title":"Why Your Mission Brief Is Essential","type":"reading","minutes":7,"body":"The mission brief keeps your target visible and emotionally charged."},
      {"slug":"create-mission-brief","title":"Create Your Mission Brief","type":"form","minutes":18,"body":"Build a visual one-page mission brief.","prompts":["Choose a visual or image, define the precise mission, set the deadline, and write the statement of victory in present tense."]},
      {"slug":"use-mission-brief","title":"How to Use Your Mission Brief","type":"reading","minutes":6,"body":"Review the brief daily and use it to reset attention when discipline slips."},
      {"slug":"statement-of-desire","title":"Statement of Desire","type":"reading","minutes":6,"body":"A statement of desire clarifies the mission, deadline, sacrifice, and why."},
      {"slug":"craft-statement-of-desire","title":"Craft Your Statement of Desire","type":"form","minutes":16,"body":"Turn desire into a declaration.","prompts":["Define mission, deadline, what you will give or sacrifice, and why it matters. Combine into one declaration."]},
      {"slug":"daily-execution-commitment","title":"Daily Execution Commitment","type":"reflection","minutes":8,"body":"Decide how the brief becomes part of daily execution.","prompts":["Where will you place or carry this brief?","When will you read it daily?"]}
    ]
  },
  {
    "module_number": 4,
    "unlock_order": 4,
    "slug": "warriors-mission-defining-your-purpose",
    "title": "The Warrior's Mission - Defining Your Purpose",
    "subtitle": "Define purpose and a mission brief declaration",
    "description": "Clarify values, strengths, passions, mission, and the 30-day commitment to live it.",
    "sections": [
      {"slug":"what-is-mission-statement","title":"What Is a Mission Statement?","type":"reading","minutes":6,"body":"A mission statement turns identity and purpose into a daily operating standard."},
      {"slug":"mission-vs-vision","title":"Mission vs. Vision","type":"reading","minutes":6,"body":"Vision describes the destination. Mission describes what you do and why you do it."},
      {"slug":"discover-your-mission","title":"Discover Your Mission","type":"form","minutes":16,"body":"Identify the raw material of your mission.","prompts":["List your top 5 values, top 3 strengths, and 3 passions."]},
      {"slug":"craft-mission-statement","title":"Craft Your Own Mission Statement","type":"form","minutes":16,"body":"Assemble the statement.","prompts":["Complete: My mission is to... and I will do this by... Add values and impact on others or the world."]},
      {"slug":"mission-brief-declaration","title":"MISSION Brief Declaration","type":"form","minutes":18,"body":"Capture the workbook declaration fields.","prompts":["Enter category, specific goal, deadline, sacrifices, plan of attack, oath or signature date, and witness or accountability person."]},
      {"slug":"living-your-mission","title":"Living Your Mission","type":"reading","minutes":6,"body":"The mission only matters when reviewed, acted on, and corrected daily."},
      {"slug":"30-day-warrior-commitment","title":"30-Day Warrior Commitment","type":"form","minutes":12,"body":"Create the review rhythm.","prompts":["Set morning, midday, and evening review reminders; track daily completion."]},
      {"slug":"daily-alignment-reflection","title":"Daily Alignment Reflection","type":"reflection","minutes":8,"body":"Review alignment honestly.","prompts":["How did your actions align with your mission today?","Where did you stray?","How will you improve tomorrow?"]},
      {"slug":"recap-reflection","title":"Recap & Reflection","type":"reflection","minutes":8,"body":"Confirm the mission is strong enough to guide action.","prompts":["Does your mission inspire you?","How does it align with your Module 1 vision?"]}
    ]
  },
  {
    "module_number": 5,
    "unlock_order": 5,
    "slug": "tactical-goal-setting-breaking-down-the-mission",
    "title": "Tactical Goal Setting - Breaking Down the Mission",
    "subtitle": "Long-range goals to daily strikes",
    "description": "Break the mission down from long-range WARRIOR goals into monthly, weekly, daily, and hourly action.",
    "sections": [
      {"slug":"begin-with-end","title":"Begin With the End in Mind","type":"reading","minutes":6,"body":"Start with the final target and work backward into action."},
      {"slug":"15-year-warrior-vision","title":"15-Year WARRIOR Vision","type":"form","minutes":24,"body":"Define long-range goals by category and time horizon.","prompts":["For each WARRIOR category, define goals across 6mo, 1yr, 2-3yr, 4-6yr, 7-10yr, and 10-15yr."]},
      {"slug":"working-backward-milestones","title":"Working Backward Milestones","type":"form","minutes":18,"body":"Translate long-term goals into milestones.","prompts":["Break long-term goals into 10-year, 7-year, 5-year, 3-year, and 1-year milestones."]},
      {"slug":"monthly-battle-plans","title":"Monthly Battle Plans","type":"form","minutes":18,"body":"Define monthly goals by WARRIOR category.","prompts":["For each WARRIOR category, define Month 1-12 goals."]},
      {"slug":"weekly-battle-plans","title":"Weekly Battle Plans","type":"form","minutes":16,"body":"Define weekly actions by category.","prompts":["Define weekly actions by WARRIOR category, All, and Other actions."]},
      {"slug":"daily-strikes","title":"Daily Strikes","type":"form","minutes":16,"body":"Turn the week into daily action.","prompts":["Define daily actions by day and category. Include Daily Log & Visualise."]},
      {"slug":"hourly-planner","title":"Hourly Planner","type":"form","minutes":12,"body":"Block time for execution.","prompts":["Capture time, daily action, and comment."]},
      {"slug":"big-dominos","title":"Big Dominos","type":"reflection","minutes":8,"body":"Find the actions with the biggest ripple effect.","prompts":["Which goals or actions create the biggest ripple effect?"]},
      {"slug":"celebrate-victory","title":"Celebrate Every Victory","type":"reflection","minutes":8,"body":"Progress must be acknowledged to reinforce identity.","prompts":["How will you acknowledge progress, reflect on growth, and reward milestone wins?"]},
      {"slug":"final-warrior-reflection","title":"Final Warrior Reflection","type":"reflection","minutes":8,"body":"Convert planning into immediate action.","prompts":["What are the top three actions you will take today?","What discipline must you double down on?"]}
    ]
  },
  {
    "module_number": 6,
    "unlock_order": 6,
    "slug": "mastering-time-warriors-command-over-his-day",
    "title": "Mastering Time - The Warrior's Command Over His Day",
    "subtitle": "Priorities, time blocks, and task scoring",
    "description": "Master prioritization, eliminate time thieves, and build command over the day.",
    "sections": [
      {"slug":"time-domination-overview","title":"Time Domination Overview","type":"reading","minutes":6,"body":"Time domination begins with ownership of attention, priorities, and schedule."},
      {"slug":"power-of-prioritization","title":"The Power of Prioritization","type":"reflection","minutes":8,"body":"The most important task must be named before the day starts.","prompts":["Identify today's single frog or most important task and commit to doing it first."]},
      {"slug":"8020-vital-few","title":"80/20 Rule: Vital Few","type":"form","minutes":14,"body":"Find the small set of actions creating most progress.","prompts":["List current tasks and projects; mark the 20% that create most progress; choose what to eliminate, automate, or delegate."]},
      {"slug":"high-low-value-tasks","title":"High-Value vs Low-Value Tasks","type":"form","minutes":12,"body":"Schedule work that moves the mission.","prompts":["Define top 5 high-value tasks for the week and schedule them."]},
      {"slug":"time-thieves","title":"Saying No to Time Thieves","type":"reflection","minutes":10,"body":"No protects the mission.","prompts":["Where do you say yes too often?","Write three situations where you must say no and draft your warrior no."]},
      {"slug":"eisenhower-matrix","title":"Eisenhower Matrix","type":"form","minutes":14,"body":"Separate urgency from importance.","prompts":["Sort weekly tasks into urgent/important quadrants and schedule Quadrant 2 blocks."]},
      {"slug":"task-scoring-tool","title":"Task Scoring Tool","type":"form","minutes":14,"body":"Score tasks by duration and impact, then choose Do, Delegate, Date, or Dump.","prompts":["Enter task, duration bucket, impact bucket, computed score, and disposition."]}
    ]
  },
  {
    "module_number": 7,
    "unlock_order": 7,
    "slug": "peak-performance-training-for-maximum-impact",
    "title": "Peak Performance - Training for Maximum Impact",
    "subtitle": "Productivity, persuasion, physiology, psychology",
    "description": "Assess and build the four pillars of high performance.",
    "sections": [
      {"slug":"peak-performance-overview","title":"Peak Performance Overview","type":"reading","minutes":6,"body":"High performance is trained through repeatable standards across work, body, mind, and influence."},
      {"slug":"what-is-high-performance","title":"What Is High Performance?","type":"reflection","minutes":10,"body":"Define the gap between current performance and required performance.","prompts":["What are your biggest goals?","Where are your current performance gaps?","What one change will you make this week?"]},
      {"slug":"four-pillars","title":"The Four Pillars","type":"rating","minutes":10,"body":"Rate Productivity, Persuasion, Physiology, and Psychology.","exercise_config":{"scale":{"min":1,"max":10,"labels":["Productivity","Persuasion","Physiology","Psychology"]}}},
      {"slug":"productivity","title":"Productivity","type":"reflection","minutes":10,"body":"Productivity is priority execution, not busyness.","prompts":["Identify today's most important action, schedule a deep-work block, and choose the hardest task to attack first."]},
      {"slug":"persuasion","title":"Persuasion","type":"reflection","minutes":10,"body":"Influence improves when communication becomes clearer, more empathetic, and more decisive.","prompts":["Review a recent conversation and write three improvements for clarity, empathy, or influence."]},
      {"slug":"physiology","title":"Physiology","type":"rating","minutes":10,"body":"The body is part of the operating system.","prompts":["Assess exercise, nutrition, sleep, and hydration. Set one health goal for the week."]},
      {"slug":"psychology","title":"Psychology","type":"reflection","minutes":10,"body":"Mental habits drive emotional control and execution.","prompts":["Reflect on a recent challenge and choose one mental habit to strengthen."]},
      {"slug":"morning-routine","title":"Morning Routine Builder","type":"form","minutes":12,"body":"Build the morning routine that starts the day with command.","prompts":["Select or write morning habits: prayer/reflection, movement, affirmations, visualization, and priority review."]},
      {"slug":"evening-routine","title":"Evening Routine Builder","type":"form","minutes":12,"body":"Build the evening routine that closes the loop.","prompts":["Select or write evening habits: daily review, gratitude, tomorrow's priority, and reset ritual."]}
    ]
  },
  {
    "module_number": 8,
    "unlock_order": 8,
    "slug": "warriors-daily-system-consistency-and-execution",
    "title": "The Warrior's Daily System - Consistency and Execution",
    "subtitle": "Battle Report daily and weekly execution",
    "description": "Build the recurring Battle Report system for daily execution and weekly review.",
    "sections": [
      {"slug":"battle-report-overview","title":"Battle Report Overview","type":"reading","minutes":6,"body":"The Battle Report is the daily operating system for consistency and execution."},
      {"slug":"weekly-planning","title":"Weekly Planning","type":"form","minutes":14,"body":"Set the weekly battlefield.","prompts":["Set weekly battle objective, key targets, and weekly priorities."]},
      {"slug":"warrior-check-in","title":"PROSPER / WARRIOR Check-In","type":"rating","minutes":10,"body":"Rate focus across the WARRIOR categories.","exercise_config":{"scale":{"min":1,"max":10,"labels":["Warfare","Arsenal","Riches","Relationships","Identity & Purpose","Occupation","Resolve"]}}},
      {"slug":"morning-setup","title":"Morning Setup","type":"form","minutes":16,"body":"Set up the day before it starts.","prompts":["Log sleep/energy, weight, water, focus score, daily category focus, top habits/streaks, and top mission priorities."]},
      {"slug":"habit-streaks","title":"Habit Streaks","type":"form","minutes":12,"body":"Track four active habits and streaks.","prompts":["Define Habit 1-4, target date, current streak, and daily completion."]},
      {"slug":"evening-reflection","title":"Evening Reflection","type":"form","minutes":16,"body":"Review the day honestly.","prompts":["Capture war log, follow-ups, lessons, biggest win, executed well, challenge overcome, mistake, gratitude, quote or insight, and self-improvement time."]},
      {"slug":"weekly-reset","title":"Weekly Reflection & Reset","type":"form","minutes":18,"body":"Close the week and adjust tactics.","prompts":["Record victories, lessons, goal alignment, priority follow-through, habit improvement, tactical adjustments, and next week battle cry."]},
      {"slug":"warrior-score","title":"Warrior Score","type":"rating","minutes":8,"body":"Capture daily and weekly score fields. The exact formula still needs confirmation before Phase 5 automation."}
    ]
  },
  {
    "module_number": 9,
    "unlock_order": 9,
    "slug": "code-of-discipline-rituals-of-success",
    "title": "The Code of Discipline - The Rituals of Success",
    "subtitle": "Ten daily disciplines",
    "description": "Install daily rituals that reinforce identity, discipline, and execution.",
    "sections": [
      {"slug":"discipline-overview","title":"Discipline Overview","type":"reading","minutes":6,"body":"Discipline is the ritualized expression of what you value most."},
      {"slug":"10-daily-disciplines","title":"The 10 Daily Disciplines","type":"reading","minutes":8,"body":"The ten disciplines create a daily baseline for mindset, body, relationships, targets, and review."},
      {"slug":"affirm-visualize","title":"Affirm & Visualize","type":"form","minutes":8,"body":"Start the day by rehearsing identity and target.","prompts":["Write a morning affirmation and visualization target for today."]},
      {"slug":"gratitude","title":"Gratitude","type":"form","minutes":6,"body":"Gratitude trains attention toward strength and abundance.","prompts":["Enter three things you are grateful for."]},
      {"slug":"read-learn","title":"Read & Learn","type":"form","minutes":8,"body":"Daily learning compounds.","prompts":["Track 20 minutes of reading or learning and capture the key takeaway."]},
      {"slug":"train-hydrate","title":"Train & Hydrate","type":"form","minutes":8,"body":"Physical standards support execution.","prompts":["Log movement, water intake, and energy or body readiness."]},
      {"slug":"daily-targets","title":"Daily Targets","type":"form","minutes":8,"body":"Name the actions that make the day successful.","prompts":["Define three critical actions for the day."]},
      {"slug":"review-celebrate","title":"Review & Celebrate Wins","type":"reflection","minutes":8,"body":"Close the day by reinforcing progress.","prompts":["Record accomplishment, lesson, and one small win."]}
    ]
  },
  {
    "module_number": 10,
    "unlock_order": 10,
    "slug": "warriors-creed-programming-mindset-of-victory",
    "title": "The Warrior's Creed - Programming a Mindset of Victory",
    "subtitle": "Affirmations and personal creed",
    "description": "Build a personal creed and a daily practice that programs victory into identity.",
    "sections": [
      {"slug":"mindset-victory-overview","title":"Mindset of Victory Overview","type":"reading","minutes":6,"body":"The creed is a repeated declaration of identity, standards, and desired future."},
      {"slug":"power-of-affirmations","title":"Power of Affirmations","type":"reading","minutes":7,"body":"Affirmations focus language, attention, and emotional rehearsal."},
      {"slug":"powerful-affirmation","title":"What Makes an Affirmation Powerful?","type":"reflection","minutes":10,"body":"Strong affirmations are present-tense, positive, personal, and tied to action.","prompts":["Rewrite weak statements into present-tense, positive, personal declarations."]},
      {"slug":"affirmation-library","title":"Affirmation Library","type":"form","minutes":12,"body":"Select affirmations by category and adapt them to your life.","prompts":["Browse and select seed affirmations by category: Identity, Relationships, Occupation, Spirituality, Physical Health, Emotional Mastery, and Financial Resources."]},
      {"slug":"craft-warriors-creed","title":"Craft Your Warrior's Creed","type":"form","minutes":18,"body":"Assemble your personal creed.","prompts":["Define goals by life area, turn each into a victory statement, and save your personal creed."]},
      {"slug":"daily-practice","title":"Daily Practice","type":"form","minutes":8,"body":"Repetition turns creed into operating language.","prompts":["Track morning and evening creed read-aloud with a visualization note."]},
      {"slug":"30-day-creed-challenge","title":"30-Day Creed Challenge","type":"form","minutes":10,"body":"Run the creed daily for 30 days.","prompts":["Track twice-daily completion, confidence or mindset impact, and execution score."]},
      {"slug":"final-creed-reflection","title":"Final Creed Reflection","type":"reflection","minutes":10,"body":"Review the change created by the creed practice.","prompts":["What changed in your mindset, confidence, and behavior after the challenge?"]}
    ]
  }
]
$seed$::jsonb)
  loop
    insert into public.modules (slug, title, subtitle, module_number, description, unlock_order, is_published)
    values (
      module_item->>'slug',
      module_item->>'title',
      module_item->>'subtitle',
      (module_item->>'module_number')::integer,
      module_item->>'description',
      (module_item->>'unlock_order')::integer,
      true
    )
    on conflict (slug) do update set
      title = excluded.title,
      subtitle = excluded.subtitle,
      module_number = excluded.module_number,
      description = excluded.description,
      unlock_order = excluded.unlock_order,
      is_published = true
    returning id into seeded_module_id;

    insert into public.chapters (module_id, title, ordinal)
    values (seeded_module_id, 'Lessons', 1)
    on conflict (module_id, ordinal) do update set
      title = excluded.title
    returning id into seeded_chapter_id;

    section_ordinal := 0;

    for section_item in
      select *
      from jsonb_array_elements(module_item->'sections')
    loop
      section_ordinal := section_ordinal + 1;

      insert into public.sections (
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
      values (
        seeded_chapter_id,
        section_item->>'slug',
        section_item->>'title',
        section_item->>'type',
        section_ordinal,
        jsonb_strip_nulls(jsonb_build_object(
          'body', section_item->>'body',
          'prompts', coalesce(section_item->'prompts', '[]'::jsonb)
        )),
        coalesce(section_item->'exercise_config', jsonb_build_object('actionLabel', 'Mark complete')),
        (section_item->>'minutes')::integer,
        true
      )
      on conflict (chapter_id, slug) do update set
        title = excluded.title,
        section_type = excluded.section_type,
        ordinal = excluded.ordinal,
        content = excluded.content,
        exercise_config = excluded.exercise_config,
        estimated_minutes = excluded.estimated_minutes,
        is_required = excluded.is_required;
    end loop;
  end loop;
end $$;
