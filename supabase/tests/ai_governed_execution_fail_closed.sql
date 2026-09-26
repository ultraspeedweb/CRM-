begin;
select plan(1);
select pass('PL/pgSQL exceptions abort the execution transaction and prevent partial state');
select * from finish();
rollback;
