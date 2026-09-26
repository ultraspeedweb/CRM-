begin;
select plan(5);

select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),'private\.has_org_role','execution enforces organization role');
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),'owner.*admin.*manager','execution is restricted to privileged roles');
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$status\s*<>\s*'approved'$$,'execution requires approved state');
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),'ai\.suggestion\.executed','successful execution is audited');
select matches(pg_get_functiondef('public.execute_approved_ai_suggestion(uuid,uuid)'::regprocedure),$$organization_id\s*=\s*p_organization_id$$,'suggestion lookup is tenant scoped');

select * from finish();
rollback;
