create or replace function public.get_owner_marketing_performance(
  p_organization_id uuid,
  p_from date default (current_date - 29),
  p_to date default current_date
)
returns table (
  campaign_id uuid,
  campaign_name text,
  platform text,
  currency text,
  spend numeric,
  impressions bigint,
  reach bigint,
  clicks bigint,
  leads_count bigint,
  qualified_leads_count bigint,
  appointments_count bigint,
  won_deals_count bigint,
  revenue numeric,
  cpl numeric,
  roas numeric
)
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if p_from is null or p_to is null or p_from > p_to then
    raise exception 'invalid_date_range';
  end if;
  if (p_to - p_from) > 366 then
    raise exception 'date_range_too_large';
  end if;
  if not private.has_org_role(p_organization_id, array['owner','admin','manager']) then
    raise exception 'insufficient_role';
  end if;

  return query
  select c.id, c.name, c.platform, m.currency,
         sum(m.spend),
         sum(m.impressions)::bigint,
         sum(m.reach)::bigint,
         sum(m.clicks)::bigint,
         sum(m.leads_count)::bigint,
         sum(m.qualified_leads_count)::bigint,
         sum(m.appointments_count)::bigint,
         sum(m.won_deals_count)::bigint,
         sum(m.revenue),
         case when sum(m.leads_count) > 0 then round(sum(m.spend) / sum(m.leads_count), 2) else null end,
         case when sum(m.spend) > 0 then round(sum(m.revenue) / sum(m.spend), 2) else null end
  from public.marketing_campaigns c
  join public.marketing_daily_metrics m
    on m.organization_id = c.organization_id and m.campaign_id = c.id
  where c.organization_id = p_organization_id
    and m.metric_date between p_from and p_to
  group by c.id, c.name, c.platform, m.currency
  order by sum(m.revenue) desc nulls last, sum(m.spend) desc;
end;
$$;

revoke all on function public.get_owner_marketing_performance(uuid,date,date) from public, anon;
grant execute on function public.get_owner_marketing_performance(uuid,date,date) to authenticated;
