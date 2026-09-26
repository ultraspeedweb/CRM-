begin;

create table if not exists private.platform_service_controls (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  service_key text not null check (service_key in ('core','web_inbox','whatsapp','ai_sales_agent','automations','notifications','shopify','woocommerce')),
  status text not null default 'enabled' check (status in ('enabled','disabled','suspended')),
  reason text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  primary key (organization_id, service_key)
);

revoke all on table private.platform_service_controls from public, anon, authenticated;

create or replace function public.set_platform_service_status(
  p_organization_id uuid,
  p_service_key text,
  p_status text,
  p_reason text
) returns void
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
begin
  if not private.has_platform_role(array['platform_owner','platform_admin']) then
    raise exception 'platform admin authorization required';
  end if;
  if p_service_key not in ('core','web_inbox','whatsapp','ai_sales_agent','automations','notifications','shopify','woocommerce') then
    raise exception 'unsupported service';
  end if;
  if p_status not in ('enabled','disabled','suspended') then
    raise exception 'unsupported service status';
  end if;
  if p_status <> 'enabled' and nullif(btrim(p_reason),'') is null then
    raise exception 'reason required';
  end if;

  insert into private.platform_service_controls(organization_id,service_key,status,reason,updated_by)
  values(p_organization_id,p_service_key,p_status,nullif(btrim(p_reason),''),auth.uid())
  on conflict(organization_id,service_key) do update set
    status=excluded.status, reason=excluded.reason, updated_by=excluded.updated_by, updated_at=now();

  insert into public.audit_logs(organization_id,actor_user_id,action,entity_type,entity_id,metadata)
  values(p_organization_id,auth.uid(),'platform.service.status_changed','organization',p_organization_id,
    jsonb_build_object('service_key',p_service_key,'status',p_status,'reason',nullif(btrim(p_reason),'')));
end;
$$;

revoke all on function public.set_platform_service_status(uuid,text,text,text) from public, anon;
grant execute on function public.set_platform_service_status(uuid,text,text,text) to authenticated;

create or replace function public.get_platform_service_overview()
returns table(organization_id uuid, service_key text, status text, reason text, updated_at timestamptz)
language plpgsql security definer set search_path=public,private,pg_temp
as $$
begin
  if not private.has_platform_role(array['platform_owner','platform_admin','platform_support']) then
    raise exception 'platform authorization required';
  end if;
  return query select c.organization_id,c.service_key,c.status,c.reason,c.updated_at from private.platform_service_controls c order by c.updated_at desc;
end;
$$;
revoke all on function public.get_platform_service_overview() from public,anon;
grant execute on function public.get_platform_service_overview() to authenticated;

comment on table private.platform_service_controls is 'Control-plane service switches. Destructive tenant deletion is intentionally not exposed here.';
commit;
