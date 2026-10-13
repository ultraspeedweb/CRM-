begin;
select plan(10);
select has_table('private','platform_service_controls','platform service controls exist');
select has_function('public','set_platform_service_status',array['uuid','text','text','text'],'service control RPC exists');
select is_definer('public','set_platform_service_status',array['uuid','text','text','text'],'service control is security definer');
select has_function('public','get_platform_service_overview',array[]::text[],'service overview exists');
select is_definer('public','get_platform_service_overview',array[]::text[],'service overview is security definer');
select has_table('public','audit_logs','service actions have an audit sink');
select has_table('public','billing_events','billing ledger remains available to control plane');
-- Verify authorization behavior, not just security-definer declarations.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
('00000000-0000-4000-8000-000000000811'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'service-support-test@satisdesk.invalid', '', now(), now(), now()),
('00000000-0000-4000-8000-000000000899'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'service-tenant-test@satisdesk.invalid', '', now(), now(), now());
insert into private.platform_operators (user_id, role, status)
values ('00000000-0000-4000-8000-000000000811'::uuid, 'platform_support', 'active');

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000899',true);
select throws_ok(
  $select public.set_platform_service_status('00000000-0000-4000-8000-000000000001'::uuid,'whatsapp','disabled','Test restriction')$,
  'P0001', 'platform admin authorization required',
  'ordinary tenant cannot mutate service controls');
select throws_ok(
  $select * from public.get_platform_service_overview()$,
  'P0001', 'platform authorization required',
  'ordinary tenant cannot view other companies service controls');

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-000000000811',true);
select throws_ok(
  $select public.set_platform_service_status('00000000-0000-4000-8000-000000000001'::uuid,'whatsapp','disabled','Test restriction')$,
  'P0001', 'platform admin authorization required',
  'read-only platform support cannot mutate tenant service controls');

select * from finish();
rollback;
