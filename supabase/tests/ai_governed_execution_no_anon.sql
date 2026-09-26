begin;
select plan(1);
select ok(not has_function_privilege('anon','public.execute_approved_ai_suggestion(uuid,uuid)','EXECUTE'),'anonymous execution is revoked');
select * from finish();
rollback;
