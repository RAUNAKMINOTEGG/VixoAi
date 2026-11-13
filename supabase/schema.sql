-- Run in Supabase SQL Editor. Enable RLS before using persistent chat history.
create table if not exists public.chat_messages (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  content text not null,
  created_at timestamptz not null default now()
);
create index if not exists chat_messages_user_created_idx on public.chat_messages(user_id, created_at);
alter table public.chat_messages enable row level security;
drop policy if exists "Users read own chat messages" on public.chat_messages;
create policy "Users read own chat messages" on public.chat_messages for select to authenticated using (auth.uid() = user_id);
drop policy if exists "Users insert own chat messages" on public.chat_messages;
create policy "Users insert own chat messages" on public.chat_messages for insert to authenticated with check (auth.uid() = user_id);
