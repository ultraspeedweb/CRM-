
do $$
declare
  org_a uuid; org_b uuid; source_a uuid; lead_a uuid; conv_a uuid; rule_a uuid;
  cross_tenant_blocked boolean := false;
begin
  insert into public.organizations(name,slug) values ('SatışDesk Integrity A','satisdesk-integrity-a') returning id into org_a;
  insert into public.organizations(name,slug) values ('SatışDesk Integrity B','satisdesk-integrity-b') returning id into org_b;
  insert into public.lead_sources(organization_id,name,channel) values (org_a,'Website','web') returning id into source_a;
  insert into public.leads(organization_id,source_id,full_name,email,status,score)
    values (org_a,source_a,'Integrity Lead','integrity@example.test','qualified',82) returning id into lead_a;
  insert into public.conversations(organization_id,lead_id,channel,status)
    values (org_a,lead_a,'web','open') returning id into conv_a;
  insert into public.messages(organization_id,conversation_id,direction,sender_type,original_text,original_language,delivery_status)
    values (org_a,conv_a,'inbound','customer','Merhaba','tr','received');
  insert into public.appointments(organization_id,lead_id,conversation_id,title,starts_at,ends_at)
    values (org_a,lead_a,conv_a,'Demo',now()+interval '1 day',now()+interval '1 day 30 minutes');
  insert into public.follow_ups(organization_id,lead_id,conversation_id,due_at,subject)
    values (org_a,lead_a,conv_a,now()+interval '2 hours','Call back');
  insert into public.deals(organization_id,lead_id,title,amount,stage)
    values (org_a,lead_a,'Integrity Opportunity',250000,'proposal');
  insert into public.automation_rules(organization_id,name,trigger_type,actions)
    values (org_a,'New lead follow-up','lead_created','[{"type":"create_follow_up"}]'::jsonb) returning id into rule_a;
  insert into public.automation_runs(organization_id,rule_id,trigger_type,status)
    values (org_a,rule_a,'lead_created','succeeded');

  begin
    insert into public.leads(organization_id,source_id,full_name) values (org_b,source_a,'Cross Tenant Must Fail');
  exception when foreign_key_violation then cross_tenant_blocked := true;
  end;
  if not cross_tenant_blocked then raise exception 'cross-tenant isolation failed'; end if;
  if (select count(*) from public.messages where organization_id=org_a) <> 1 then raise exception 'message flow failed'; end if;
  if (select count(*) from public.appointments where organization_id=org_a) <> 1 then raise exception 'appointment flow failed'; end if;
  if (select count(*) from public.automation_runs where organization_id=org_a) <> 1 then raise exception 'automation flow failed'; end if;

  delete from public.organizations where id in (org_a, org_b);
  if exists(select 1 from public.leads where organization_id in (org_a,org_b)) then raise exception 'cascade cleanup failed'; end if;
end $$;

