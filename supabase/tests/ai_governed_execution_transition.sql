begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$and status='approved'$$,'sent transition remains guarded by approved state');
select * from finish();
rollback;
