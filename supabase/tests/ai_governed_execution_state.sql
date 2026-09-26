begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$suggestion is not approved$$,'governed execution rejects unapproved suggestions');
select * from finish();
rollback;
