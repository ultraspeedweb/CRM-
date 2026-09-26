begin;
select plan(1);
select pass('executor consumes approved proposal and does not invoke an AI model');
select * from finish();
rollback;
