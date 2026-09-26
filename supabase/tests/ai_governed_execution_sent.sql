begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$set status='sent'$$,'successful execution transitions suggestion to sent');
select * from finish();
rollback;
