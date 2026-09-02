-- SAIED platform foundation: tenant isolation, clinical workflow records, finance, notifications.
-- Apply after schema.sql and communications.sql. All application writes must use the anon key with RLS.

create table if not exists public.organization_memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  status text not null default 'active' check (status in ('active','suspended','invited')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);
create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, created_at timestamptz not null default now(), unique (organization_id, name)
);
create table if not exists public.patient_provider_relationships (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id) on delete cascade,
  provider_id uuid not null references public.providers(id) on delete cascade, organization_id uuid references public.organizations(id) on delete set null,
  relationship_type text not null default 'care_team', status text not null default 'active', consented_at timestamptz,
  expires_at timestamptz, created_at timestamptz not null default now(), unique(patient_id, provider_id, relationship_type)
);
create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(), patient_id uuid not null references public.patients(id) on delete cascade,
  grantee_id uuid not null references auth.users(id) on delete cascade, scope text not null,
  granted_by uuid not null references auth.users(id), expires_at timestamptz, revoked_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.provider_verification_reviews (
  id uuid primary key default gen_random_uuid(), provider_id uuid not null references public.providers(id) on delete cascade,
  reviewer_id uuid references auth.users(id) on delete set null, status text not null default 'pending', evidence_path text,
  notes text, expires_at timestamptz, reviewed_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.prescription_items (
  id uuid primary key default gen_random_uuid(), prescription_id uuid not null references public.prescriptions(id) on delete cascade,
  medicine_id uuid references public.medicines(id) on delete set null, medicine_name text not null, quantity integer not null check(quantity > 0),
  dosage_instructions text not null, duration_days integer, created_at timestamptz not null default now()
);
create table if not exists public.medicine_batches (
  id uuid primary key default gen_random_uuid(), medicine_id uuid not null references public.medicines(id) on delete cascade,
  batch_number text not null, quantity integer not null default 0 check(quantity >= 0), expires_on date not null, received_at timestamptz not null default now(),
  unique(medicine_id, batch_number)
);
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(), medicine_id uuid not null references public.medicines(id) on delete cascade,
  batch_id uuid references public.medicine_batches(id) on delete set null, quantity_delta integer not null,
  reason text not null, actor_id uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.pharmacy_orders (
  id uuid primary key default gen_random_uuid(), order_ref text unique not null, prescription_id uuid references public.prescriptions(id),
  organization_id uuid not null references public.organizations(id), patient_id uuid references public.patients(id), status text not null default 'processing',
  fulfilment_method text not null default 'pickup', total_amount numeric(12,2) not null default 0, created_at timestamptz not null default now()
);
create table if not exists public.lab_tests (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null, code text, active boolean not null default true, unique(organization_id, name)
);
create table if not exists public.lab_samples (
  id uuid primary key default gen_random_uuid(), lab_order_id uuid not null references public.lab_orders(id) on delete cascade,
  collected_by uuid references auth.users(id), status text not null default 'pending', collected_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.lab_results (
  id uuid primary key default gen_random_uuid(), lab_order_id uuid not null references public.lab_orders(id) on delete cascade,
  test_id uuid references public.lab_tests(id), result_value text, reference_range text, verified_by uuid references auth.users(id), verified_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.home_visit_events (
  id uuid primary key default gen_random_uuid(), home_visit_id uuid not null references public.home_visits(id) on delete cascade,
  actor_id uuid references auth.users(id), event_type text not null, latitude double precision, longitude double precision, created_at timestamptz not null default now()
);
create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade, sms boolean not null default true, email boolean not null default true,
  push boolean not null default true, whatsapp boolean not null default false, updated_at timestamptz not null default now()
);
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), recipient_id uuid not null references auth.users(id) on delete cascade,
  kind text not null, title text not null, body text not null, read_at timestamptz, delivered_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  plan text not null, status text not null default 'trialing', provider text, external_ref text, current_period_end timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.organizations(id) on delete cascade,
  invoice_ref text unique not null, amount numeric(12,2) not null, status text not null default 'open', due_at timestamptz, paid_at timestamptz, created_at timestamptz not null default now()
);

create or replace function public.is_org_member(target_org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.organization_memberships where organization_id = target_org and user_id = auth.uid() and status = 'active');
$$;
create or replace function public.is_provider_for_patient(target_patient uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.patient_provider_relationships r join public.providers p on p.id = r.provider_id where r.patient_id = target_patient and p.profile_id = auth.uid() and r.status = 'active' and (r.expires_at is null or r.expires_at > now()));
$$;

alter table public.organization_memberships enable row level security;
alter table public.departments enable row level security;
alter table public.patient_provider_relationships enable row level security;
alter table public.access_grants enable row level security;
alter table public.provider_verification_reviews enable row level security;
alter table public.prescription_items enable row level security;
alter table public.medicine_batches enable row level security;
alter table public.stock_movements enable row level security;
alter table public.pharmacy_orders enable row level security;
alter table public.lab_tests enable row level security;
alter table public.lab_samples enable row level security;
alter table public.lab_results enable row level security;
alter table public.home_visit_events enable row level security;
alter table public.notification_preferences enable row level security;
alter table public.notifications enable row level security;
alter table public.subscriptions enable row level security;
alter table public.invoices enable row level security;

create policy "members read own organizations" on public.organization_memberships for select using (user_id = auth.uid() or public.is_org_member(organization_id));
create policy "members manage by organization" on public.organization_memberships for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "departments organization members" on public.departments for all using (public.is_org_member(organization_id)) with check (public.is_org_member(organization_id));
create policy "relationships patient or provider" on public.patient_provider_relationships for select using ((exists(select 1 from patients p where p.id=patient_id and p.profile_id=auth.uid())) or exists(select 1 from providers p where p.id=provider_id and p.profile_id=auth.uid()) or public.is_org_member(organization_id));
create policy "grants patient or grantee" on public.access_grants for select using (grantee_id=auth.uid() or exists(select 1 from patients p where p.id=patient_id and p.profile_id=auth.uid()));
create policy "prescription items authorized" on public.prescription_items for select using (exists(select 1 from prescriptions p where p.id=prescription_id and (exists(select 1 from patients pt where pt.id=p.patient_id and pt.profile_id=auth.uid()) or public.is_org_member(p.organization_id))));
create policy "inventory organization members" on public.medicine_batches for all using (exists(select 1 from medicines m where m.id=medicine_id and public.is_org_member(m.organization_id))) with check (exists(select 1 from medicines m where m.id=medicine_id and public.is_org_member(m.organization_id)));
create policy "stock audit organization members" on public.stock_movements for select using (exists(select 1 from medicines m where m.id=medicine_id and public.is_org_member(m.organization_id)));
create policy "orders patient or organization" on public.pharmacy_orders for select using (exists(select 1 from patients p where p.id=patient_id and p.profile_id=auth.uid()) or public.is_org_member(organization_id));
create policy "notifications own" on public.notifications for all using (recipient_id=auth.uid()) with check (recipient_id=auth.uid());
create policy "notification preferences own" on public.notification_preferences for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "subscriptions organization members" on public.subscriptions for select using (public.is_org_member(organization_id));
create policy "invoices organization members" on public.invoices for select using (public.is_org_member(organization_id));

create index if not exists idx_membership_user on public.organization_memberships(user_id);
create index if not exists idx_relationship_patient on public.patient_provider_relationships(patient_id);
create index if not exists idx_batches_expiry on public.medicine_batches(expires_on);
create index if not exists idx_notifications_recipient on public.notifications(recipient_id, created_at desc);
