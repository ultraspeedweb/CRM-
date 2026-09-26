begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$suggestion_type<>'sales_reply'$$,'only sales replies are executable');
select * from finish();
rollback;
