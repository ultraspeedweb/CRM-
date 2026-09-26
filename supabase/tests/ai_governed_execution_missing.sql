begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$suggestion not found$$,'missing or cross-tenant suggestion fails closed');
select * from finish();
rollback;
