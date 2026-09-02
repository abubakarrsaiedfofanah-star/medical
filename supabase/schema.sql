create extension if not exists pgcrypto;

create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 full_name text,
 role text not null default 'patient',
 phone text,
 created_at timestamptz not null default now()
);

create table if not exists public.organizations(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 type text not null,
 registration_number text unique,
 verification_status text not null default 'pending',
 latitude double precision,
 longitude double precision,
 created_at timestamptz not null default now()
);

create table if not exists public.patients(
 id uuid primary key default gen_random_uuid(),
 profile_id uuid references public.profiles(id) on delete set null,
 saied_patient_id text unique not null,
 national_or_id_reference text,
 created_at timestamptz not null default now()
);

create table if not exists public.providers(
 id uuid primary key default gen_random_uuid(),
 profile_id uuid references public.profiles(id) on delete set null,
 organization_id uuid references public.organizations(id) on delete set null,
 provider_type text not null,
 license_number text,
 verification_status text not null default 'pending',
 created_at timestamptz not null default now()
);

create table if not exists public.encounters(
 id uuid primary key default gen_random_uuid(),
 patient_id uuid not null references public.patients(id),
 organization_id uuid references public.organizations(id),
 provider_id uuid references public.providers(id),
 encounter_ref text unique not null,
 encounter_mode text not null default 'in_person',
 clinical_summary text,
 created_at timestamptz not null default now()
);

create table if not exists public.appointments(
 id uuid primary key default gen_random_uuid(),
 appointment_ref text unique not null,
 patient_id uuid references public.patients(id),
 provider_id uuid references public.providers(id),
 organization_id uuid references public.organizations(id),
 scheduled_at timestamptz not null,
 status text not null default 'scheduled',
 created_at timestamptz not null default now()
);

create table if not exists public.medicines(
 id uuid primary key default gen_random_uuid(),
 organization_id uuid references public.organizations(id) on delete cascade,
 name text not null,
 strength text,
 dosage_form text,
 quantity integer not null default 0,
 unit_price numeric(12,2) not null default 0,
 active boolean not null default true,
 created_at timestamptz not null default now()
);

create table if not exists public.prescriptions(
 id uuid primary key default gen_random_uuid(),
 prescription_ref text unique not null,
 patient_id uuid references public.patients(id),
 provider_id uuid references public.providers(id),
 organization_id uuid references public.organizations(id),
 status text not null default 'issued',
 created_at timestamptz not null default now()
);

create table if not exists public.payments(
 id uuid primary key default gen_random_uuid(),
 patient_id uuid references public.patients(id),
 organization_id uuid references public.organizations(id),
 payment_ref text unique not null,
 amount numeric(12,2) not null,
 currency text not null,
 status text not null default 'pending',
 provider text,
 created_at timestamptz not null default now()
);

create table if not exists public.receipts(
 id uuid primary key default gen_random_uuid(),
 payment_id uuid references public.payments(id),
 receipt_ref text unique not null,
 verification_token text unique not null,
 created_at timestamptz not null default now()
);

create table if not exists public.lab_orders(
 id uuid primary key default gen_random_uuid(),
 lab_ref text unique not null,
 patient_id uuid references public.patients(id),
 organization_id uuid references public.organizations(id),
 status text not null default 'requested',
 result_summary text,
 created_at timestamptz not null default now()
);

create table if not exists public.home_visits(
 id uuid primary key default gen_random_uuid(),
 home_visit_ref text unique not null,
 patient_id uuid references public.patients(id),
 provider_id uuid references public.providers(id),
 scheduled_at timestamptz not null,
 status text not null default 'requested',
 latitude double precision,
 longitude double precision,
 created_at timestamptz not null default now()
);

create table if not exists public.audit_logs(
 id uuid primary key default gen_random_uuid(),
 actor_id uuid references auth.users(id) on delete set null,
 action text not null,
 entity_type text not null,
 entity_id text not null,
 metadata jsonb not null default '{}',
 created_at timestamptz not null default now()
);

create index if not exists idx_patients_saied on public.patients(saied_patient_id);
create index if not exists idx_encounters_patient on public.encounters(patient_id);
create index if not exists idx_appointments_provider_time on public.appointments(provider_id, scheduled_at);
create index if not exists idx_medicines_org on public.medicines(organization_id);
create index if not exists idx_audit_entity on public.audit_logs(entity_type, entity_id);

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.patients enable row level security;
alter table public.providers enable row level security;
alter table public.encounters enable row level security;
alter table public.appointments enable row level security;
alter table public.medicines enable row level security;
alter table public.prescriptions enable row level security;
alter table public.payments enable row level security;
alter table public.receipts enable row level security;
alter table public.lab_orders enable row level security;
alter table public.home_visits enable row level security;
alter table public.audit_logs enable row level security;

-- SECURITY DESIGN:
-- 1. Never expose service_role keys in the browser.
-- 2. Patient clinical data must be readable only through explicit RLS policies.
-- 3. Providers should only see patients/records authorized for their organization/encounter.
-- 4. Location should be collected only with consent and minimized/retained according to policy.
-- 5. Audit logs should be append-only for normal application users.
-- 6. Prescription dispensing must be verified by an authorized pharmacy workflow.
-- 7. Production policies should be written and tested before using real health information.

create policy "profiles own read" on public.profiles
for select using (auth.uid() = id);

create policy "profiles own update" on public.profiles
for update using (auth.uid() = id);

create policy "patients own read" on public.patients
for select using (profile_id = auth.uid());

-- Do not add broad clinical-data policies here. They must be scoped to
-- provider assignments, organization membership, consent and role.
