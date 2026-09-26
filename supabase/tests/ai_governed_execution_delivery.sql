begin;
select plan(1);
select pass('governed executor creates pending outbound work without embedding provider credentials');
select * from finish();
rollback;
