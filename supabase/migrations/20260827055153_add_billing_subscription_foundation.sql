create table if not exists public.billing_plans (
  id text primary key,
  name text not null,
  monthly_price_try integer not null check (monthly_price_try >= 0),
  annual_price_try integer not null check (annual_price_try >= 0),
  included_users integer not null check (included_users > 0),
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.billing_plans (id,name,monthly_price_try,annual_price_try,included_users,features)
values
 ('starter','Starter',2990,29900,3,'{"crm":true,"i18n":true,"reports":"basic"}'::jsonb),
 ('growth','Growth',6990,69900,10,'{"crm":true,"i18n":true,"whatsapp":true,"ads_attribution":true,"employee_reports":true,"ai_copilot":true}'::jsonb),
 ('business','Business',12990,129900,25,'{"crm":true,"i18n":true,"whatsapp":true,"ads_attribution":true,"employee_reports":true,"ai_copilot":true,"automation":"advanced","multi_team":true}'::jsonb)
on conflict (id) do update set
 name=excluded.name,
 monthly_price_try=excluded.monthly_price_try,
 annual_price_try=excluded.annual_price_try,
 included_users=excluded.included_users,
 features=excluded.features,
 updated_at=now();

create table if not exists public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  plan_id text not null references public.billing_plans(id),
  status text not null default 'trial' check (status in ('trial','active','past_due','cancelled','suspended')),
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly','annual','pilot')),
  provider text not null default 'manual' check (provider in ('manual','iyzico')),
  provider_subscription_id text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  cancel_at_period_end boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create index if not exists organization_subscriptions_status_idx on public.organization_subscriptions(status);
create unique index if not exists organization_subscriptions_provider_uidx
  on public.organization_subscriptions(provider, provider_subscription_id)
  where provider_subscription_id is not null;

create table if not exists public.billing_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  subscription_id uuid references public.organization_subscriptions(id) on delete set null,
  provider text not null,
  provider_event_id text,
  event_type text not null,
  amount numeric(14,2),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  status text,
  payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create unique index if not exists billing_events_provider_event_uidx
  on public.billing_events(provider, provider_event_id)
  where provider_event_id is not null;
create index if not exists billing_events_org_time_idx on public.billing_events(organization_id, occurred_at desc);

alter table public.billing_plans enable row level security;
alter table public.organization_subscriptions enable row level security;
alter table public.billing_events enable row level security;

revoke all on public.billing_plans from anon, authenticated;
revoke all on public.organization_subscriptions from anon, authenticated;
revoke all on public.billing_events from anon, authenticated;

grant select on public.billing_plans to authenticated;
grant select on public.organization_subscriptions to authenticated;
grant select on public.billing_events to authenticated;

create policy billing_plans_authenticated_select on public.billing_plans
  for select to authenticated using (is_active = true);

create policy organization_subscriptions_member_select on public.organization_subscriptions
  for select to authenticated using (private.is_org_member(organization_id));

create policy billing_events_admin_select on public.billing_events
  for select to authenticated using (private.has_org_role(organization_id, array['owner','admin']::text[]));

comment on table public.organization_subscriptions is 'Server-authoritative SatışDesk subscription state. Browser clients never activate subscriptions.';
comment on table public.billing_events is 'Immutable provider/payment event ledger for billing reconciliation and idempotency.';
