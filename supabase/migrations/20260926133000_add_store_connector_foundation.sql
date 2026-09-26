begin;

create table public.store_connections (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  provider text not null check (provider in ('shopify','woocommerce')),
  external_store_id text not null,
  store_domain text not null,
  display_name text,
  status text not null default 'pending' check (status in ('pending','active','paused','error','disconnected')),
  credential_env_key text,
  webhook_secret_env_key text,
  last_ingested_at timestamptz,
  last_error_code text,
  last_error_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, provider, external_store_id),
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id)
);
create index store_connections_org_status_idx on public.store_connections(organization_id,status,updated_at desc);

create table public.store_ingestion_events (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  connection_id uuid not null,
  provider text not null check (provider in ('shopify','woocommerce')),
  external_event_id text not null,
  event_type text not null,
  external_customer_id text,
  external_order_id text,
  payload jsonb not null default '{}'::jsonb,
  normalized_payload jsonb not null default '{}'::jsonb,
  processing_status text not null default 'received' check (processing_status in ('received','processed','ignored','failed')),
  failure_code text,
  received_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (organization_id, id),
  unique (organization_id, provider, external_event_id),
  foreign key (organization_id, connection_id) references public.store_connections(organization_id,id) on delete cascade
);
create index store_ingestion_events_org_status_idx on public.store_ingestion_events(organization_id,processing_status,received_at desc);
create index store_ingestion_events_connection_idx on public.store_ingestion_events(organization_id,connection_id,received_at desc);

alter table public.store_connections enable row level security;
alter table public.store_ingestion_events enable row level security;

create policy store_connections_select on public.store_connections for select to authenticated using (private.is_active_org_user(organization_id, auth.uid()));
create policy store_connections_insert on public.store_connections for insert to authenticated with check (private.is_active_org_user(organization_id, auth.uid()) and private.has_org_role(organization_id, array['owner','admin']));
create policy store_connections_update on public.store_connections for update to authenticated using (private.is_active_org_user(organization_id, auth.uid()) and private.has_org_role(organization_id, array['owner','admin'])) with check (private.is_active_org_user(organization_id, auth.uid()) and private.has_org_role(organization_id, array['owner','admin']));
create policy store_connections_delete on public.store_connections for delete to authenticated using (private.is_active_org_user(organization_id, auth.uid()) and private.has_org_role(organization_id, array['owner','admin']));

create policy store_ingestion_events_select on public.store_ingestion_events for select to authenticated using (private.is_active_org_user(organization_id, auth.uid()));

revoke insert, update, delete on public.store_ingestion_events from authenticated;

comment on column public.store_connections.credential_env_key is 'Environment-variable key only; connector secrets must never be stored in the database.';
comment on column public.store_connections.webhook_secret_env_key is 'Environment-variable key only; webhook secrets must never be stored in the database.';
comment on table public.store_ingestion_events is 'Tenant-scoped immutable ingestion ledger. Provider webhook handlers write with the server-side service role after signature verification.';

commit;
