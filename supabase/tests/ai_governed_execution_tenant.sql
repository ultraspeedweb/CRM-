begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$organization_id=p_organization_id$$,'governed execution scopes suggestion by tenant');
select * from finish();
rollback;
