create or replace function private.validate_deal_lifecycle_transition()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  if tg_op = 'INSERT' then
    if new.stage <> 'qualification' then
      raise exception 'new deals must start in qualification' using errcode = '23514';
    end if;
  elsif new.stage is distinct from old.stage then
    if not (
      (old.stage = 'qualification' and new.stage in ('proposal','lost')) or
      (old.stage = 'proposal' and new.stage in ('negotiation','lost')) or
      (old.stage = 'negotiation' and new.stage in ('won','lost'))
    ) then
      raise exception 'invalid deal stage transition: % -> %', old.stage, new.stage using errcode = '23514';
    end if;
  end if;

  if new.stage = 'lost' then
    if char_length(trim(coalesce(new.lost_reason, ''))) < 2 then
      raise exception 'lost_reason is required for lost deals' using errcode = '23514';
    end if;
    new.lost_reason := trim(new.lost_reason);
  else
    new.lost_reason := null;
  end if;

  return new;
end;
$$;
revoke all on function private.validate_deal_lifecycle_transition() from public, anon, authenticated;

drop trigger if exists deals_00_validate_lifecycle on public.deals;
create trigger deals_00_validate_lifecycle
before insert or update of stage, lost_reason
on public.deals
for each row execute function private.validate_deal_lifecycle_transition();

create or replace function private.validate_appointment_lifecycle_transition()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  if tg_op = 'INSERT' then
    if new.status <> 'scheduled' then
      raise exception 'new appointments must start as scheduled' using errcode = '23514';
    end if;
  elsif new.status is distinct from old.status then
    if not (
      (old.status = 'scheduled' and new.status in ('confirmed','cancelled')) or
      (old.status = 'confirmed' and new.status in ('completed','cancelled','no_show'))
    ) then
      raise exception 'invalid appointment status transition: % -> %', old.status, new.status using errcode = '23514';
    end if;
  end if;

  if new.status = 'cancelled' then
    if char_length(trim(coalesce(new.cancellation_reason, ''))) < 2 then
      raise exception 'cancellation_reason is required for cancelled appointments' using errcode = '23514';
    end if;
    new.cancellation_reason := trim(new.cancellation_reason);
  else
    new.cancellation_reason := null;
  end if;

  return new;
end;
$$;
revoke all on function private.validate_appointment_lifecycle_transition() from public, anon, authenticated;

drop trigger if exists appointments_00_validate_lifecycle on public.appointments;
create trigger appointments_00_validate_lifecycle
before insert or update of status, cancellation_reason
on public.appointments
for each row execute function private.validate_appointment_lifecycle_transition();

-- Restore the production RLS auto-enable safety net into source control.
-- Production already has the same function/event trigger; this is idempotent there
-- and makes fresh database replays match the production security posture.
create or replace function public.rls_auto_enable()
returns event_trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  cmd record;
begin
  for cmd in
    select *
    from pg_event_trigger_ddl_commands()
    where command_tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      and object_type in ('table','partitioned table')
  loop
    if cmd.schema_name is not null
       and cmd.schema_name in ('public')
       and cmd.schema_name not in ('pg_catalog','information_schema')
       and cmd.schema_name not like 'pg_toast%'
       and cmd.schema_name not like 'pg_temp%' then
      begin
        execute format('alter table if exists %s enable row level security', cmd.object_identity);
        raise log 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      exception
        when others then
          raise log 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      end;
    else
      raise log 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
    end if;
  end loop;
end;
$$;
revoke all on function public.rls_auto_enable() from public, anon, authenticated;

drop event trigger if exists ensure_rls;
create event trigger ensure_rls
on ddl_command_end
when tag in ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
execute function public.rls_auto_enable();
