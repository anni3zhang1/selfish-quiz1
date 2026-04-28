-- Selfish quiz sessions
-- Run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

create table if not exists quiz_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  topic text,
  answers jsonb,
  name text,
  email text,
  constellation jsonb,
  profile_summary text,
  status text default 'in_progress'
);

create index if not exists quiz_sessions_created_at_idx
  on quiz_sessions (created_at desc);
