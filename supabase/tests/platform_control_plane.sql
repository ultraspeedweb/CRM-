begin;
select plan(13);

select has_table('private','platform_operators','platform operators are separated from tenant roles');
select has_function('private','has_platform_role',array['text[]'],'platform role guard exists');
select is_definer('private','has_platform_role',array['text[]'],'platform role guard is security definer');
select has_function('public','get_platform_company_overview',array[]::text[],'platform company overview exists');
select is_definer('public','get_platform_company_overview',array[]::text[],'platform overview is security definer');
select function_returns('public','get_platform_company_overview',array[]::text[],'setof record','platform overview returns table rows');
select has_table('public','organization_subscriptions','subscription source exists');
select has_table('public','billing_plans','plan and quota source exists');

-- Authorization contract: prove behavior, not only object existence.
-- Seed synthetic auth identities because platform_operators intentionally FK references auth.users.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('00000000-0000-4000-8000-000000000701'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'platform-owner-test@satisdesk.invalid', '', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000702'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'platform-disabled-test@satisdesk.invalid', '', now(), now(), now()),
  ('00000000-0000-4000-8000-000000000799'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'tenant-user-test@satisdesk.invalid', '', now(), now(), now());

insert into private.platform_operators(user_id, role, status)
values
  ('00000000-0000-4000-8000-000000000701'::uuid, 'platform_owner', 'active'),
  ('00000000-0000-4000-8000-000000000702'::uuid, 'platform_support', 'disabled');

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000701',true);
select ok(private.has_platform_role(array['platform_owner']), 'active platform owner is authorized');
select lives_ok($$select * from public.get_platform_company_overview()$$, 'platform owner can read platform metadata overview');

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000702',true);
select is(private.has_platform_role(array['platform_owner','platform_support']), false, 'disabled platform operator is denied');

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000799',true);
select is(private.has_platform_role(array['platform_owner','platform_admin','platform_support','platform_billing']), false, 'ordinary authenticated tenant identity has no platform role');
select throws_ok($$select * from public.get_platform_company_overview()$$, 'P0001', 'platform authorization required', 'ordinary tenant identity cannot read platform metadata overview');

select * from finish();
rollback;
