begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$'pending'$$,'execution hands outbound message to delivery layer as pending');
select * from finish();
rollback;
