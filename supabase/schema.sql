-- Iron Log — Supabase schema
-- Personal single-user app, no login screen: every row is scoped to a fixed
-- app-level owner id (lib/owner.js) instead of a real Supabase Auth user.
-- Run this once in the Supabase SQL editor for a new project.

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  start_date date not null default current_date,
  paused_ranges jsonb not null default '[]'::jsonb,
  exercise_overrides jsonb not null default '{}'::jsonb -- {slotId: catalogExerciseId}, persists a "change exercise" swap
);

create table if not exists exercise_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  exercise_id text not null,
  date date not null default current_date,
  sets jsonb not null, -- [{weight: number, reps: number}, ...], empty when skipped
  skipped boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists exercise_history_user_exercise_idx
  on exercise_history (user_id, exercise_id, date);

alter table profile enable row level security;
alter table exercise_history enable row level security;

-- No login screen means no auth.uid() to check against. Access control here is
-- "know the anon key + project URL", same trust boundary as any unlisted app.
create policy "open profile" on profile for all using (true) with check (true);
create policy "open history" on exercise_history for all using (true) with check (true);
