begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$status<>'approved'$$,'execution requires approved status');
select * from finish();
rollback;
