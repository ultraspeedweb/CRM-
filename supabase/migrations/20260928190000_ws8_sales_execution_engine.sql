-- WS8 Sales Execution Engine
-- Adds explicit next-action discipline, deal ownership/aging, and governed loss taxonomy.

alter table public.deals
  add column if not exists next_action text,
  add column if not exists next_action_at timestamptz,
  add column if not exists stage_entered_at timestamptz not null default now();

alter table public.deals
  drop constraint if exists deals_active_next_action_required;
alter table public.deals
  add constraint deals_active_next_action_required check (
    stage in ('won','lost') or (
      owner_user_id is not null and
      next_action is not null and
      char_length(btrim(next_action)) between 1 and 300 and
      next_action_at is not null
    )
  ) not valid;

create index if not exists deals_org_next_action_idx
  on public.deals(organization_id, next_action_at)
  where stage not in ('won','lost');
create index if not exists deals_org_stage_age_idx
  on public.deals(organization_id, stage, stage_entered_at)
  where stage not in ('won','lost');

create table if not exists public.deal_lost_reasons (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  code text not null check (code ~ '^[a-z0-9_]{2,60}$'),
  label text not null check (char_length(btrim(label)) between 1 and 120),
  is_active boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  unique (organization_id, code)
);

alter table public.deal_lost_reasons enable row level security;

drop policy if exists deal_lost_reasons_tenant_select on public.deal_lost_reasons;
create policy deal_lost_reasons_tenant_select on public.deal_lost_reasons
for select to authenticated
using (private.is_active_org_user(organization_id, auth.uid()));

drop policy if exists deal_lost_reasons_manager_write on public.deal_lost_reasons;
create policy deal_lost_reasons_manager_write on public.deal_lost_reasons
for all to authenticated
using (exists (
  select 1 from public.organization_members m
  where m.organization_id = deal_lost_reasons.organization_id
    and m.user_id = auth.uid() and m.status='active'
    and m.role in ('owner','admin','manager')
))
with check (exists (
  select 1 from public.organization_members m
  where m.organization_id = deal_lost_reasons.organization_id
    and m.user_id = auth.uid() and m.status='active'
    and m.role in ('owner','admin','manager')
));

create or replace function public.ws8_touch_deal_stage()
returns trigger language plpgsql set search_path=pg_catalog,public as $$
begin
  if new.stage is distinct from old.stage then
    new.stage_entered_at := now();
    if new.stage in ('won','lost') then
      new.closed_at := coalesce(new.closed_at, now());
      new.next_action := null;
      new.next_action_at := null;
    else
      new.closed_at := null;
      new.lost_reason := null;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists ws8_deal_stage_touch on public.deals;
create trigger ws8_deal_stage_touch before update of stage on public.deals
for each row execute function public.ws8_touch_deal_stage();

comment on column public.deals.next_action is 'WS8 explicit next sales action for every active opportunity.';
comment on column public.deals.next_action_at is 'WS8 deadline for the next sales action; powers Today/Next/Overdue.';
comment on column public.deals.stage_entered_at is 'Timestamp used to measure stage aging and sales velocity.';
