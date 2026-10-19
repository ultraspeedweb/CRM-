-- Explicitly publish an approved commercial offer to the requesting tenant.
-- This is NOT a contract, invoice, receipt or subscription activation.
alter table public.commercial_proposals drop constraint commercial_proposals_state_check;
alter table public.commercial_proposals add constraint commercial_proposals_state_check check (state in ('draft','published'));
alter table public.commercial_proposals add column published_at timestamptz;
alter table public.commercial_proposals add column published_by uuid references auth.users(id);
create policy commercial_proposal_member_read on public.commercial_proposals
 for select to authenticated using (state='published' and private.is_org_member(organization_id));
grant select on public.commercial_proposals to authenticated;

create or replace function public.publish_commercial_proposal(p_proposal_id uuid)
returns boolean language plpgsql security definer
set search_path=pg_catalog,public,private as $$
declare v_updated integer;
begin
 if auth.uid() is null or not private.has_platform_role(array['platform_owner','platform_admin','platform_billing']) then
  raise exception 'platform_access_denied' using errcode='42501';
 end if;
 update public.commercial_proposals set state='published',published_at=now(),published_by=auth.uid()
 where id=p_proposal_id and state='draft' and valid_until>=current_date;
 get diagnostics v_updated=row_count;
 return v_updated=1;
end; $$;
revoke all on function public.publish_commercial_proposal(uuid) from public,anon;
grant execute on function public.publish_commercial_proposal(uuid) to authenticated;
