
create index if not exists audit_logs_actor_user_idx on public.audit_logs(actor_user_id);
create unique index if not exists branches_org_id_id_uq on public.branches(organization_id, id);

create or replace function private.is_active_org_user(target_organization_id uuid, target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select target_user_id is null or exists (
    select 1 from public.organization_members m
    where m.organization_id = target_organization_id
      and m.user_id = target_user_id
      and m.status = 'active'
  );
$$;
revoke all on function private.is_active_org_user(uuid, uuid) from public, anon;
grant execute on function private.is_active_org_user(uuid, uuid) to authenticated;

create table public.lead_sources (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  channel text not null check (channel in ('whatsapp','web','instagram','facebook','email','sms','referral','manual','other')),
  external_account_id text,
  is_active boolean not null default true,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, name)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  branch_id uuid,
  source_id uuid,
  assigned_to uuid,
  status text not null default 'new' check (status in ('new','contacted','qualified','appointment','negotiation','won','lost','disqualified')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  score smallint not null default 0 check (score between 0 and 100),
  full_name text not null check (char_length(full_name) between 1 and 160),
  email text,
  phone text,
  whatsapp_phone text,
  preferred_language text not null default 'tr' check (preferred_language in ('ar','tr','en','unknown')),
  detected_language text check (detected_language in ('ar','tr','en','unknown')),
  country text,
  city text,
  budget_min numeric(14,2) check (budget_min is null or budget_min >= 0),
  budget_max numeric(14,2) check (budget_max is null or budget_max >= 0),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  intent text,
  timeline text,
  source_channel text check (source_channel in ('whatsapp','web','instagram','facebook','email','sms','referral','manual','other')),
  campaign_name text,
  ad_name text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  external_ref text,
  attribution jsonb not null default '{}'::jsonb,
  consent_status text not null default 'unknown' check (consent_status in ('unknown','granted','denied','withdrawn')),
  consent_at timestamptz,
  last_contact_at timestamptz,
  qualified_at timestamptz,
  won_at timestamptz,
  lost_reason text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  constraint leads_branch_fk foreign key (organization_id, branch_id) references public.branches(organization_id, id),
  constraint leads_source_fk foreign key (organization_id, source_id) references public.lead_sources(organization_id, id),
  constraint leads_assigned_fk foreign key (organization_id, assigned_to) references public.organization_members(organization_id, user_id),
  constraint leads_created_by_fk foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id),
  constraint leads_budget_range check (budget_max is null or budget_min is null or budget_max >= budget_min)
);
create unique index leads_org_external_ref_uq on public.leads(organization_id, external_ref) where external_ref is not null;
create index leads_org_status_idx on public.leads(organization_id, status, updated_at desc);
create index leads_org_assignee_idx on public.leads(organization_id, assigned_to, status);
create index leads_branch_idx on public.leads(branch_id);
create index leads_source_idx on public.leads(source_id);
create index leads_created_by_idx on public.leads(created_by);

create table public.lead_qualifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lead_id uuid not null,
  version integer not null default 1 check (version > 0),
  budget_fit text check (budget_fit in ('unknown','low','fit','high')),
  need_summary text,
  purpose text,
  preferred_area text,
  property_type text,
  timeline text,
  decision_role text,
  confidence numeric(4,3) check (confidence between 0 and 1),
  missing_fields text[] not null default '{}',
  answers jsonb not null default '{}'::jsonb,
  qualified_by text not null default 'manual' check (qualified_by in ('manual','automation','ai')),
  created_by uuid,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, lead_id, version),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id)
);
create index lead_qualifications_lead_idx on public.lead_qualifications(lead_id);
create index lead_qualifications_created_by_idx on public.lead_qualifications(created_by);

