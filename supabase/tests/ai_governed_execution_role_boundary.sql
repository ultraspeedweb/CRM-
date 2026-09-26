begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),'private\.has_org_role','governed execution checks organization role');
select * from finish();
rollback;
