begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$v_suggestion.conversation_id$$,'execution writes to approved suggestion conversation');
select * from finish();
rollback;
