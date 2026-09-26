begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$authentication required$$,'governed execution requires authenticated actor');
select * from finish();
rollback;
