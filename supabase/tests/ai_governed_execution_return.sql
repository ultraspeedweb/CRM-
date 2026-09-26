begin;
select plan(1);
select function_returns('public','execute_approved_ai_suggestion',array['uuid','uuid'],'uuid','execution returns created message id');
select * from finish();
rollback;
