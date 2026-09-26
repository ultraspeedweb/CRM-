begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$'outbound'$$,'approved reply creates outbound message');
select * from finish();
rollback;
