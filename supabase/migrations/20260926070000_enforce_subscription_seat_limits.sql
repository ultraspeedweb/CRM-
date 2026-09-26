begin;

create or replace function private.enforce_subscription_seat_limit()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_limit integer;
  v_active integer;
begin
  if new.status <> 'active' then
    return new;
  end if;

  select p.included_users
    into v_limit
  from public.organization_subscriptions s
  join public.billing_plans p on p.id = s.plan_id and p.is_active = true
  where s.organization_id = new.organization_id
    and (
      s.status = 'active'
      or (s.status = 'trial' and s.trial_ends_at is not null and s.trial_ends_at > now())
    )
  order by s.created_at desc
  limit 1;

  -- Organizations without an activated commercial subscription remain usable for onboarding/pilot setup.
  if v_limit is null then
    return new;
  end if;

  select count(*)::integer
    into v_active
  from public.organization_members m
  where m.organization_id = new.organization_id
    and m.status = 'active'
    and m.user_id <> new.user_id;

  if v_active >= v_limit then
    raise exception using
      errcode = 'P0001',
      message = 'subscription_seat_limit_exceeded';
  end if;

  return new;
end;
$$;

revoke all on function private.enforce_subscription_seat_limit() from public, anon, authenticated;

drop trigger if exists organization_members_subscription_seat_limit on public.organization_members;
create trigger organization_members_subscription_seat_limit
before insert or update of status, organization_id, user_id
on public.organization_members
for each row execute function private.enforce_subscription_seat_limit();

comment on function private.enforce_subscription_seat_limit() is
  'Server-side Commercial V1 seat entitlement guard. Active members cannot exceed the latest active/trial plan included_users limit.';

commit;
