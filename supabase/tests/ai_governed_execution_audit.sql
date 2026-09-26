begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),'ai\.suggestion\.executed','governed execution records audit action');
select * from finish();
rollback;
