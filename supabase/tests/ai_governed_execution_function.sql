begin;
select plan(1);
select has_function('public','execute_approved_ai_suggestion',array['uuid','uuid'],'governed AI execution RPC exists');
select * from finish();
rollback;
