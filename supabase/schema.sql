-- Run this in the Supabase SQL Editor for a new project:
-- https://supabase.com/dashboard/project/_/sql

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

create policy "Allow public read"
  on public.reservations
  for select
  using (true);

create policy "Allow public insert"
  on public.reservations
  for insert
  with check (true);