create table public.lead_events (
  id bigint generated always as identity primary key,
  organization_id uuid not null,
  lead_id uuid not null,
  event_type text not null check (event_type in ('created','status_changed','assigned','score_changed','qualified','contacted','note','won','lost','consent_changed')),
  actor_user_id uuid,
  from_value text,
  to_value text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now(),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, actor_user_id) references public.organization_members(organization_id, user_id)
);
create index lead_events_org_lead_time_idx on public.lead_events(organization_id, lead_id, occurred_at desc);
create index lead_events_actor_idx on public.lead_events(actor_user_id);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  lead_id uuid,
  assigned_to uuid,
  channel text not null check (channel in ('whatsapp','web','instagram','facebook','email','sms','manual')),
  external_thread_id text,
  status text not null default 'open' check (status in ('open','pending','closed','spam')),
  customer_language text check (customer_language in ('ar','tr','en','unknown')),
  agent_language text check (agent_language in ('ar','tr','en')),
  summary text,
  unread_count integer not null default 0 check (unread_count >= 0),
  last_message_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete set null,
  foreign key (organization_id, assigned_to) references public.organization_members(organization_id, user_id)
);
create unique index conversations_org_external_uq on public.conversations(organization_id, channel, external_thread_id) where external_thread_id is not null;
create index conversations_org_status_idx on public.conversations(organization_id, status, last_message_at desc);
create index conversations_lead_idx on public.conversations(lead_id);
create index conversations_assigned_idx on public.conversations(assigned_to);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  conversation_id uuid not null,
  direction text not null check (direction in ('inbound','outbound','internal')),
  sender_type text not null check (sender_type in ('customer','agent','automation','system')),
  sender_user_id uuid,
  external_message_id text,
  original_text text,
  original_language text check (original_language in ('ar','tr','en','unknown')),
  translated_text text,
  translated_language text check (translated_language in ('ar','tr','en')),
  translation_status text not null default 'not_needed' check (translation_status in ('not_needed','pending','translated','failed','reviewed')),
  translation_provider text,
  translation_confidence numeric(4,3) check (translation_confidence between 0 and 1),
  message_type text not null default 'text' check (message_type in ('text','image','audio','video','document','location','template','system')),
  media_url text,
  delivery_status text not null default 'queued' check (delivery_status in ('queued','sent','delivered','read','failed','received')),
  failure_reason text,
  raw_payload jsonb not null default '{}'::jsonb,
  sent_at timestamptz,
  delivered_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete cascade,
  foreign key (organization_id, sender_user_id) references public.organization_members(organization_id, user_id)
);
create unique index messages_org_external_uq on public.messages(organization_id, external_message_id) where external_message_id is not null;
create index messages_conversation_time_idx on public.messages(conversation_id, created_at desc);
create index messages_sender_user_idx on public.messages(sender_user_id);
create index messages_org_delivery_idx on public.messages(organization_id, delivery_status) where delivery_status in ('queued','failed');

create table public.translation_glossary (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_language text not null check (source_language in ('ar','tr','en')),
  target_language text not null check (target_language in ('ar','tr','en')),
  source_term text not null,
  target_term text not null,
  notes text,
  is_protected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  unique (organization_id, source_language, target_language, source_term),
  check (source_language <> target_language)
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lead_id uuid not null,
  conversation_id uuid,
  assigned_to uuid,
  title text not null check (char_length(title) between 1 and 200),
  status text not null default 'scheduled' check (status in ('scheduled','confirmed','completed','cancelled','no_show')),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Europe/Istanbul',
  location text,
  meeting_url text,
  notes text,
  cancellation_reason text,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete set null,
  foreign key (organization_id, assigned_to) references public.organization_members(organization_id, user_id),
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id),
  check (ends_at > starts_at)
);
create index appointments_org_start_idx on public.appointments(organization_id, starts_at);
create index appointments_lead_idx on public.appointments(lead_id);
create index appointments_conversation_idx on public.appointments(conversation_id);
create index appointments_assigned_idx on public.appointments(assigned_to);
create index appointments_created_by_idx on public.appointments(created_by);

create table public.follow_ups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lead_id uuid not null,
  conversation_id uuid,
  assigned_to uuid,
  follow_up_type text not null default 'task' check (follow_up_type in ('call','message','email','task','appointment_reminder')),
  status text not null default 'pending' check (status in ('pending','in_progress','completed','cancelled','failed')),
  due_at timestamptz not null,
  completed_at timestamptz,
  attempt_count integer not null default 0 check (attempt_count >= 0),
  subject text,
  instructions text,
  payload jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, conversation_id) references public.conversations(organization_id, id) on delete set null,
  foreign key (organization_id, assigned_to) references public.organization_members(organization_id, user_id),
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id)
);
create index follow_ups_org_due_idx on public.follow_ups(organization_id, status, due_at);
create index follow_ups_lead_idx on public.follow_ups(lead_id);
create index follow_ups_conversation_idx on public.follow_ups(conversation_id);
create index follow_ups_assigned_idx on public.follow_ups(assigned_to);
create index follow_ups_created_by_idx on public.follow_ups(created_by);

