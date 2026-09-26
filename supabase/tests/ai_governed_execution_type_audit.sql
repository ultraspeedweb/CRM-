begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$'suggestion_type',v_suggestion.suggestion_type$$,'execution audit records suggestion type');
select * from finish();
rollback;
