begin;

-- Read controls without exposing the private schema to the Data API.
create or replace function private.is_service_enabled(p_organization_id uuid, p_service_key text)
returns boolean language sql stable security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
  select p_service_key in ('core','web_inbox','whatsapp','ai_sales_agent','automations','notifications','shopify','woocommerce')
    and exists(select 1 from public.organizations where id=p_organization_id)
    and not exists(select 1 from private.platform_service_controls
      where organization_id=p_organization_id and service_key='core' and status<>'enabled')
    and coalesce((select status='enabled' from private.platform_service_controls
      where organization_id=p_organization_id and service_key=p_service_key),
      p_service_key in ('core','web_inbox','automations','notifications'));
$$;
revoke all on function private.is_service_enabled(uuid,text) from public,anon,authenticated;

create or replace function public.is_platform_service_enabled(p_organization_id uuid, p_service_key text)
returns boolean language sql stable security definer
set search_path = pg_catalog, private, pg_temp
as $$ select private.is_service_enabled(p_organization_id,p_service_key); $$;
revoke all on function public.is_platform_service_enabled(uuid,text) from public,anon,authenticated;
grant execute on function public.is_platform_service_enabled(uuid,text) to service_role;

-- Deployment credential routing is trusted operator provisioning, never tenant input.
drop policy if exists whatsapp_connections_admin_write on public.whatsapp_connections;
revoke insert,update,delete on public.whatsapp_connections from authenticated;

alter table public.conversations alter column handling_mode set default 'human';
create or replace function private.guard_conversation_ai_transition()
returns trigger language plpgsql security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if new.handling_mode='ai' and (tg_op='INSERT' or old.handling_mode is distinct from new.handling_mode
      or old.organization_id is distinct from new.organization_id) then
    if not private.has_org_role(new.organization_id,array['owner','admin','manager']) then
      raise exception 'AI resumption requires manager authority' using errcode='42501';
    end if;
    if not private.is_service_enabled(new.organization_id,'ai_sales_agent') then
      raise exception 'AI service is not enabled' using errcode='42501';
    end if;
  end if;
  return new;
end;
$$;
revoke all on function private.guard_conversation_ai_transition() from public,anon,authenticated;
create trigger conversations_guard_ai_transition before insert or update on public.conversations
for each row execute function private.guard_conversation_ai_transition();

-- No delivery claim or broken message write until the AI outbox is certified.
create or replace function public.execute_approved_ai_suggestion(p_organization_id uuid,p_suggestion_id uuid)
returns uuid language plpgsql security definer
set search_path = pg_catalog, public, private, pg_temp
as $$
begin
  if not private.has_org_role(p_organization_id,array['owner','admin','manager']) then
    raise exception 'insufficient role' using errcode='42501';
  end if;
  raise exception 'AI execution is not certified' using errcode='55000';
end;
$$;
revoke all on function public.execute_approved_ai_suggestion(uuid,uuid) from public,anon;
grant execute on function public.execute_approved_ai_suggestion(uuid,uuid) to authenticated;

comment on function public.is_platform_service_enabled(uuid,text) is 'Service-role-only switch lookup. External integrations default off; private schema remains unexposed.';
comment on function public.execute_approved_ai_suggestion(uuid,uuid) is 'Disabled pending certified outbox execution and delivery evidence. Never marks a queued proposal as sent.';
commit;
