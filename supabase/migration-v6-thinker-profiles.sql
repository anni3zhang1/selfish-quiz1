-- v6: thinker profiles cache (per session_id × thinker_slug)
-- Run this in the Supabase SQL editor.

create table if not exists thinker_profiles (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  thinker_slug text not null,
  thinker_name text not null,
  relationship_type text not null,
  profile jsonb not null,
  created_at timestamptz default now(),
  unique (session_id, thinker_slug)
);

create index if not exists thinker_profiles_session_idx
  on thinker_profiles (session_id);
