-- v3: identity + email-results migration
-- Run in the Supabase SQL editor. Idempotent — safe to re-run.

-- Track whether we've sent the result email (prevents duplicate sends).
alter table quiz_sessions
  add column if not exists email_sent boolean default false;

-- Index sessions by email so /profile?email=... is fast.
create index if not exists quiz_sessions_email_idx
  on quiz_sessions (email);

-- Returning users — keyed by email.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text unique not null,
  name text not null
);

create index if not exists users_email_idx on users (email);
