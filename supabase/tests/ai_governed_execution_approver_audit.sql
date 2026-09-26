begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$'approved_by',v_suggestion.approved_by$$,'execution audit links human approver');
select * from finish();
rollback;
