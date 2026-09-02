-- Communications access control. Apply after communications.sql.
create or replace function public.is_conversation_member(target_conversation uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.conversation_members where conversation_id = target_conversation and user_id = auth.uid());
$$;

create policy "members read conversations" on public.conversations for select using (public.is_conversation_member(id));
create policy "members create conversations" on public.conversations for insert with check (auth.uid() is not null);
create policy "members read membership" on public.conversation_members for select using (user_id = auth.uid() or public.is_conversation_member(conversation_id));
create policy "authenticated add membership" on public.conversation_members for insert with check (auth.uid() = user_id or public.is_conversation_member(conversation_id));
create policy "members read messages" on public.messages for select using (public.is_conversation_member(conversation_id));
create policy "members send messages" on public.messages for insert with check (sender_id = auth.uid() and public.is_conversation_member(conversation_id));
create policy "members read calls" on public.call_sessions for select using (public.is_conversation_member(conversation_id));
create policy "members create calls" on public.call_sessions for insert with check (caller_id = auth.uid() and public.is_conversation_member(conversation_id));
create policy "members update calls" on public.call_sessions for update using (public.is_conversation_member(conversation_id));
create policy "members read signals" on public.call_signals for select using (public.is_conversation_member((select conversation_id from public.call_sessions where id = call_id)));
create policy "members send signals" on public.call_signals for insert with check (sender_id = auth.uid() and public.is_conversation_member((select conversation_id from public.call_sessions where id = call_id)));

create index if not exists idx_conversation_members_user on public.conversation_members(user_id);
create index if not exists idx_messages_conversation_time on public.messages(conversation_id, created_at);
