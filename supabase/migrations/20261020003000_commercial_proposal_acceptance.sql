-- Customer acknowledgement of a published quote. Not a signed contract or payment.
alter table public.commercial_proposals drop constraint commercial_proposals_state_check;
alter table public.commercial_proposals add constraint commercial_proposals_state_check check(state in ('draft','published','accepted'));
alter table public.commercial_proposals add column accepted_by uuid references auth.users(id);
alter table public.commercial_proposals add column accepted_at timestamptz;
alter table public.commercial_proposals add constraint commercial_proposals_accept_pair check((accepted_by is null)=(accepted_at is null));
create or replace function public.accept_commercial_proposal(p_proposal_id uuid)
returns boolean language plpgsql security definer set search_path=pg_catalog,public,private as $$
declare v_updated integer;
begin
 if auth.uid() is null then raise exception 'authentication_required' using errcode='42501'; end if;
 update public.commercial_proposals p
 set state='accepted',accepted_by=auth.uid(),accepted_at=now()
 where p.id=p_proposal_id and p.state='published' and p.valid_until>=current_date
 and exists(select 1 from public.organization_members m where m.organization_id=p.organization_id
 and m.user_id=auth.uid() and m.status='active' and m.role in ('owner','admin'));
 get diagnostics v_updated=row_count;
 return v_updated=1;
end; $$;
revoke all on function public.accept_commercial_proposal(uuid) from public,anon;
grant execute on function public.accept_commercial_proposal(uuid) to authenticated;
drop policy commercial_proposal_member_read on public.commercial_proposals;
create policy commercial_proposal_member_read on public.commercial_proposals for select to authenticated
 using (state in ('published','accepted') and private.is_org_member(organization_id));
