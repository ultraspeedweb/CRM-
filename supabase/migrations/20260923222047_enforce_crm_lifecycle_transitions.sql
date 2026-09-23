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
