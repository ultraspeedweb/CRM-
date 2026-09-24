begin;

create extension if not exists pgtap with schema extensions;
select plan(4);

select ok(
  to_regprocedure('public.rls_auto_enable()') is not null,
  'RLS auto-enable event-trigger function exists'
);

select results_eq(
  $$select count(*)::bigint from pg_event_trigger where evtname='ensure_rls' and evtevent='ddl_command_end' and evtfoid='public.rls_auto_enable()'::regprocedure$$,
  array[1::bigint],
  'ensure_rls event trigger is installed'
);

select is(
  has_function_privilege('authenticated', 'public.rls_auto_enable()', 'EXECUTE'),
  false,
  'Authenticated users cannot execute the RLS event-trigger function'
);

create table public.__launch_rls_probe (id integer primary key);
select is(
  (select relrowsecurity from pg_class where oid='public.__launch_rls_probe'::regclass),
  true,
  'New public tables automatically have RLS enabled'
);
drop table public.__launch_rls_probe;

select * from finish();
rollback;
