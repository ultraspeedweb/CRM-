
drop function if exists public.bootstrap_organization(text,text,text,text);

create table public.organization_bootstrap_requests (
  user_id uuid primary key references auth.users(id) on delete cascade,
  organization_name text not null check (char_length(trim(organization_name)) between 2 and 120),
  organization_slug text not null unique check (organization_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  member_full_name text not null check (char_length(trim(member_full_name)) between 2 and 160),
  locale text not null default 'tr' check (locale in ('ar','tr','en')),
  created_organization_id uuid unique references public.organizations(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.organization_bootstrap_requests enable row level security;
revoke all on table public.organization_bootstrap_requests from anon;
grant select, insert on table public.organization_bootstrap_requests to authenticated;

create policy organization_bootstrap_requests_select_self
on public.organization_bootstrap_requests for select to authenticated
using (user_id = (select auth.uid()));

create policy organization_bootstrap_requests_insert_self
on public.organization_bootstrap_requests for insert to authenticated
with check (user_id = (select auth.uid()));

create or replace function private.process_organization_bootstrap()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare new_organization_id uuid;
begin
  if new.user_id is distinct from auth.uid() then raise exception 'authentication required' using errcode='42501'; end if;
  new.organization_slug := lower(trim(new.organization_slug));
  new.organization_name := trim(new.organization_name);
  new.member_full_name := trim(new.member_full_name);

  if exists(select 1 from public.organization_members where user_id=new.user_id and status='active') then
    raise exception 'user already belongs to an organization' using errcode='23505';
  end if;

  insert into public.profiles(user_id, full_name, preferred_locale)
  values(new.user_id,new.member_full_name,new.locale)
  on conflict(user_id) do update set full_name=excluded.full_name,preferred_locale=excluded.preferred_locale,updated_at=now();

  insert into public.organizations(name,slug,default_locale)
  values(new.organization_name,new.organization_slug,new.locale)
  returning id into new_organization_id;

  insert into public.organization_members(organization_id,user_id,role,status,preferred_locale)
  values(new_organization_id,new.user_id,'owner','active',new.locale);

  insert into public.audit_logs(organization_id,actor_user_id,action,entity_type,entity_id)
  values(new_organization_id,new.user_id,'organization.created','organization',new_organization_id);

  new.created_organization_id := new_organization_id;
  return new;
end;
$$;
revoke all on function private.process_organization_bootstrap() from public, anon, authenticated;

create trigger organization_bootstrap_before_insert
before insert on public.organization_bootstrap_requests
for each row execute function private.process_organization_bootstrap();

create index organization_bootstrap_created_org_idx on public.organization_bootstrap_requests(created_organization_id);

