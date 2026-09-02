-- Patient consent and audit hardening. Apply after schema.sql.
create table if not exists public.patient_consents(
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  purpose text not null,
  granted boolean not null default false,
  granted_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  unique(patient_id, purpose)
);

alter table public.patient_consents enable row level security;

create policy "patients manage own consent" on public.patient_consents
for all using (exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()))
with check (exists (select 1 from public.patients p where p.id = patient_id and p.profile_id = auth.uid()));

create policy "authenticated audit insert" on public.audit_logs
for insert with check (actor_id = auth.uid());

create policy "admins read audit" on public.audit_logs
for select using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

revoke update, delete on public.audit_logs from authenticated;
create index if not exists idx_patient_consents_patient on public.patient_consents(patient_id);