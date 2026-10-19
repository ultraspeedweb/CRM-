-- Atomic, role-checked intake review. Cannot touch subscriptions or billing events.
create or replace function public.begin_commercial_activation_review(p_request_id uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public, private
as $$
declare
  v_changed integer;
begin
  if auth.uid() is null or not private.has_platform_role(array['platform_owner','platform_admin','platform_billing']) then
    raise exception 'platform_access_denied' using errcode='42501';
  end if;
  update public.commercial_activation_requests
     set status = 'in_review',
         reviewed_by = auth.uid(),
         reviewed_at = now()
   where id = p_request_id
     and status = 'submitted';
  get diagnostics v_changed = row_count;
  return v_changed = 1;
end;
$$;
revoke all on function public.begin_commercial_activation_review(uuid) from public, anon;
grant execute on function public.begin_commercial_activation_review(uuid) to authenticated;
