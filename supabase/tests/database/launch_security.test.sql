begin;

create extension if not exists pgtap with schema extensions;
select plan(28);

-- Four isolated identities: Org A owner/agent and Org B owner/agent.
insert into auth.users (id, email) values
  ('11111111-1111-4111-8111-111111111111', 'a-owner@example.test'),
  ('11111111-1111-4111-8111-222222222222', 'a-agent@example.test'),
  ('22222222-2222-4222-8222-111111111111', 'b-owner@example.test'),
  ('22222222-2222-4222-8222-222222222222', 'b-agent@example.test');

insert into public.organizations (id, name, slug) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Org A', 'launch-test-org-a'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'Org B', 'launch-test-org-b');

insert into public.organization_members (organization_id, user_id, role, status) values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'owner', 'active'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-222222222222', 'agent', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-111111111111', 'owner', 'active'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '22222222-2222-4222-8222-222222222222', 'agent', 'active');

insert into public.leads (id, organization_id, full_name, source_channel) values
  ('aaaaaaaa-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'A Lead', 'manual'),
  ('bbbbbbbb-0000-4000-8000-000000000001', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 'B Lead', 'manual');

insert into public.deals (id, organization_id, lead_id, title, stage, probability) values
  ('aaaaaaaa-0000-4000-8000-000000000002', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'aaaaaaaa-0000-4000-8000-000000000001', 'A Deal', 'qualification', 20);

insert into public.appointments (id, organization_id, lead_id, title, status, starts_at, ends_at) values
  ('aaaaaaaa-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'aaaaaaaa-0000-4000-8000-000000000001', 'A Appointment', 'scheduled', now() + interval '1 day', now() + interval '1 day 1 hour');

-- Org A owner: horizontal isolation.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
select results_eq(
  $$select count(*) from public.organizations$$,
  array[1::bigint],
  'Org A owner sees exactly one organization'
);
select results_eq(
  $$select count(*) from public.organizations where id='bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid$$,
  array[0::bigint],
  'Org A owner cannot read Org B'
);
select results_eq(
  $$select count(*) from public.leads$$,
  array[1::bigint],
  'Org A owner sees only Org A leads'
);
update public.leads set full_name='HACKED-B' where id='bbbbbbbb-0000-4000-8000-000000000001'::uuid;
reset role;
select is(
  (select full_name from public.leads where id='bbbbbbbb-0000-4000-8000-000000000001'::uuid),
  'B Lead',
  'Cross-tenant UPDATE from Org A does not modify Org B lead'
);

-- Org A agent: vertical authorization and own-tenant write.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-222222222222';
update public.organizations set name='HACKED-ORG-A' where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid;
update public.leads set full_name='A Lead Updated' where id='aaaaaaaa-0000-4000-8000-000000000001'::uuid;
reset role;
select is(
  (select name from public.organizations where id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid),
  'Org A',
  'Agent cannot perform Owner/Admin organization update'
);
select is(
  (select full_name from public.leads where id='aaaaaaaa-0000-4000-8000-000000000001'::uuid),
  'A Lead Updated',
  'Agent can update own-tenant lead'
);

-- Org B symmetry.
set local role authenticated;
set local request.jwt.claim.sub = '22222222-2222-4222-8222-111111111111';
select results_eq(
  $$select count(*) from public.organizations$$,
  array[1::bigint],
  'Org B owner sees exactly one organization'
);
reset role;

-- SECURITY DEFINER RPCs: own-org allowed, cross-org denied.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
select lives_ok(
  $$select * from public.get_subscription_entitlements('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid)$$,
  'Owner can call subscription entitlements for own organization'
);
select throws_ok(
  $$select * from public.get_subscription_entitlements('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid)$$,
  'P0001', 'not_organization_member',
  'Subscription RPC rejects cross-tenant organization'
);
select lives_ok(
  $$select * from public.get_owner_employee_performance('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, current_date - 7, current_date)$$,
  'Owner employee performance RPC allows own organization'
);
select throws_ok(
  $$select * from public.get_owner_employee_performance('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, current_date - 7, current_date)$$,
  'P0001', 'insufficient_role',
  'Owner employee performance RPC rejects cross-tenant organization'
);
reset role;

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-222222222222';
select throws_ok(
  $$select * from public.get_owner_employee_performance('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, current_date - 7, current_date)$$,
  'P0001', 'insufficient_role',
  'Agent cannot call owner employee performance RPC'
);
reset role;

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-111111111111';
select lives_ok(
  $$select * from public.get_owner_marketing_performance('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'::uuid, current_date - 7, current_date)$$,
  'Owner marketing performance RPC allows own organization'
);
select throws_ok(
  $$select * from public.get_owner_marketing_performance('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb'::uuid, current_date - 7, current_date)$$,
  'P0001', 'insufficient_role',
  'Owner marketing performance RPC rejects cross-tenant organization'
);
reset role;

-- Direct-API lifecycle bypass attempts are rejected at DB level.
set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-222222222222';
select throws_ok(
  $$update public.deals set stage='won' where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid$$,
  '23514', 'invalid deal stage transition: qualification -> won',
  'Direct deal stage jump is rejected'
);
select lives_ok(
  $$update public.deals set stage='proposal', probability=50 where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid$$,
  'Qualification to proposal is allowed'
);
select lives_ok(
  $$update public.deals set stage='negotiation', probability=75 where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid$$,
  'Proposal to negotiation is allowed'
);
select throws_ok(
  $$update public.deals set stage='lost' where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid$$,
  '23514', 'lost_reason is required for lost deals',
  'Lost deal requires a reason'
);
select lives_ok(
  $$update public.deals set stage='lost', lost_reason='Customer chose another provider' where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid$$,
  'Negotiation to lost with reason is allowed'
);
reset role;
select is(
  (select stage from public.deals where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid),
  'lost',
  'Deal reaches lost terminal stage'
);
select is(
  (select probability::integer from public.deals where id='aaaaaaaa-0000-4000-8000-000000000002'::uuid),
  0,
  'Lost deal probability is server-authoritatively zero'
);

set local role authenticated;
set local request.jwt.claim.sub = '11111111-1111-4111-8111-222222222222';
select throws_ok(
  $$update public.appointments set status='completed' where id='aaaaaaaa-0000-4000-8000-000000000003'::uuid$$,
  '23514', 'invalid appointment status transition: scheduled -> completed',
  'Direct appointment status jump is rejected'
);
select lives_ok(
  $$update public.appointments set status='confirmed' where id='aaaaaaaa-0000-4000-8000-000000000003'::uuid$$,
  'Scheduled to confirmed is allowed'
);
select throws_ok(
  $$update public.appointments set status='cancelled' where id='aaaaaaaa-0000-4000-8000-000000000003'::uuid$$,
  '23514', 'cancellation_reason is required for cancelled appointments',
  'Cancelled appointment requires a reason'
);
select lives_ok(
  $$update public.appointments set status='cancelled', cancellation_reason='Customer requested another date' where id='aaaaaaaa-0000-4000-8000-000000000003'::uuid$$,
  'Confirmed to cancelled with reason is allowed'
);
reset role;
select is(
  (select status from public.appointments where id='aaaaaaaa-0000-4000-8000-000000000003'::uuid),
  'cancelled',
  'Appointment reaches cancelled terminal state'
);

select is(
  has_function_privilege('authenticated', 'private.validate_deal_lifecycle_transition()', 'EXECUTE'),
  false,
  'Authenticated users cannot directly execute deal lifecycle trigger function'
);
select is(
  has_function_privilege('authenticated', 'private.validate_appointment_lifecycle_transition()', 'EXECUTE'),
  false,
  'Authenticated users cannot directly execute appointment lifecycle trigger function'
);

select * from finish();
rollback;
