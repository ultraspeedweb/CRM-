begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$status<>'approved'$$,'already sent or rejected suggestions cannot execute');
select * from finish();
rollback;
