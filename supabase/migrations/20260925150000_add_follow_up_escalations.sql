begin;

create table public.follow_up_escalations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  follow_up_id uuid not null,
  escalated_to uuid not null,
  reason text not null check (char_length(reason) between 1 and 500),
  status text not null default 'open' check (status in ('open','resolved')),
  escalated_by uuid not null,
  resolved_by uuid,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, follow_up_id) references public.follow_ups(organization_id, id) on delete cascade,
  foreign key (organization_id, escalated_to) references public.organization_members(organization_id, user_id),
  foreign key (organization_id, escalated_by) references public.organization_members(organization_id, user_id),
  foreign key (organization_id, resolved_by) references public.organization_members(organization_id, user_id),
  check ((status = 'open' and resolved_at is null and resolved_by is null) or (status = 'resolved' and resolved_at is not null and resolved_by is not null))
);

create unique index follow_up_escalations_one_open_idx on public.follow_up_escalations(organization_id, follow_up_id) where status = 'open';
create index follow_up_escalations_target_idx on public.follow_up_escalations(organization_id, escalated_to, status, created_at desc);
create index follow_up_escalations_follow_up_idx on public.follow_up_escalations(follow_up_id);

alter table public.follow_up_escalations enable row level security;
revoke all on table public.follow_up_escalations from anon;
grant select, insert, update on table public.follow_up_escalations to authenticated;

create policy follow_up_escalations_member_select on public.follow_up_escalations
for select to authenticated using (private.is_org_member(organization_id));

create policy follow_up_escalations_manager_insert on public.follow_up_escalations
for insert to authenticated with check (
  private.has_org_role(organization_id, array['owner','admin','manager'])
  and escalated_by = auth.uid()
  and private.is_active_org_user(organization_id, escalated_to)
);

create policy follow_up_escalations_manager_update on public.follow_up_escalations
for update to authenticated using (
  private.has_org_role(organization_id, array['owner','admin','manager'])
) with check (
  private.has_org_role(organization_id, array['owner','admin','manager'])
);

commit;
