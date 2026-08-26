
alter table public.conversations drop constraint conversations_organization_id_lead_id_fkey;
alter table public.conversations add constraint conversations_organization_id_lead_id_fkey
  foreign key (organization_id, lead_id)
  references public.leads(organization_id, id)
  on delete set null (lead_id);

alter table public.appointments drop constraint appointments_organization_id_conversation_id_fkey;
alter table public.appointments add constraint appointments_organization_id_conversation_id_fkey
  foreign key (organization_id, conversation_id)
  references public.conversations(organization_id, id)
  on delete set null (conversation_id);

alter table public.follow_ups drop constraint follow_ups_organization_id_conversation_id_fkey;
alter table public.follow_ups add constraint follow_ups_organization_id_conversation_id_fkey
  foreign key (organization_id, conversation_id)
  references public.conversations(organization_id, id)
  on delete set null (conversation_id);

alter table public.automation_runs drop constraint automation_runs_organization_id_rule_id_fkey;
alter table public.automation_runs add constraint automation_runs_organization_id_rule_id_fkey
  foreign key (organization_id, rule_id)
  references public.automation_rules(organization_id, id)
  on delete cascade;

