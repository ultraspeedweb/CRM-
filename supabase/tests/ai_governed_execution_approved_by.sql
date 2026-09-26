begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$approved_by is null$$,'execution requires human approver identity');
select * from finish();
rollback;
