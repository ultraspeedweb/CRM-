begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$suggestion state changed$$,'concurrent state change fails closed');
select * from finish();
rollback;
