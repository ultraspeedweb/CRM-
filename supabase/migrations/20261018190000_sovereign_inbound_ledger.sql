-- Sovereign inbound events: durable replay prevention, no automatic send.
create table if not exists public.sovereign_inbound_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_tenant_id uuid not null,
  external_event_id uuid not null,
  booking_id uuid not null,
  event_type text not null check (event_type in ('booking.confirmed','booking.updated','booking.cancelled','payment.completed','trip.reminder','customer.support_requested')),
  received_at timestamptz not null default now(),
  occurred_at timestamptz not null,
  status text not null default 'received' check (status in ('received','reviewed','rejected')),
  constraint sovereign_inbound_dedupe unique (source_tenant_id, external_event_id)
);
alter table public.sovereign_inbound_events enable row level security;
revoke all on public.sovereign_inbound_events from public, anon, authenticated;
-- Only the server-side service role may persist signed events.
grant select, insert on public.sovereign_inbound_events to service_role;
create index if not exists sovereign_inbound_org_time on public.sovereign_inbound_events (organization_id, received_at desc);
comment on table public.sovereign_inbound_events is 'Validated Sovereign event admission only; no recipient PII and no outbound messaging rights.';
