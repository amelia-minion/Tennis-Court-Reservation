-- Run in Supabase SQL Editor to add weekly-lesson support to an existing lessons table.
-- Safe to re-run.

alter table public.lessons
  add column if not exists series_id uuid;

create index if not exists lessons_series_id_idx
  on public.lessons (series_id);
