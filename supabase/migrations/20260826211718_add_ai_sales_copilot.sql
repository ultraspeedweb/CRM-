begin;
create table if not exists public.ai_suggestions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  conversation_id uuid not null,
  lead_id uuid,
  suggestion_type text not null default 'sales_reply' check (suggestion_type in ('sales_reply','summary','next_action','lead_score')),
  detected_language text check (detected_language in ('ar','tr','en','unknown')),
  summary text,
  suggested_reply text,
  next_action text,
  lead_score smallint check (lead_score between 0 and 100),
  status text not null default 'draft' check (status in ('draft','approved','rejected','sent')),
  model text,
  input_fingerprint text,
  created_by uuid,
  approved_by uuid,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete cascade,
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id) on delete set null,
  foreign key (organization_id, approved_by) references public.organization_members(organization_id, user_id) on delete set null
);
create index if not exists ai_suggestions_conversation_idx on public.ai_suggestions(organization_id, conversation_id, created_at desc);
alter table public.ai_suggestions enable row level security;
revoke all on table public.ai_suggestions from anon;
grant select, insert, update on table public.ai_suggestions to authenticated;
create policy ai_suggestions_member_select on public.ai_suggestions for select to authenticated using (private.is_org_member(organization_id));
create policy ai_suggestions_staff_insert on public.ai_suggestions for insert to authenticated with check (private.has_org_role(organization_id, array['owner','admin','manager','agent']));
create policy ai_suggestions_staff_update on public.ai_suggestions for update to authenticated using (private.has_org_role(organization_id, array['owner','admin','manager','agent'])) with check (private.has_org_role(organization_id, array['owner','admin','manager','agent']));
commit;
