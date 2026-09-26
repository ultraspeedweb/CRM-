begin;

create table if not exists private.platform_operators (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('platform_owner','platform_admin','platform_support','platform_billing')),
  status text not null default 'active' check (status in ('active','disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

revoke all on table private.platform_operators from public, anon, authenticated;

create or replace function private.has_platform_role(p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = private, public, pg_temp
as $$
  select exists (
    select 1 from private.platform_operators po
    where po.user_id = auth.uid()
      and po.status = 'active'
      and po.role = any(p_roles)
  );
$$;

revoke all on function private.has_platform_role(text[]) from public, anon, authenticated;

grant execute on function private.has_platform_role(text[]) to authenticated;

create or replace function public.get_platform_company_overview()
returns table (
  organization_id uuid,
  organization_name text,
  created_at timestamptz,
  member_count bigint,
  plan_id text,
  subscription_status text,
  billing_cycle text,
  included_users integer,
  trial_ends_at timestamptz,
  current_period_end timestamptz
)
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
begin
  if not private.has_platform_role(array['platform_owner','platform_admin','platform_support','platform_billing']) then
    raise exception 'platform authorization required';
  end if;

  return query
  select o.id, o.name, o.created_at,
    count(om.user_id) filter (where om.status = 'active') as member_count,
    os.plan_id, os.status, os.billing_cycle, bp.included_users,
    os.trial_ends_at, os.current_period_end
  from public.organizations o
  left join public.organization_members om on om.organization_id = o.id
  left join public.organization_subscriptions os on os.organization_id = o.id
  left join public.billing_plans bp on bp.id = os.plan_id
  group by o.id,o.name,o.created_at,os.plan_id,os.status,os.billing_cycle,bp.included_users,os.trial_ends_at,os.current_period_end
  order by o.created_at desc;
end;
$$;

revoke all on function public.get_platform_company_overview() from public, anon;
grant execute on function public.get_platform_company_overview() to authenticated;

comment on table private.platform_operators is 'SatışDesk control-plane identities. Deliberately separate from tenant organization roles.';
comment on function public.get_platform_company_overview() is 'Metadata-only platform overview. Does not expose tenant conversations, leads, messages, or customer content.';

commit;
