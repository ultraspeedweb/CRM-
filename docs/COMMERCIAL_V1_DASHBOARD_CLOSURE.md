# SatışDesk Commercial V1 — Dashboard Closure

## Scope

This closure lane finishes only launch-critical company/platform visibility and certification. It does not expand product architecture or add unrelated features.

## Acceptance order

1. Company workspace remains the operational sales cockpit for tenant users.
2. Platform control plane exposes commercial tenant metadata only; it must not expose leads, messages, conversations, or other tenant customer content.
3. Subscription lifecycle, included-seat capacity, actual seat usage, trial end and current period end are visible to authorized platform operations.
4. Existing platform identity/RPC boundary and tenant RLS tests remain mandatory.
5. Exact-head Quality, Database and Local E2E gates must pass before merge.
6. After merge, the exact production deployment is verified and authenticated Production E2E remains required for final Commercial V1 GO.

## Non-goals

- No cosmetic redesign.
- No unrestricted platform access to tenant business data.
- No new billing provider or speculative automation.
- No bypass of quotas, RLS, approval gates, CI or production certification.
