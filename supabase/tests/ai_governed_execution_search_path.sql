begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$SET search_path TO 'public', 'pg_temp'$$,'security definer RPC pins search path');
select * from finish();
rollback;
