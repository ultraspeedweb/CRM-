begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$approved_at is null$$,'execution requires approval timestamp');
select * from finish();
rollback;
