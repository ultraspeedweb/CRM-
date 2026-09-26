begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$approved_by$$,'execution requires and records approver evidence');
select * from finish();
rollback;
