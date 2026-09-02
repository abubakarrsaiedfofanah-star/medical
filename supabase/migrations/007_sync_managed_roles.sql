-- Keep the client-visible authorization role aligned with the protected profile role.
create or replace function public.sync_profile_role_to_app_metadata()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  update auth.users
  set raw_app_meta_data = jsonb_set(
    coalesce(raw_app_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(new.role),
    true
  )
  where id = new.id;
  return new;
end;
$$;

drop trigger if exists sync_managed_profile_role on public.profiles;
create trigger sync_managed_profile_role
after insert or update of role on public.profiles
for each row execute function public.sync_profile_role_to_app_metadata();

update auth.users u
set raw_app_meta_data = jsonb_set(
  coalesce(u.raw_app_meta_data, '{}'::jsonb),
  '{role}',
  to_jsonb(p.role),
  true
)
from public.profiles p
where p.id = u.id;
