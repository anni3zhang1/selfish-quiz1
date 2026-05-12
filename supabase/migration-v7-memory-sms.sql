-- Migration v7: Memory system + SMS infrastructure
-- Adds phone to users, plus user_memory, messages, and content_items tables

-- 1. Add phone number to users
alter table users add column if not exists phone text;

-- 2. User memory — stores the synthesized intellectual fingerprint
create table if not exists user_memory (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  fingerprint jsonb not null default '{}'::jsonb,
  sessions_analyzed int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists user_memory_email_idx on user_memory (email);

-- 3. SMS message history
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  user_email text not null,
  phone text not null,
  direction text not null check (direction in ('inbound', 'outbound')),
  body text not null,
  content_id uuid,
  intensity text check (intensity in ('light', 'medium', 'deep')),
  created_at timestamptz default now()
);

create index if not exists messages_user_email_idx on messages (user_email);
create index if not exists messages_phone_idx on messages (phone);

-- 4. Curated content library
create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  title text not null,
  url text,
  type text not null check (type in ('book', 'essay', 'talk', 'podcast', 'article', 'video')),
  author text,
  framing_notes text,
  created_at timestamptz default now()
);

create index if not exists content_items_topic_idx on content_items (topic);
