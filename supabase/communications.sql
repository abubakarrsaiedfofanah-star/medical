create table if not exists public.conversations(
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now()
);

create table if not exists public.conversation_members(
 conversation_id uuid not null references public.conversations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade,
 primary key(conversation_id,user_id)
);

create table if not exists public.messages(
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.conversations(id) on delete cascade,
 sender_id uuid not null references auth.users(id),
 message_type text not null default 'text',
 body text,
 storage_path text,
 duration_seconds integer,
 created_at timestamptz not null default now()
);

create table if not exists public.call_sessions(
 id uuid primary key default gen_random_uuid(),
 conversation_id uuid not null references public.conversations(id) on delete cascade,
 caller_id uuid not null references auth.users(id),
 call_type text not null,
 status text not null default 'ringing',
 started_at timestamptz,
 ended_at timestamptz,
 created_at timestamptz not null default now()
);

create table if not exists public.call_signals(
 id uuid primary key default gen_random_uuid(),
 call_id uuid not null references public.call_sessions(id) on delete cascade,
 sender_id uuid not null references auth.users(id),
 signal_type text not null,
 payload jsonb not null,
 created_at timestamptz not null default now()
);

alter table public.conversations enable row level security;
alter table public.conversation_members enable row level security;
alter table public.messages enable row level security;
alter table public.call_sessions enable row level security;
alter table public.call_signals enable row level security;

-- Production policies must restrict every table to authenticated conversation members.
-- Never create a public read policy for medical communications.
