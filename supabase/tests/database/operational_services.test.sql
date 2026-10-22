begin;
create extension if not exists pgtap with schema extensions;
select plan(21);

insert into auth.users(id,email) values
('11111111-1111-4111-8111-111111111111','services-owner@example.test'),
('11111111-1111-4111-8111-222222222222','services-agent@example.test'),
('22222222-2222-4222-8222-111111111111','services-other@example.test');
insert into public.organizations(id,name,slug) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','Services A','services-a'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','Services B','services-b');
insert into public.organization_members(organization_id,user_id,role,status) values
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-111111111111','owner','active'),
('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','11111111-1111-4111-8111-222222222222','agent','active'),
('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','22222222-2222-4222-8222-111111111111','owner','active');
insert into public.conversations(id,organization_id,channel) values
('aaaaaaaa-0000-4000-8000-000000000001','aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','web'),
('bbbbbbbb-0000-4000-8000-000000000001','bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb','web');

select is((select handling_mode from public.conversations where id='aaaaaaaa-0000-4000-8000-000000000001'),'human','New conversations default to human');
select ok(not has_function_privilege('anon','public.is_platform_service_enabled(uuid,text)','EXECUTE'),'Anonymous cannot inspect switches');
select ok(not has_function_privilege('authenticated','public.is_platform_service_enabled(uuid,text)','EXECUTE'),'Tenants cannot inspect server controls');
select ok(has_function_privilege('service_role','public.is_platform_service_enabled(uuid,text)','EXECUTE'),'Server may use scoped switch RPC');
select ok(not has_table_privilege('authenticated','public.whatsapp_connections','INSERT'),'Tenant cannot bind deployment credentials');
select ok(not has_table_privilege('authenticated','public.whatsapp_connections','UPDATE'),'Tenant cannot activate another phone');
select ok(not has_table_privilege('authenticated','public.whatsapp_connections','DELETE'),'Tenant cannot remove trusted routing');

set local role service_role;
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','web_inbox'),true,'Web inbox is operational without a paid plan');
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','whatsapp'),false,'WhatsApp defaults off');
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ai_sales_agent'),false,'AI defaults off');
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','unknown'),false,'Unknown service fails closed');
select is(public.is_platform_service_enabled('cccccccc-cccc-4ccc-8ccc-cccccccccccc','web_inbox'),false,'Unknown organization fails closed');
reset role;

set local role authenticated;
set local request.jwt.claim.sub='11111111-1111-4111-8111-222222222222';
select throws_ok($$update public.conversations set handling_mode='ai' where id='aaaaaaaa-0000-4000-8000-000000000001'$$,'42501','AI resumption requires manager authority','Agent cannot bypass resume RPC with UPDATE');
select throws_ok($$insert into public.conversations(organization_id,channel,handling_mode) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','web','ai')$$,'42501','AI resumption requires manager authority','Agent cannot bypass resume RPC with INSERT');
set local request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';
select throws_ok($$select public.resume_conversation_ai('aaaaaaaa-0000-4000-8000-000000000001')$$,'42501','AI service is not enabled','Owner cannot resume disabled AI');
select throws_ok($$select public.execute_approved_ai_suggestion('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','aaaaaaaa-0000-4000-8000-000000000001')$$,'55000','AI execution is not certified','Uncertified AI cannot enqueue or claim delivery');
reset role;
insert into private.platform_service_controls(organization_id,service_key,status) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ai_sales_agent','enabled');
set local role authenticated;
set local request.jwt.claim.sub='11111111-1111-4111-8111-111111111111';
select is(public.resume_conversation_ai('aaaaaaaa-0000-4000-8000-000000000001'),true,'Owner can resume only explicitly enabled AI');
select throws_ok($$select public.resume_conversation_ai('bbbbbbbb-0000-4000-8000-000000000001')$$,'P0001','not authorized','Cross-tenant AI resumption denied');
reset role;
insert into private.platform_service_controls(organization_id,service_key,status) values('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','core','suspended');
set local role service_role;
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','web_inbox'),false,'Core suspension disables inbox');
select is(public.is_platform_service_enabled('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','ai_sales_agent'),false,'Core suspension overrides AI enablement');
reset role;
select is((select count(*) from public.messages where organization_id='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'),0::bigint,'Disabled execution has no message side effects');

select * from finish();
rollback;
