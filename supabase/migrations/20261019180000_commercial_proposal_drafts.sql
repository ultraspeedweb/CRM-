-- Commercial proposal records are drafts, never invoices, payments or activated subscriptions.
create table public.commercial_proposals (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null unique references public.commercial_activation_requests(id) on delete restrict,
 organization_id uuid not null references public.organizations(id),
 amount_minor bigint not null check (amount_minor > 0),
 currency text not null check (currency in ('TRY','USD','EUR')),
 scope text not null check (length(btrim(scope)) between 20 and 3000),
 valid_until date not null check (valid_until > date '2026-01-01'),
 state text not null default 'draft' check (state = 'draft'),
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now()
);
alter table public.commercial_proposals enable row level security;
revoke all on public.commercial_proposals from public,anon,authenticated;
create or replace function public.create_commercial_proposal_draft(
 p_request_id uuid,p_amount_minor bigint,p_currency text,p_scope text,p_valid_until date)
returns uuid language plpgsql security definer
set search_path=pg_catalog,public,private as $$
declare v_request public.commercial_activation_requests%rowtype; v_id uuid;
begin
 if auth.uid() is null or not private.has_platform_role(array['platform_owner','platform_admin','platform_billing']) then
   raise exception 'platform_access_denied' using errcode='42501';
 end if;
 select * into v_request from public.commercial_activation_requests where id=p_request_id and status='in_review' for update;
 if not found then raise exception 'request_not_in_review'; end if;
 if p_amount_minor is null or p_amount_minor<=0 or p_currency not in ('TRY','USD','EUR')
 or length(btrim(coalesce(p_scope,''))) not between 20 and 3000
 or p_valid_until is null or p_valid_until<=current_date then raise exception 'invalid_proposal'; end if;
 insert into public.commercial_proposals(request_id,organization_id,amount_minor,currency,scope,valid_until,created_by)
 values(p_request_id,v_request.organization_id,p_amount_minor,p_currency,btrim(p_scope),p_valid_until,auth.uid())
 returning id into v_id;
 return v_id;
end; $$;
revoke all on function public.create_commercial_proposal_draft(uuid,bigint,text,text,date) from public,anon;
grant execute on function public.create_commercial_proposal_draft(uuid,bigint,text,text,date) to authenticated;
