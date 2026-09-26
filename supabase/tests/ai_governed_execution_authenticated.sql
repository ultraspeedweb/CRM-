begin;
select plan(1);
select ok(has_function_privilege('authenticated','public.execute_approved_ai_suggestion(uuid,uuid)','EXECUTE'),'authenticated role can reach role-gated RPC');
select * from finish();
rollback;
