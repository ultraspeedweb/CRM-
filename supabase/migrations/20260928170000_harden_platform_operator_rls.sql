begin;

-- Defense in depth for control-plane identities. Direct client access remains
-- revoked; RLS additionally protects the table if schema exposure or grants
-- change in the future. SECURITY DEFINER guard functions retain server-side
-- access as table owner and enforce auth.uid()/status/role checks themselves.
alter table private.platform_operators enable row level security;

revoke all on table private.platform_operators from public, anon, authenticated;

-- No anon/authenticated policies are intentionally created. Browser/API roles
-- must never select/insert/update/delete control-plane identities directly.

commit;
