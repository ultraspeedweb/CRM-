create or replace function public.get_subscription_entitlements(p_organization_id uuid)
returns table (
  plan_id text,
  subscription_status text,
  billing_cycle text,
  included_users integer,
  features jsonb,
  current_period_end timestamptz,
  trial_ends_at timestamptz,
  is_access_active boolean
)
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if not private.is_org_member(p_organization_id) then
    raise exception 'not_organization_member';
  end if;

  return query
  select s.plan_id,
         s.status,
         s.billing_cycle,
         p.included_users,
         p.features,
         s.current_period_end,
         s.trial_ends_at,
         case
           when s.status='active' then true
           when s.status='trial' and s.trial_ends_at is not null and s.trial_ends_at > now() then true
           else false
         end as is_access_active
  from public.organization_subscriptions s
  join public.billing_plans p on p.id=s.plan_id and p.is_active=true
  where s.organization_id=p_organization_id
  order by s.created_at desc
  limit 1;
end;
$$;

revoke all on function public.get_subscription_entitlements(uuid) from public, anon;
grant execute on function public.get_subscription_entitlements(uuid) to authenticated;
