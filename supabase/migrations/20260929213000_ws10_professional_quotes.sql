-- WS10 Professional Quotes
-- Commercial documents linked to deals with explicit tenant isolation and Data API grants.

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  deal_id uuid not null references public.deals(id) on delete cascade,
  quote_number text not null,
  status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired')),
  currency text not null default 'TRY' check (currency in ('TRY','USD','EUR')),
  subtotal numeric(14,2) not null default 0 check (subtotal >= 0),
  discount_amount numeric(14,2) not null default 0 check (discount_amount >= 0),
  tax_amount numeric(14,2) not null default 0 check (tax_amount >= 0),
  total numeric(14,2) not null default 0 check (total >= 0),
  valid_until date,
  notes text check (notes is null or char_length(notes) <= 4000),
  created_by uuid not null references auth.users(id),
  sent_at timestamptz,
  accepted_at timestamptz,
  rejected_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, quote_number),
  unique (organization_id, id)
);

create table public.quote_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  quote_id uuid not null,
  description text not null check (char_length(btrim(description)) between 1 and 500),
  quantity numeric(12,3) not null check (quantity > 0),
  unit_price numeric(14,2) not null check (unit_price >= 0),
  discount_rate numeric(5,2) not null default 0 check (discount_rate between 0 and 100),
  tax_rate numeric(5,2) not null default 0 check (tax_rate between 0 and 100),
  line_subtotal numeric(14,2) generated always as (round(quantity * unit_price, 2)) stored,
  line_discount numeric(14,2) generated always as (round(quantity * unit_price * discount_rate / 100, 2)) stored,
  line_tax numeric(14,2) generated always as (round((quantity * unit_price - quantity * unit_price * discount_rate / 100) * tax_rate / 100, 2)) stored,
  line_total numeric(14,2) generated always as (round((quantity * unit_price - quantity * unit_price * discount_rate / 100) * (1 + tax_rate / 100), 2)) stored,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  constraint quote_items_quote_tenant_fk foreign key (organization_id, quote_id)
    references public.quotes(organization_id, id) on delete cascade
);

create index quotes_org_deal_idx on public.quotes(organization_id, deal_id, created_at desc);
create index quotes_org_status_idx on public.quotes(organization_id, status, created_at desc);
create index quote_items_org_quote_idx on public.quote_items(organization_id, quote_id, sort_order, created_at);

alter table public.quotes enable row level security;
alter table public.quote_items enable row level security;

revoke all on public.quotes, public.quote_items from anon;
grant select, insert, update, delete on public.quotes, public.quote_items to authenticated;

create policy quotes_tenant_select on public.quotes
for select to authenticated
using (auth.uid() is not null and private.is_active_org_user(organization_id, auth.uid()));

create policy quotes_tenant_insert on public.quotes
for insert to authenticated
with check (
  auth.uid() is not null
  and created_by = auth.uid()
  and private.is_active_org_user(organization_id, auth.uid())
  and exists (select 1 from public.deals d where d.id=deal_id and d.organization_id=organization_id)
);

create policy quotes_tenant_update on public.quotes
for update to authenticated
using (auth.uid() is not null and private.is_active_org_user(organization_id, auth.uid()))
with check (
  auth.uid() is not null
  and private.is_active_org_user(organization_id, auth.uid())
  and exists (select 1 from public.deals d where d.id=deal_id and d.organization_id=organization_id)
);

create policy quotes_manager_delete on public.quotes
for delete to authenticated
using (exists (
  select 1 from public.organization_members m
  where m.organization_id=quotes.organization_id and m.user_id=auth.uid()
    and m.status='active' and m.role in ('owner','admin','manager')
));

create policy quote_items_tenant_select on public.quote_items
for select to authenticated
using (auth.uid() is not null and private.is_active_org_user(organization_id, auth.uid()));

create policy quote_items_tenant_insert on public.quote_items
for insert to authenticated
with check (
  auth.uid() is not null
  and private.is_active_org_user(organization_id, auth.uid())
  and exists (select 1 from public.quotes q where q.id=quote_id and q.organization_id=organization_id)
);

create policy quote_items_tenant_update on public.quote_items
for update to authenticated
using (auth.uid() is not null and private.is_active_org_user(organization_id, auth.uid()))
with check (
  auth.uid() is not null
  and private.is_active_org_user(organization_id, auth.uid())
  and exists (select 1 from public.quotes q where q.id=quote_id and q.organization_id=organization_id)
);

create policy quote_items_manager_delete on public.quote_items
for delete to authenticated
using (exists (
  select 1 from public.organization_members m
  where m.organization_id=quote_items.organization_id and m.user_id=auth.uid()
    and m.status='active' and m.role in ('owner','admin','manager')
));

comment on table public.quotes is 'WS10 tenant-scoped commercial quotes linked to CRM deals.';
comment on table public.quote_items is 'WS10 priced quote lines with generated monetary totals.';
