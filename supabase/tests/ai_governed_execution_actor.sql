begin;
select plan(1);
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$actor_user_id$$,'audit records executing actor');
select * from finish();
rollback;
