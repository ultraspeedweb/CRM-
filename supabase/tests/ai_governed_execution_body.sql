begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$v_suggestion.suggested_reply$$,'outbound body comes from approved suggestion');
select * from finish();
rollback;
