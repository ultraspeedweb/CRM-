begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$values\(p_organization_id$$,'outbound message is written under requested tenant');
select * from finish();
rollback;
