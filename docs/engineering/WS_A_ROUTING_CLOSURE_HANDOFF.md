# WS-A routing closure handoff

Status: BLOCKED; application implementation and runtime verification pending.
Inspected branch lineage: b1c4573990bf8b82d5c7b8faa5718e7d56041ca5 -> 18de6534917581784f04202b7cde692a36f59873.
Branch: feat/autonomous-revenue-os-foundation-20261004.

## Approved outcome

Preserve SatışDesk as a Governed Autonomous Revenue & Growth OS. Authenticated users land in their authorized operating surface, and tenant membership never grants Platform Owner authority. Complete WS-A before expanding into Revenue Graph and Goal Intelligence.

## Branch-specific verified source state

The following was re-read directly from the active feature branch so the next execution session does not need to rediscover it:

- `lib/workspace-routing.ts` is already the central post-auth routing contract. It resolves active membership by `user_id` + `status = active`, propagates membership query errors, sends users without active membership to `/onboarding`, and delegates role routing to `workspaceHomeForRole`.
- `app/login/actions.ts` is already migrated to `resolveAuthenticatedDestination` after successful password sign-in. Sign-up email confirmation explicitly requests `next=/onboarding`; an immediate session goes to onboarding.
- `app/onboarding/page.tsx` is already migrated to `resolveAuthenticatedDestination` and redirects existing members to their governed operating surface.
- `app/onboarding/actions.ts` already fails closed on membership lookup errors and uses `resolveAuthenticatedDestination` for existing members and after successful organization bootstrap.
- `app/(workspace)/dashboard/page.tsx` is already a compatibility entry point only. It calls `requireWorkspace()` and redirects through `workspaceHomeForRole(membership.role)`; do not delete it merely to eliminate the string `/dashboard`.
- `components/sidebar.tsx` on this feature branch is already role-aware and does **not** use `/dashboard`; it computes the role home using `workspaceHomeForRole` and conditionally exposes execution/management surfaces. The default-branch `/dashboard` search hit for this file is stale relative to this branch.
- Platform authority is already structurally separated from tenant authority in `supabase/migrations/20260926100000_add_platform_control_plane.sql`: identities live in `private.platform_operators`, `private.has_platform_role(...)` checks the authenticated user against explicit platform roles, and `get_platform_company_overview()` raises `platform authorization required` unless that guard passes.
- `supabase/tests/platform_control_plane.sql` already includes behavioral negative evidence: a disabled platform operator is denied, an ordinary authenticated tenant identity has no platform role, and the ordinary tenant identity cannot execute the platform overview RPC. Preserve and rerun these tests; do not reinvent this authority model unless a failing test exposes a defect.
- `app/platform/page.tsx` still redirects to `/dashboard` when `get_platform_company_overview()` errors. This is a real legacy recovery dependency even though the underlying RPC authorization is correctly separated; replace the recovery behavior without weakening the RPC authority boundary.
- `app/auth/confirm/route.ts` is still a real WS-A defect: it accepts any `next` beginning with `/`, which includes protocol-relative values such as `//example.invalid`, and it defaults to `/dashboard`. This must be replaced with governed same-origin/authorized destination handling after verified identity resolution.
- `app/not-found.tsx` still links directly to `/dashboard`. This is a legacy dependency and should be replaced with a safe non-authorizing recovery destination/pattern consistent with the product shell.
- Default-branch code search also surfaced `/dashboard` references in server actions, follow-up actions and E2E. Because GitHub code search indexes the default branch, do **not** assume every default-branch hit still exists unchanged on this feature branch. Inspect each candidate on the branch before editing it.

## Known completed portions — do not redo

Do not spend execution time re-implementing these unless regression evidence proves they are broken:

1. Password sign-in -> governed workspace resolver.
2. Onboarding page -> governed workspace resolver.
3. Onboarding create-organization flow -> fail-closed membership check + governed resolver.
4. `/dashboard` route -> compatibility-only role redirect.
5. Role-aware sidebar home/navigation contract.
6. Separate Platform Owner/Operator authority model at the database/RPC boundary, including existing positive/negative SQL authorization tests.

