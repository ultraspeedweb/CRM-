revoke insert, update, delete on public.organization_subscriptions from authenticated;
revoke insert, update, delete on public.billing_events from authenticated;

comment on column public.organization_subscriptions.status is 'Subscription lifecycle is updated only by trusted server billing code/webhooks.';
comment on column public.billing_events.provider_event_id is 'Provider event identifier used for idempotent billing webhook ingestion.';
