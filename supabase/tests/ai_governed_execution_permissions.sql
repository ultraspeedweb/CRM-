begin;
select plan(2);
select ok(not has_function_privilege('anon','public.execute_approved_ai_suggestion(uuid,uuid)','EXECUTE'),'anon cannot execute governed AI action');
select ok(has_function_privilege('authenticated','public.execute_approved_ai_suggestion(uuid,uuid)','EXECUTE'),'authenticated role can reach role-gated RPC');
select * from finish();
rollback;
