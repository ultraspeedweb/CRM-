begin;
select plan(3);
select has_table('public','ai_suggestions','AI suggestions table exists');
select has_table('public','messages','messages table exists');
select has_table('public','audit_logs','audit log table exists');
select * from finish();
rollback;
