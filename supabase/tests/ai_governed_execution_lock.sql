begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$FOR UPDATE$$,'suggestion execution locks proposal against duplicate execution');
select * from finish();
rollback;
