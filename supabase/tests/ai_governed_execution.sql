begin;
select plan(8);

select has_function('public','execute_approved_ai_suggestion',array['uuid','uuid'],'governed AI execution RPC exists');
select function_lang_is('public','execute_approved_ai_suggestion',array['uuid','uuid'],'plpgsql','execution RPC is plpgsql');
select is_definer('public','execute_approved_ai_suggestion',array['uuid','uuid'],'execution RPC is security definer');
select function_returns('public','execute_approved_ai_suggestion',array['uuid','uuid'],'uuid','execution RPC returns message id');
select has_table('public','ai_suggestions','AI suggestions table exists');
select col_is_null('public','ai_suggestions','approved_by','approved_by remains nullable before approval');
select col_is_null('public','ai_suggestions','approved_at','approved_at remains nullable before approval');
select has_table('public','audit_logs','audit log table exists for execution evidence');

select * from finish();
rollback;