create table public.deals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  lead_id uuid not null,
  owner_user_id uuid,
  title text not null check (char_length(title) between 1 and 200),
  stage text not null default 'qualification' check (stage in ('qualification','proposal','negotiation','won','lost')),
  amount numeric(14,2) check (amount is null or amount >= 0),
  currency text not null default 'TRY' check (currency ~ '^[A-Z]{3}$'),
  probability smallint not null default 10 check (probability between 0 and 100),
  expected_close_date date,
  closed_at timestamptz,
  lost_reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, lead_id) references public.leads(organization_id, id) on delete cascade,
  foreign key (organization_id, owner_user_id) references public.organization_members(organization_id, user_id)
);
create index deals_org_stage_idx on public.deals(organization_id, stage, expected_close_date);
create index deals_lead_idx on public.deals(lead_id);
create index deals_owner_idx on public.deals(owner_user_id);

create table public.automation_rules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  trigger_type text not null check (trigger_type in ('lead_created','lead_status_changed','message_received','appointment_due','follow_up_due','manual')),
  conditions jsonb not null default '{}'::jsonb,
  actions jsonb not null default '[]'::jsonb check (jsonb_typeof(actions) = 'array'),
  is_active boolean not null default true,
  created_by uuid,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, created_by) references public.organization_members(organization_id, user_id)
);
create index automation_rules_org_trigger_idx on public.automation_rules(organization_id, trigger_type) where is_active;
create index automation_rules_created_by_idx on public.automation_rules(created_by);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  rule_id uuid,
  trigger_type text not null,
  status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')),
  entity_type text,
  entity_id uuid,
  input jsonb not null default '{}'::jsonb,
  output jsonb not null default '{}'::jsonb,
  error_message text,
  idempotency_key text,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz not null default now(),
  unique (organization_id, id),
  foreign key (organization_id, rule_id) references public.automation_rules(organization_id, id) on delete set null
);
create unique index automation_runs_org_idempotency_uq on public.automation_runs(organization_id, idempotency_key) where idempotency_key is not null;
create index automation_runs_org_status_idx on public.automation_runs(organization_id, status, created_at);
create index automation_runs_rule_idx on public.automation_runs(rule_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null,
  user_id uuid not null,
  notification_type text not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  is_read boolean not null default false,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  foreign key (organization_id, user_id) references public.organization_members(organization_id, user_id) on delete cascade
);
create index notifications_user_unread_idx on public.notifications(user_id, is_read, created_at desc);
create index notifications_org_idx on public.notifications(organization_id);

do $$
declare t text;
begin
  foreach t in array array[
    'lead_sources','leads','lead_qualifications','lead_events','conversations','messages',
    'translation_glossary','appointments','follow_ups','deals','automation_rules','automation_runs','notifications'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('revoke all on table public.%I from anon', t);
    execute format('grant select, insert, update, delete on table public.%I to authenticated', t);
    execute format(
      'create policy %I on public.%I for select to authenticated using (private.is_org_member(organization_id))',
      t || '_member_select', t
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check (private.has_org_role(organization_id, ARRAY[''owner'',''admin'',''manager'',''agent'']))',
      t || '_staff_insert', t
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using (private.has_org_role(organization_id, ARRAY[''owner'',''admin'',''manager'',''agent''])) with check (private.has_org_role(organization_id, ARRAY[''owner'',''admin'',''manager'',''agent'']))',
      t || '_staff_update', t
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using (private.has_org_role(organization_id, ARRAY[''owner'',''admin'']))',
      t || '_admin_delete', t
    );
  end loop;
end $$;

drop policy notifications_member_select on public.notifications;
create policy notifications_own_select on public.notifications
for select to authenticated
using (user_id = (select auth.uid()) or private.has_org_role(organization_id, array['owner','admin']));

drop policy notifications_staff_update on public.notifications;
create policy notifications_own_update on public.notifications
for update to authenticated
using (user_id = (select auth.uid()) or private.has_org_role(organization_id, array['owner','admin']))
with check (user_id = (select auth.uid()) or private.has_org_role(organization_id, array['owner','admin']));

do $$
declare t text;
begin
  foreach t in array array[
    'lead_sources','leads','conversations','translation_glossary','appointments',
    'follow_ups','deals','automation_rules'
  ] loop
    execute format('create trigger %I before update on public.%I for each row execute function private.set_updated_at()', t || '_set_updated_at', t);
  end loop;
end $$;

revoke all on sequence public.lead_events_id_seq from anon;
grant usage, select on sequence public.lead_events_id_seq to authenticated;

