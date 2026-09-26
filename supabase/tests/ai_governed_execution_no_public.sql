begin;
select plan(1);
select ok(not has_function_privilege('public','public.execute_approved_ai_suggestion(uuid,uuid)','EXECUTE'),'PUBLIC cannot execute governed AI action');
select * from finish();
rollback;
