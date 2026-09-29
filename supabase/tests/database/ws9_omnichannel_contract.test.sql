begin;
select plan(12);

select ok((select relrowsecurity from pg_class where oid = 'public.conversations'::regclass), 'conversations has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.messages'::regclass), 'messages has RLS enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.whatsapp_connections'::regclass), 'whatsapp_connections has RLS enabled');

select has_column('public', 'messages', 'external_message_id', 'messages stores provider message id');
select has_column('public', 'messages', 'delivery_status', 'messages stores delivery status');
select has_column('public', 'messages', 'delivered_at', 'messages stores delivered timestamp');
select has_column('public', 'messages', 'read_at', 'messages stores read timestamp');
select has_column('public', 'messages', 'failure_reason', 'messages stores provider failure reason');
select has_column('public', 'conversations', 'external_thread_id', 'conversations store provider thread id');
select has_column('public', 'conversations', 'unread_count', 'conversations store unread count');
select has_column('public', 'whatsapp_connections', 'phone_number_id', 'WhatsApp connection stores routing phone number id');

select ok(
  exists (
    select 1 from pg_indexes
    where schemaname='public' and tablename='messages'
      and indexdef ilike '%external_message_id%'
  ),
  'messages external provider id is indexed for webhook delivery updates'
);

select * from finish();
rollback;
