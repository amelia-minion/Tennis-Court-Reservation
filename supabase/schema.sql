-- Run this in the Supabase SQL Editor for a new project:
-- https://supabase.com/dashboard/project/_/sql
-- Safe to re-run: policies are dropped and recreated if they already exist.

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_code text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  court text not null,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  duration_hours numeric(3, 1) not null,
  total_price numeric not null,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

create index if not exists reservations_court_date_idx
  on public.reservations (court, reservation_date);

create index if not exists reservations_code_idx
  on public.reservations (reservation_code);

alter table public.reservations enable row level security;

drop policy if exists "Allow public read" on public.reservations;
create policy "Allow public read"
  on public.reservations
  for select
  using (true);

drop policy if exists "Allow public insert" on public.reservations;
create policy "Allow public insert"
  on public.reservations
  for insert
  with check (true);

-- Lessons scheduled by head coach

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
