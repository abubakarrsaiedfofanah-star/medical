alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check
check (role in ('patient','doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory','admin'));

alter table public.organization_memberships
drop constraint if exists organization_memberships_role_check;

alter table public.organization_memberships
add constraint organization_memberships_role_check
check (role in ('doctor','nurse','pharmacist','pharmacy','clinic','hospital','laboratory','admin'));
