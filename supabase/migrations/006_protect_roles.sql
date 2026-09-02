-- Prevent users from promoting themselves through profile updates.
create or replace function public.prevent_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.role is distinct from old.role and public.current_role() <> 'admin' then
    raise exception 'role changes must be performed by an administrator';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;
create trigger protect_profile_role
before update on public.profiles
for each row execute function public.prevent_role_escalation();
