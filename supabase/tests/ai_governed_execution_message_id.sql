begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$'message_id',v_message_id$$,'execution audit links created outbound message');
select * from finish();
rollback;
