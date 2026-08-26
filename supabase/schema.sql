-- Iron Log — Supabase schema
-- Run this once in the Supabase SQL editor for a new project.

create table if not exists profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  start_date date not null default current_date,
  paused_ranges jsonb not null default '[]'::jsonb
);

create table if not exists exercise_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  exercise_id text not null,
  date date not null default current_date,
  sets jsonb not null, -- [{weight: number, reps: number}, ...]
  created_at timestamptz default now()
);

create index if not exists exercise_history_user_exercise_idx
  on exercise_history (user_id, exercise_id, date);

alter table profile enable row level security;
alter table exercise_history enable row level security;

create policy "own profile" on profile for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own history" on exercise_history for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
