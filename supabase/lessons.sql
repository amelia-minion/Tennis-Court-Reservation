-- Run in Supabase SQL Editor if the lessons table is missing.
-- Safe to re-run on an existing database.

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  court text not null,
  lesson_date date not null,
  start_time time not null,
  end_time time not null,
  notes text,
  series_id uuid,
  created_at timestamptz not null default now()
);

alter table public.lessons
  add column if not exists series_id uuid;

create index if not exists lessons_date_idx
  on public.lessons (lesson_date);

create index if not exists lessons_series_id_idx
  on public.lessons (series_id);

alter table public.lessons enable row level security;

drop policy if exists "Allow public read on lessons" on public.lessons;
create policy "Allow public read on lessons"
  on public.lessons
  for select
  using (true);

drop policy if exists "Allow public insert on lessons" on public.lessons;
create policy "Allow public insert on lessons"
  on public.lessons
  for insert
  with check (true);

drop policy if exists "Allow public delete on lessons" on public.lessons;
create policy "Allow public delete on lessons"
  on public.lessons
  for delete
  using (true);
