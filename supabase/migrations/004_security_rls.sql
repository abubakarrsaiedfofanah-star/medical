-- Security hardening: organization membership, consent-aware clinical access, and restrictive RLS.
-- Apply only after migrations 001-003.
create table if not exists public.organization_memberships(
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  membership_role text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index if not exists idx_org_memberships_user on public.organization_memberships(user_id);

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organization_memberships m where m.organization_id = target_org and m.user_id = auth.uid() and m.active);
$$;

create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'patient');
$$;

alter table public.organization_memberships enable row level security;

create policy "members can read own memberships" on public.organization_memberships
for select using (user_id = auth.uid());

create policy "admins manage memberships" on public.organization_memberships
for all using (public.current_role() = 'admin')
with check (public.current_role() = 'admin');

create policy "patients manage own consents" on public.patient_consents
for all using (exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()))
with check (exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()));

create policy "providers read assigned encounters" on public.encounters
for select using (
  patient_id in (select p.id from public.patients p where p.profile_id = auth.uid())
  or provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid())
  or (organization_id is not null and public.is_org_member(organization_id))
);

create policy "providers create encounters" on public.encounters
for insert with check (
  provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid())
  and (organization_id is null or public.is_org_member(organization_id))
);

create policy "participants read appointments" on public.appointments
for select using (
  patient_id in (select p.id from public.patients p where p.profile_id = auth.uid())
  or provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid())
  or (organization_id is not null and public.is_org_member(organization_id))
);

create policy "patients create appointments" on public.appointments
for insert with check (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()));

create policy "members read organization medicines" on public.medicines
for select using (public.is_org_member(organization_id));

create policy "members manage organization medicines" on public.medicines
for all using (public.is_org_member(organization_id) and public.current_role() in ('pharmacist','pharmacy','clinic','hospital','admin'))
with check (public.is_org_member(organization_id) and public.current_role() in ('pharmacist','pharmacy','clinic','hospital','admin'));

create policy "participants read prescriptions" on public.prescriptions
for select using (
  patient_id in (select p.id from public.patients p where p.profile_id = auth.uid())
  or provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid())
  or (organization_id is not null and public.is_org_member(organization_id))
);

create policy "providers create prescriptions" on public.prescriptions
for insert with check (
  provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid())
  and (organization_id is null or public.is_org_member(organization_id))
);

create policy "participants read payments" on public.payments
for select using (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()) or (organization_id is not null and public.is_org_member(organization_id)));

create policy "patients create payments" on public.payments
for insert with check (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()));

create policy "participants read lab orders" on public.lab_orders
for select using (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()) or (organization_id is not null and public.is_org_member(organization_id)));

create policy "members create lab results" on public.lab_orders
for update using (organization_id is not null and public.is_org_member(organization_id) and public.current_role() in ('laboratory','admin'))
with check (organization_id is not null and public.is_org_member(organization_id) and public.current_role() in ('laboratory','admin'));

create policy "participants read home visits" on public.home_visits
for select using (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()) or provider_id in (select pr.id from public.providers pr where pr.profile_id = auth.uid()));

create policy "patients create home visits" on public.home_visits
for insert with check (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()));

revoke update, delete on public.audit_logs from authenticated;
