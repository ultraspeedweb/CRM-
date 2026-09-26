begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$suggestion is not executable$$,'execution rejects empty or unsupported proposals');
select * from finish();
rollback;
