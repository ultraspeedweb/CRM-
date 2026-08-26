begin;

alter table public.conversations
  add column if not exists handling_mode text not null default 'ai',
  add column if not exists handoff_reason text,
  add column if not exists handoff_at timestamptz,
  add column if not exists handoff_by uuid;

alter table public.conversations
  drop constraint if exists conversations_handling_mode_check;
alter table public.conversations
  add constraint conversations_handling_mode_check
  check (handling_mode in ('ai','human','paused'));

create index if not exists conversations_org_handling_idx
  on public.conversations (organization_id, handling_mode, assigned_to, last_message_at desc);

alter table public.messages
  add column if not exists protected_entities jsonb not null default '{}'::jsonb,
  add column if not exists translation_review_required boolean not null default false,
  add column if not exists translation_reviewed_by uuid,
  add column if not exists translation_reviewed_at timestamptz;

create index if not exists messages_org_translation_review_idx
  on public.messages (organization_id, translation_review_required, created_at desc)
  where translation_review_required = true;

-- Lead events are an append-only business history. Keep SELECT + INSERT only for authenticated staff.
drop policy if exists lead_events_staff_update on public.lead_events;
drop policy if exists lead_events_admin_delete on public.lead_events;

-- Automation definitions are configuration, not ordinary agent-owned CRM data.
drop policy if exists automation_rules_staff_insert on public.automation_rules;
drop policy if exists automation_rules_staff_update on public.automation_rules;
create policy automation_rules_manager_insert
  on public.automation_rules for insert to authenticated
  with check (private.has_org_role(organization_id, array['owner','admin','manager']));
create policy automation_rules_manager_update
  on public.automation_rules for update to authenticated
  using (private.has_org_role(organization_id, array['owner','admin','manager']))
  with check (private.has_org_role(organization_id, array['owner','admin','manager']));

-- Execution records should be durable backend/audit state, not editable by staff users.
drop policy if exists automation_runs_staff_insert on public.automation_runs;
drop policy if exists automation_runs_staff_update on public.automation_runs;
drop policy if exists automation_runs_admin_delete on public.automation_runs;

-- Tenant terminology is controlled configuration; agents may read but managers administer it.
drop policy if exists translation_glossary_staff_insert on public.translation_glossary;
drop policy if exists translation_glossary_staff_update on public.translation_glossary;
create policy translation_glossary_manager_insert
  on public.translation_glossary for insert to authenticated
  with check (private.has_org_role(organization_id, array['owner','admin','manager']));
create policy translation_glossary_manager_update
  on public.translation_glossary for update to authenticated
  using (private.has_org_role(organization_id, array['owner','admin','manager']))
  with check (private.has_org_role(organization_id, array['owner','admin','manager']));

commit;
