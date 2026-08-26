
create index appointments_org_assigned_fk_idx on public.appointments(organization_id, assigned_to);
create index appointments_org_conversation_fk_idx on public.appointments(organization_id, conversation_id);
create index appointments_org_created_by_fk_idx on public.appointments(organization_id, created_by);
create index appointments_org_lead_fk_idx on public.appointments(organization_id, lead_id);
create index automation_rules_org_created_by_fk_idx on public.automation_rules(organization_id, created_by);
create index automation_runs_org_rule_fk_idx on public.automation_runs(organization_id, rule_id);
create index conversations_org_assigned_fk_idx on public.conversations(organization_id, assigned_to);
create index conversations_org_lead_fk_idx on public.conversations(organization_id, lead_id);
create index deals_org_lead_fk_idx on public.deals(organization_id, lead_id);
create index deals_org_owner_fk_idx on public.deals(organization_id, owner_user_id);
create index follow_ups_org_assigned_fk_idx on public.follow_ups(organization_id, assigned_to);
create index follow_ups_org_conversation_fk_idx on public.follow_ups(organization_id, conversation_id);
create index follow_ups_org_created_by_fk_idx on public.follow_ups(organization_id, created_by);
create index follow_ups_org_lead_fk_idx on public.follow_ups(organization_id, lead_id);
create index lead_events_org_actor_fk_idx on public.lead_events(organization_id, actor_user_id);
create index lead_qualifications_org_created_by_fk_idx on public.lead_qualifications(organization_id, created_by);
create index leads_org_branch_fk_idx on public.leads(organization_id, branch_id);
create index leads_org_created_by_fk_idx on public.leads(organization_id, created_by);
create index leads_org_source_fk_idx on public.leads(organization_id, source_id);
create index messages_org_conversation_fk_idx on public.messages(organization_id, conversation_id);
create index messages_org_sender_fk_idx on public.messages(organization_id, sender_user_id);
create index notifications_org_user_fk_idx on public.notifications(organization_id, user_id);

