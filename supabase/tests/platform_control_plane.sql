begin;
select plan(8);

select has_table('private','platform_operators','platform operators are separated from tenant roles');
select has_function('private','has_platform_role',array['text[]'],'platform role guard exists');
select is_definer('private','has_platform_role',array['text[]'],'platform role guard is security definer');
select has_function('public','get_platform_company_overview',array[]::text[],'platform company overview exists');
select is_definer('public','get_platform_company_overview',array[]::text[],'platform overview is security definer');
select function_returns('public','get_platform_company_overview',array[]::text[],'record','platform overview returns table rows');
select has_table('public','organization_subscriptions','subscription source exists');
select has_table('public','billing_plans','plan and quota source exists');

select * from finish();
rollback;