These are source-verified only, not exact-candidate runtime-certified.

## Remaining implementation scope

Read applicable nested `AGENTS.md` files and the installed Next.js guide required by root `AGENTS.md` before changing application code. Reuse existing routing/authorization contracts rather than creating a competing role model.

1. Fix `app/auth/confirm/route.ts`:
   - verify OTP;
   - resolve the authenticated identity after verification;
   - compute the governed canonical destination through the existing workspace routing contract;
   - allow only explicitly valid internal recovery/return destinations that the user is authorized to enter;
   - reject absolute external URLs, protocol-relative URLs, malformed paths, unauthorized workspace paths and redirect loops;
   - never fall back to authority by string validation alone;
   - membership/identity lookup failure must fail closed.
2. Replace the legacy `app/not-found.tsx -> /dashboard` dependency with an approved safe recovery behavior that does not become an authorization bypass.
3. Replace the `app/platform/page.tsx` RPC-error fallback to `/dashboard` with an explicit denied/error/recovery state or route appropriate for failed Platform Control Plane authorization. Do not turn a platform authorization failure into tenant navigation silently.
4. Inventory every remaining `/dashboard` reference on **this branch**, not only default-branch search results. Classify each as:
   - approved compatibility entry point;
   - legacy internal dependency to replace;
   - intentional route/link whose authorization is enforced elsewhere.
5. Inspect branch versions of the remaining default-branch candidates before touching them: `app/(workspace)/actions.ts`, `app/(workspace)/follow-ups/assignment-actions.ts`, `app/(workspace)/follow-ups/escalation-actions.ts`, `e2e/launch-flow.spec.mjs` and any additional branch-local hits. `components/sidebar.tsx` is already cleared and should not be redone.
6. Preserve the existing separate Platform Owner/Operator database authority contract. Run and extend existing SQL tests only where needed to prove the WS-A acceptance matrix (for example tenant owner/admin/manager must not gain platform authority).
7. Preserve underlying commercial data and approved compatibility behavior while removing internal generic-dashboard coupling.

## Required acceptance evidence

- Cross-role positive and negative tests for owner/admin/manager/agent/viewer/unknown plus separate Platform Owner authority.
- Cross-tenant negative tests at applicable server/database boundaries; redirects alone are not authorization evidence.
- Auth confirmation tests for valid token, invalid token, expired token, identity resolution failure, membership lookup failure, no-return/default behavior, approved internal return behavior, external URL, protocol-relative URL, malformed URL, unauthorized destination, redirect loops and relevant encoded bypass attempts.
- Regression coverage for login/onboarding and affected server-action follow-up destinations.
- Existing platform-control SQL authorization tests rerun on the exact candidate; extend only if needed to cover tenant owner/admin/manager explicitly.
- Verify `/dashboard` remains compatibility-only and cannot bypass role or tenant authorization.
- Arabic RTL, Turkish/English LTR, keyboard/focus/semantics, responsive and truthful loading/empty/denied/error states for touched surfaces.
- Database, Quality, Security and E2E gates on the exact candidate; dependency security remains fail-closed without force or bypass.
- Independent verifier compares implementation and evidence against WS-A exit criteria.
- No merge until every applicable gate is satisfied. No commercial-readiness claim without required production evidence.

## Execution shortcut for Codex Local/Cloud

Do **not** restart broad discovery. Start from this packet, read the installed Next.js documentation mandated by `AGENTS.md`, then inspect only the branch-local candidate files above plus any exact branch-local `/dashboard` hits. Do not rework login, onboarding, dashboard compatibility, sidebar routing or the existing platform-operator authority model without regression evidence. Implement the remaining defects, run the required gates, fix failures, and independently verify WS-A. If WS-A closes, continue immediately to WS-B Revenue Graph according to `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`.

## Current external blocker

This chat can inspect and write GitHub files but cannot read the repository's installed `node_modules/next/dist/docs/` or execute the local build/database/browser test stack. Root `AGENTS.md` explicitly requires reading the installed Next guides before application-code changes, so application-code edits and runtime certification remain for Codex Local/Cloud.

This document is an optimized execution handoff, not a claim that WS-A is closed.
