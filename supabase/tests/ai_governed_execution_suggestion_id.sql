begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$p_suggestion_id$$,'execution is anchored to explicit suggestion id');
select * from finish();
rollback;
