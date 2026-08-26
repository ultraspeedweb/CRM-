
create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_locale text not null default 'en' check (preferred_locale in ('ar','tr','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status text not null default 'active' check (status in ('active','suspended','archived')),
  default_locale text not null default 'tr' check (default_locale in ('ar','tr','en')),
  timezone text not null default 'Europe/Istanbul',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'agent' check (role in ('owner','admin','manager','agent','viewer')),
  status text not null default 'active' check (status in ('invited','active','suspended')),
  job_title text,
  preferred_locale text check (preferred_locale in ('ar','tr','en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create index organization_members_user_idx
  on public.organization_members(user_id, status);

create table public.branches (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  code text,
  timezone text not null default 'Europe/Istanbul',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, code)
);

create index branches_organization_idx
  on public.branches(organization_id, is_active);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index audit_logs_org_time_idx
  on public.audit_logs(organization_id, occurred_at desc);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function private.set_updated_at();

create trigger organizations_set_updated_at
before update on public.organizations
for each row execute function private.set_updated_at();

create trigger organization_members_set_updated_at
before update on public.organization_members
for each row execute function private.set_updated_at();

create trigger branches_set_updated_at
before update on public.branches
for each row execute function private.set_updated_at();

create or replace function private.is_org_member(target_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
  );
$$;

create or replace function private.has_org_role(
  target_organization_id uuid,
  allowed_roles text[]
)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.organization_members membership
    where membership.organization_id = target_organization_id
      and membership.user_id = (select auth.uid())
      and membership.status = 'active'
      and membership.role = any(allowed_roles)
  );
$$;

revoke all on function private.set_updated_at() from public;
revoke all on function private.is_org_member(uuid) from public;
revoke all on function private.has_org_role(uuid, text[]) from public;
grant execute on function private.is_org_member(uuid) to authenticated;
grant execute on function private.has_org_role(uuid, text[]) to authenticated;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.branches enable row level security;
alter table public.audit_logs enable row level security;

create policy profiles_select_self
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy profiles_insert_self
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy profiles_update_self
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy organizations_select_member
on public.organizations for select
to authenticated
using (private.is_org_member(id));

create policy organizations_update_admin
on public.organizations for update
to authenticated
using (private.has_org_role(id, array['owner','admin']))
with check (private.has_org_role(id, array['owner','admin']));

create policy organization_members_select_member
on public.organization_members for select
to authenticated
using (private.is_org_member(organization_id));

create policy organization_members_insert_admin
on public.organization_members for insert
to authenticated
with check (
  private.has_org_role(organization_id, array['owner','admin'])
  and (role <> 'owner' or private.has_org_role(organization_id, array['owner']))
);

create policy organization_members_update_admin
on public.organization_members for update
to authenticated
using (
  private.has_org_role(organization_id, array['owner','admin'])
  and (role <> 'owner' or private.has_org_role(organization_id, array['owner']))
)
with check (
  private.has_org_role(organization_id, array['owner','admin'])
  and (role <> 'owner' or private.has_org_role(organization_id, array['owner']))
);

create policy organization_members_delete_admin
on public.organization_members for delete
to authenticated
using (
  private.has_org_role(organization_id, array['owner','admin'])
  and (role <> 'owner' or private.has_org_role(organization_id, array['owner']))
);

create policy branches_select_member
on public.branches for select
to authenticated
using (private.is_org_member(organization_id));

create policy branches_insert_admin
on public.branches for insert
to authenticated
with check (private.has_org_role(organization_id, array['owner','admin']));

create policy branches_update_admin
on public.branches for update
to authenticated
using (private.has_org_role(organization_id, array['owner','admin']))
with check (private.has_org_role(organization_id, array['owner','admin']));

create policy branches_delete_admin
on public.branches for delete
to authenticated
using (private.has_org_role(organization_id, array['owner','admin']));

create policy audit_logs_select_admin
on public.audit_logs for select
to authenticated
using (private.has_org_role(organization_id, array['owner','admin']));

revoke all on table public.profiles from anon;
revoke all on table public.organizations from anon;
revoke all on table public.organization_members from anon;
revoke all on table public.branches from anon;
revoke all on table public.audit_logs from anon;

grant select, insert, update on table public.profiles to authenticated;
grant select, update on table public.organizations to authenticated;
grant select, insert, update, delete on table public.organization_members to authenticated;
grant select, insert, update, delete on table public.branches to authenticated;
grant select on table public.audit_logs to authenticated;

