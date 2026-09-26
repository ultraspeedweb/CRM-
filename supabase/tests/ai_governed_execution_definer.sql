begin;
select plan(1);
select is_definer('public','execute_approved_ai_suggestion',array['uuid','uuid'],'execution RPC is security definer');
select * from finish();
rollback;
