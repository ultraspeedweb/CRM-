begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$array\['owner','admin','manager'\]$$,'execution permits only privileged management roles');
select * from finish();
rollback;
