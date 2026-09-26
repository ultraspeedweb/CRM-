begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$auth.uid\(\)$$,'executor derives actor from authenticated context');
select * from finish();
rollback;
