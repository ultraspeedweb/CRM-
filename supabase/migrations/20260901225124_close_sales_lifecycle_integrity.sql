create or replace function private.sync_deal_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if new.stage in ('won', 'lost') then
    new.closed_at := coalesce(new.closed_at, now());
  else
    new.closed_at := null;
  end if;

  if new.stage = 'won' then
    new.probability := 100;
    update public.leads
      set status = 'won',
          won_at = coalesce(won_at, now()),
          updated_at = now()
      where organization_id = new.organization_id
        and id = new.lead_id
        and status <> 'won';
  elsif new.stage = 'lost' then
    new.probability := 0;
  elsif new.stage = 'negotiation' then
    update public.leads
      set status = 'negotiation', updated_at = now()
      where organization_id = new.organization_id
        and id = new.lead_id
        and status not in ('won', 'lost', 'disqualified');
  elsif new.stage in ('qualification', 'proposal') then
    update public.leads
      set status = 'qualified',
          qualified_at = coalesce(qualified_at, now()),
          updated_at = now()
      where organization_id = new.organization_id
        and id = new.lead_id
        and status in ('new', 'contacted', 'qualified');
  end if;

  return new;
end;
$$;
revoke all on function private.sync_deal_lifecycle() from public, anon, authenticated;

drop trigger if exists deals_sync_lifecycle on public.deals;
create trigger deals_sync_lifecycle
before insert or update of stage, lead_id, organization_id
on public.deals
for each row execute function private.sync_deal_lifecycle();

create or replace function private.sync_appointment_lifecycle()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if new.status in ('scheduled', 'confirmed', 'completed') then
    update public.leads
      set status = 'appointment', updated_at = now()
      where organization_id = new.organization_id
        and id = new.lead_id
        and status not in ('negotiation', 'won', 'lost', 'disqualified');
  end if;
  return new;
end;
$$;
revoke all on function private.sync_appointment_lifecycle() from public, anon, authenticated;

drop trigger if exists appointments_sync_lifecycle on public.appointments;
create trigger appointments_sync_lifecycle
after insert or update of status, lead_id, organization_id
on public.appointments
for each row execute function private.sync_appointment_lifecycle();

create or replace function private.set_lead_actor_defaults()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private, auth
as $$
declare actor uuid := auth.uid();
begin
  if actor is not null then
    new.created_by := coalesce(new.created_by, actor);
    new.assigned_to := coalesce(new.assigned_to, actor);
  end if;
  return new;
end;
$$;
revoke all on function private.set_lead_actor_defaults() from public, anon, authenticated;
drop trigger if exists leads_actor_defaults on public.leads;
create trigger leads_actor_defaults before insert on public.leads for each row execute function private.set_lead_actor_defaults();

create or replace function private.set_follow_up_actor_defaults()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private, auth
as $$
declare actor uuid := auth.uid();
begin
  if actor is not null then
    new.created_by := coalesce(new.created_by, actor);
    new.assigned_to := coalesce(new.assigned_to, actor);
  end if;
  return new;
end;
$$;
revoke all on function private.set_follow_up_actor_defaults() from public, anon, authenticated;
drop trigger if exists follow_ups_actor_defaults on public.follow_ups;
create trigger follow_ups_actor_defaults before insert on public.follow_ups for each row execute function private.set_follow_up_actor_defaults();

create or replace function private.set_appointment_actor_defaults()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private, auth
as $$
declare actor uuid := auth.uid();
begin
  if actor is not null then
    new.created_by := coalesce(new.created_by, actor);
    new.assigned_to := coalesce(new.assigned_to, actor);
  end if;
  return new;
end;
$$;
revoke all on function private.set_appointment_actor_defaults() from public, anon, authenticated;
drop trigger if exists appointments_actor_defaults on public.appointments;
create trigger appointments_actor_defaults before insert on public.appointments for each row execute function private.set_appointment_actor_defaults();

create or replace function private.set_deal_actor_defaults()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public, private, auth
as $$
declare actor uuid := auth.uid();
begin
  if actor is not null then
    new.owner_user_id := coalesce(new.owner_user_id, actor);
  end if;
  return new;
end;
$$;
revoke all on function private.set_deal_actor_defaults() from public, anon, authenticated;
drop trigger if exists deals_actor_defaults on public.deals;
create trigger deals_actor_defaults before insert on public.deals for each row execute function private.set_deal_actor_defaults();
