-- Managed commercial activation intake. Requests are NOT subscriptions or payment confirmations.
create table public.commercial_activation_requests (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  requested_by uuid not null references auth.users(id),
  contact_email text not null check (length(contact_email) between 5 and 254),
  desired_plan text not null check (desired_plan in ('starter','growth','business','enterprise','pilot')),
  notes text not null default '' check (length(notes) <= 1000),
  status text not null default 'submitted' check (status in ('submitted','in_review','quoted','closed')),
  created_at timestamptz not null default now()
);
create unique index commercial_activation_one_open_per_org
  on public.commercial_activation_requests(organization_id) where status in ('submitted','in_review','quoted');
create index commercial_activation_org_created on public.commercial_activation_requests(organization_id,created_at desc);
alter table public.commercial_activation_requests enable row level security;
revoke all on public.commercial_activation_requests from anon, public;
grant select, insert on public.commercial_activation_requests to authenticated;
create policy commercial_activation_member_read on public.commercial_activation_requests
  for select to authenticated using (private.is_org_member(organization_id));
create policy commercial_activation_owner_insert on public.commercial_activation_requests
  for insert to authenticated with check (
    requested_by=(select auth.uid())
    and status='submitted'
    and exists (select 1 from public.organization_members m
      where m.organization_id=commercial_activation_requests.organization_id
        and m.user_id=(select auth.uid()) and m.status='active' and m.role in ('owner','admin'))
  );
