-- Patient workflow foundations for reminders and notification preferences.
create table if not exists public.notification_preferences(
  user_id uuid primary key references auth.users(id) on delete cascade,
  appointment_reminders boolean not null default true,
  medication_reminders boolean not null default true,
  lab_result_notifications boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.medication_reminders(
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  prescription_id uuid references public.prescriptions(id) on delete set null,
  label text not null,
  instructions text,
  reminder_time time not null,
  timezone text not null default 'Africa/Nairobi',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_medication_reminders_patient on public.medication_reminders(patient_id, active);
alter table public.notification_preferences enable row level security;
alter table public.medication_reminders enable row level security;

create policy "users manage notification preferences" on public.notification_preferences
for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "patients manage medication reminders" on public.medication_reminders
for all using (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()))
with check (patient_id in (select p.id from public.patients p where p.profile_id = auth.uid()));