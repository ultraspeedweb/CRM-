
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles(user_id, full_name, preferred_locale)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    case when new.raw_user_meta_data ->> 'preferred_locale' in ('ar','tr','en')
      then new.raw_user_meta_data ->> 'preferred_locale' else 'tr' end
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function public.bootstrap_organization(
  organization_name text,
  organization_slug text,
  member_full_name text default null,
  locale text default 'tr'
)
returns uuid
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  caller_id uuid := auth.uid();
  new_organization_id uuid;
  normalized_slug text := lower(trim(organization_slug));
  normalized_locale text := case when locale in ('ar','tr','en') then locale else 'tr' end;
begin
  if caller_id is null then raise exception 'authentication required' using errcode = '42501'; end if;
  if char_length(trim(organization_name)) not between 2 and 120 then raise exception 'invalid organization name' using errcode = '22023'; end if;
  if normalized_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' then raise exception 'invalid organization slug' using errcode = '22023'; end if;

  insert into public.profiles(user_id, full_name, preferred_locale)
  values (caller_id, nullif(trim(member_full_name), ''), normalized_locale)
  on conflict (user_id) do update
    set full_name = coalesce(excluded.full_name, public.profiles.full_name),
        preferred_locale = excluded.preferred_locale,
        updated_at = now();

  insert into public.organizations(name, slug, default_locale)
  values (trim(organization_name), normalized_slug, normalized_locale)
  returning id into new_organization_id;

  insert into public.organization_members(organization_id, user_id, role, status, preferred_locale)
  values (new_organization_id, caller_id, 'owner', 'active', normalized_locale);

  insert into public.audit_logs(organization_id, actor_user_id, action, entity_type, entity_id)
  values (new_organization_id, caller_id, 'organization.created', 'organization', new_organization_id);

  return new_organization_id;
end;
$$;
revoke all on function public.bootstrap_organization(text,text,text,text) from public, anon;
grant execute on function public.bootstrap_organization(text,text,text,text) to authenticated;

