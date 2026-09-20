create or replace function public.get_owner_employee_performance(
  p_organization_id uuid,
  p_from date default (current_date - 29),
  p_to date default current_date
)
returns table (
  user_id uuid,
  full_name text,
  role text,
  leads_assigned bigint,
  leads_qualified bigint,
  leads_won bigint,
  followups_completed bigint,
  overdue_followups bigint,
  appointments_total bigint,
  appointments_completed bigint,
  won_deals bigint,
  won_revenue_by_currency jsonb
)
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
begin
  if p_from is null or p_to is null or p_from > p_to then raise exception 'invalid_date_range'; end if;
  if (p_to - p_from) > 366 then raise exception 'date_range_too_large'; end if;
  if not private.has_org_role(p_organization_id, array['owner','admin','manager']) then raise exception 'insufficient_role'; end if;

  return query
  with members as (
    select om.user_id, coalesce(p.full_name, om.job_title, 'Team member') as full_name, om.role
    from public.organization_members om
    left join public.profiles p on p.user_id = om.user_id
    where om.organization_id = p_organization_id and om.status = 'active'
  ),
  lead_stats as (
    select l.assigned_to as user_id,
      count(*) filter (where l.created_at::date between p_from and p_to) as assigned_count,
      count(*) filter (where l.qualified_at::date between p_from and p_to or (l.status='qualified' and l.updated_at::date between p_from and p_to)) as qualified_count,
      count(*) filter (where l.won_at::date between p_from and p_to or (l.status='won' and l.updated_at::date between p_from and p_to)) as won_count
    from public.leads l
    where l.organization_id = p_organization_id and l.assigned_to is not null
    group by l.assigned_to
  ),
  follow_stats as (
    select f.assigned_to as user_id,
      count(*) filter (where f.status='completed' and f.completed_at::date between p_from and p_to) as completed_count,
      count(*) filter (where f.status in ('pending','in_progress') and f.due_at < now()) as overdue_count
    from public.follow_ups f
    where f.organization_id = p_organization_id and f.assigned_to is not null
    group by f.assigned_to
  ),
  appointment_stats as (
    select a.assigned_to as user_id,
      count(*) filter (where a.starts_at::date between p_from and p_to) as total_count,
      count(*) filter (where a.status='completed' and a.starts_at::date between p_from and p_to) as completed_count
    from public.appointments a
    where a.organization_id = p_organization_id and a.assigned_to is not null
    group by a.assigned_to
  ),
  deal_counts as (
    select d.owner_user_id as user_id, count(*) as won_count
    from public.deals d
    where d.organization_id=p_organization_id and d.owner_user_id is not null and d.stage='won'
      and coalesce(d.closed_at,d.updated_at)::date between p_from and p_to
    group by d.owner_user_id
  ),
  deal_currency as (
    select d.owner_user_id as user_id, d.currency, sum(coalesce(d.amount,0)) as revenue
    from public.deals d
    where d.organization_id=p_organization_id and d.owner_user_id is not null and d.stage='won'
      and coalesce(d.closed_at,d.updated_at)::date between p_from and p_to
    group by d.owner_user_id,d.currency
  ),
  deal_revenue as (
    select dc.user_id, jsonb_object_agg(dc.currency, dc.revenue order by dc.currency) as revenue_json
    from deal_currency dc group by dc.user_id
  )
  select m.user_id, m.full_name, m.role,
    coalesce(ls.assigned_count,0), coalesce(ls.qualified_count,0), coalesce(ls.won_count,0),
    coalesce(fs.completed_count,0), coalesce(fs.overdue_count,0),
    coalesce(a.total_count,0), coalesce(a.completed_count,0),
    coalesce(dcnt.won_count,0), coalesce(dr.revenue_json,'{}'::jsonb)
  from members m
  left join lead_stats ls on ls.user_id=m.user_id
  left join follow_stats fs on fs.user_id=m.user_id
  left join appointment_stats a on a.user_id=m.user_id
  left join deal_counts dcnt on dcnt.user_id=m.user_id
  left join deal_revenue dr on dr.user_id=m.user_id
  order by coalesce(dcnt.won_count,0) desc, coalesce(ls.assigned_count,0) desc, m.full_name;
end;
$$;
revoke all on function public.get_owner_employee_performance(uuid,date,date) from public, anon;
grant execute on function public.get_owner_employee_performance(uuid,date,date) to authenticated;
