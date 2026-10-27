# WS-A routing closure handoff

Status: BLOCKED; application implementation and exact-candidate runtime verification pending.
Inspected branch lineage: b1c4573990bf8b82d5c7b8faa5718e7d56041ca5 -> 18de6534917581784f04202b7cde692a36f59873 -> 02f221e1028213c433189e117eef480140cc6b07.
Branch: feat/autonomous-revenue-os-foundation-20261004.

## Approved outcome

Preserve SatışDesk as a Governed Autonomous Revenue & Growth OS. Authenticated users land in their authorized operating surface, and tenant membership never grants Platform Owner authority. Complete WS-A before expanding into Revenue Graph and Goal Intelligence.

## Branch-specific verified source state

The following was re-read directly from the active feature branch so the next execution session does not need to rediscover it:

- `lib/workspace-routing.ts` is already the central post-auth routing contract. It resolves active membership by `user_id` + `status = active`, propagates membership query errors, sends users without active membership to `/onboarding`, and delegates role routing to `workspaceHomeForRole`.
- `lib/workspace-surfaces.ts` already defines the role/surface contract: owner/admin/manager -> `/command`, agent -> `/work`, viewer -> `/insights`, unknown roles -> `/insights`; management/execution capability helpers already exist.
- `lib/workspace.ts` already fail-closes identity/membership resolution: claims failures route to login; membership query errors throw; missing membership routes to onboarding. It returns the active tenant-scoped `organizationId`, `membership`, `userId`, and Supabase client.
- `app/(workspace)/layout.tsx` already obtains membership through `requireWorkspace()` and passes the role into the sidebar.
- `app/(workspace)/command/page.tsx` already enforces management-surface access server-side: non-management users are redirected to `/work` (agent) or `/insights`.
- `app/(workspace)/work/page.tsx` already enforces execution-surface access server-side: users without execution access are redirected to `/insights`.
- `app/(workspace)/insights/page.tsx` is explicitly read-only in product intent and remains tenant-scoped through `requireWorkspace()` + `organizationId` filtering.
- `components/sidebar.tsx` on this feature branch is already role-aware and does **not** use `/dashboard`; it computes role home with `workspaceHomeForRole` and conditionally exposes execution/management modules. The default-branch `/dashboard` search hit for this file is stale relative to the feature branch.
- `app/login/actions.ts` is already migrated to `resolveAuthenticatedDestination` after successful password sign-in. Sign-up email confirmation explicitly requests `next=/onboarding`; an immediate session goes to onboarding.
- `app/onboarding/page.tsx` is already migrated to `resolveAuthenticatedDestination` and redirects existing members to their governed operating surface.
- `app/onboarding/actions.ts` already fails closed on membership lookup errors and uses `resolveAuthenticatedDestination` for existing members and after successful organization bootstrap.
- `app/(workspace)/dashboard/page.tsx` is already a compatibility entry point only. It calls `requireWorkspace()` and redirects through `workspaceHomeForRole(membership.role)`; do not delete it merely to eliminate the string `/dashboard`.
- Platform authority is already structurally separated from tenant authority in `supabase/migrations/20260926100000_add_platform_control_plane.sql`: identities live in `private.platform_operators`, `private.has_platform_role(...)` checks the authenticated user against explicit platform roles, and `get_platform_company_overview()` raises `platform authorization required` unless that guard passes.
- `supabase/tests/platform_control_plane.sql` already includes behavioral authorization evidence: an active platform owner is authorized; a disabled platform operator is denied; an ordinary authenticated tenant identity has no platform role and cannot execute the platform overview RPC. Preserve and rerun these tests; do not reinvent the authority model unless a failing test exposes a defect.
- `app/platform/export/route.ts` already handles failed platform overview authorization as HTTP 403. This is a useful behavior reference for the platform page.
- `app/auth/recovery/route.ts` already uses fixed same-origin recovery destinations (`/reset-password` and `/forgot-password?...`) and does not accept arbitrary return URLs. Use it as a local security-pattern reference; do not blindly copy logic that does not match confirmation semantics.
- `tests/auth-recovery.test.ts` shows the current Vitest/source-contract test style available in the repository.

## Remaining confirmed defects

1. `app/auth/confirm/route.ts` remains a real WS-A defect:
   - it accepts any `next` beginning with `/`, including protocol-relative values such as `//example.invalid`;
   - it resolves the unchecked value against `url.origin`, allowing an external redirect class;
   - it defaults to `/dashboard` instead of resolving verified identity + active membership to the governed canonical surface;
   - it does not currently prove authorization for a requested return destination.
2. `app/not-found.tsx` still links directly to `/dashboard`. This is a legacy recovery dependency; replace it with a safe recovery behavior that does not grant or infer authority.
3. `app/platform/page.tsx` still redirects to `/dashboard` when `get_platform_company_overview()` fails. The underlying RPC authorization is correct, but the UI recovery behavior incorrectly turns a Platform Control Plane denial/failure into tenant navigation.

## Completed `/dashboard` branch-local classification

Do not waste execution time mass-replacing `/dashboard` strings.

### Approved compatibility behavior — keep and test

- `app/(workspace)/dashboard/page.tsx`: compatibility entry point; role-aware redirect through `requireWorkspace()` + `workspaceHomeForRole`.
- `e2e/launch-flow.spec.mjs`: intentionally navigates to `/dashboard` and asserts redirect to `/command`; this is regression coverage for the compatibility contract.

### Cache invalidation only — not an authorization dependency

The following branch-local `/dashboard` references are `revalidatePath("/dashboard")` calls after tenant-authorized mutations. They do not redirect users or grant access. Treat them as legacy cache invalidation that can be cleaned only if required by Next guidance/behavior; they are not WS-A authorization blockers by themselves:

- `app/(workspace)/actions.ts`
- `app/(workspace)/follow-ups/assignment-actions.ts`
- `app/(workspace)/follow-ups/escalation-actions.ts`

All of those mutation flows already obtain tenant/role context through `requireWorkspace()` and explicit `organization_id` scoping; follow-up assignment/escalation also checks role and target membership inside the active organization.

### Real legacy recovery dependencies — replace

- `app/auth/confirm/route.ts`
- `app/not-found.tsx`
- `app/platform/page.tsx`

## Known completed portions — do not redo

Do not spend execution time re-implementing these unless regression evidence proves they are broken:

1. Typed organization role/surface contract.
2. Password sign-in -> governed workspace resolver.
3. Onboarding page -> governed workspace resolver.
4. Onboarding create-organization flow -> fail-closed membership check + governed resolver.
5. `/dashboard` route -> compatibility-only role redirect.
6. Role-aware sidebar home/navigation contract.
7. Server-side role gating for `/command` and `/work`.
8. Tenant-scoped read-only `/insights` surface.
9. Separate Platform Owner/Operator authority model at the database/RPC boundary, including existing positive/negative SQL authorization tests.
10. Existing commercial E2E regression that proves `/dashboard` compatibility redirect for an owner path.

These are source-verified only, not exact-candidate runtime-certified.

## Remaining implementation scope

Read applicable nested `AGENTS.md` files and the installed Next.js guide required by root `AGENTS.md` before changing application code. Reuse existing routing/authorization contracts rather than creating a competing role model.

1. Fix `app/auth/confirm/route.ts`:
   - verify OTP;
   - resolve the authenticated identity after verification;
   - compute the governed canonical destination through `resolveAuthenticatedDestination`;
   - define an explicit allowlist/authorization rule for any supported return destination;
   - reject absolute external URLs, protocol-relative URLs, malformed paths, unauthorized workspace paths, encoded bypasses and redirect loops;
   - no arbitrary destination may bypass the role/surface contract;
   - identity or membership lookup failure must fail closed;
   - no `/dashboard` default is needed once the canonical governed destination is computed.
2. Replace `app/not-found.tsx -> /dashboard` with a safe non-authorizing recovery behavior. A public/home/login-compatible recovery is safer than guessing the user's tenant role from a static 404 component; follow the installed Next guidance and existing app error conventions.
3. Replace `app/platform/page.tsx` RPC-error fallback to `/dashboard` with an explicit denied/error/recovery state or route appropriate for failed Platform Control Plane authorization. Keep the database/RPC authority boundary unchanged.
4. Add deterministic unit/source tests for the pure role/surface contract and auth-confirm destination safety where feasible. Prefer extracting pure destination validation logic if that improves testability without creating a competing routing contract.
5. Add/extend browser or route-level evidence for role routing and auth confirmation behavior. Keep the existing `/dashboard -> /command` owner compatibility assertion.
6. Extend Platform Control Plane SQL tests only if necessary to make tenant owner/admin/manager negative cases explicit. Existing ordinary-tenant negative coverage is already present.
7. Add cross-tenant negative evidence at server/database boundaries required by the WS-A exit gate; redirects alone are not sufficient.
8. Preserve underlying commercial data and supporting CRM primitives while removing only actual generic-dashboard coupling.

## Required acceptance matrix

### Role/surface routing

- owner -> `/command`
- admin -> `/command`
- manager -> `/command`
- agent -> `/work`
- viewer -> `/insights`
- unknown role -> fail-safe non-management surface (`/insights` under the current pure contract)
- no active membership -> `/onboarding`
- membership lookup error -> error/fail closed, never fabricated access

### Surface authorization

- agent cannot remain on `/command`
- viewer cannot remain on `/command`
- viewer cannot remain on `/work`
- management users retain `/command`
- all workspace data queries remain tenant-scoped / RLS-protected

### Platform authority

- active explicit platform role -> allowed according to role contract
- disabled platform operator -> denied
- ordinary tenant identity -> denied
- tenant owner/admin/manager alone -> denied platform authority
- platform authorization failure never silently becomes tenant authority

### Auth confirmation

Test at minimum:

- valid token + existing active member -> canonical governed surface
- valid token + no active membership -> onboarding
- invalid token -> login failure state
- expired token -> login failure state
- identity resolution failure -> fail closed
- membership lookup failure -> fail closed
- no `next` -> canonical governed destination, not `/dashboard`
- approved internal return destination (only if product contract intentionally supports one) -> allowed only when authorized
- external absolute URL -> rejected
- protocol-relative URL -> rejected
- malformed URL/path -> rejected
- unauthorized workspace path -> rejected/falls back to canonical destination
- redirect loop target -> rejected
- relevant percent-encoded bypass attempts -> rejected

### Recovery/error behavior

- 404 recovery does not grant or infer workspace authority
- Platform Control Plane authorization failure is explicit and does not redirect to `/dashboard`
- existing password recovery callback remains same-origin and regression-safe

## Exact repository gates — no discovery needed

Use the repository scripts/workflows as source of truth.

### Quality gate

Equivalent local sequence:

```bash
npm ci
npm audit --audit-level=high
npm run verify
```

`npm run verify` is exactly:

```bash
npm run typecheck && npm run lint && npm test && npm run build
```

Do not use `npm audit fix --force` and do not suppress a high-severity audit failure.

### Database gate

Equivalent workflow sequence:

```bash
supabase start
supabase db reset
supabase migration list --local
supabase test db
supabase stop --no-backup
```

This must replay migrations from zero and run all database tests on the exact candidate.

### Local production E2E gate

The repository workflow already defines the exact shape:

1. `npm ci`
2. `supabase start`
3. `supabase db reset`
4. export local Supabase public/secret credentials to Next env
5. `npm run build`
6. install isolated Playwright runner under `e2e/`
7. install Chromium
8. start production server with `npm run start -- --hostname 127.0.0.1`
9. run `e2e/launch-flow.spec.mjs`
10. stop app + Supabase

Extend the E2E set for WS-A role/auth-confirm cases rather than replacing the existing commercial flow.

## Required acceptance evidence before WS-A closure

- Cross-role positive and negative tests for owner/admin/manager/agent/viewer/unknown plus separate Platform Owner authority.
- Cross-tenant negative tests at applicable server/database boundaries; redirects alone are not authorization evidence.
- Auth confirmation safety matrix above.
- Regression coverage for login/onboarding and affected server-action follow-up destinations.
- Existing platform-control SQL authorization tests rerun on the exact candidate; extend only where the acceptance matrix is not explicit enough.
- `/dashboard` remains compatibility-only and cannot bypass role or tenant authorization.
- Arabic RTL, Turkish/English LTR, keyboard/focus/semantics, responsive and truthful loading/empty/denied/error states for touched surfaces.
- Quality, Database, Security and E2E gates all pass on the exact candidate.
- Independent verifier compares implementation + tests + evidence against `docs/workstreams/WS-A_PRODUCT_SHELL_ROLE_CONTRACT.md` and attempts to falsify closure.
- No merge until every applicable gate is satisfied. No commercial-readiness claim without required production evidence.

## Execution shortcut for Codex Local/Cloud

Do **not** restart broad discovery.

Start from the current branch head containing this packet, then:

1. read the installed Next.js documentation mandated by `AGENTS.md`;
2. inspect only the three confirmed application defects plus any files directly required by their tests;
3. do not rework login, onboarding, dashboard compatibility, sidebar routing, existing role shells, mutation authorization, or the platform-operator database authority model without regression evidence;
4. implement remaining fixes;
5. run the exact gates above;
6. fix only failing root causes;
7. run independent verification;
8. if WS-A closes, continue immediately to WS-B Revenue Graph according to `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`.

## Current external blocker

This chat can inspect and write GitHub files but cannot read the repository's installed `node_modules/next/dist/docs/` or execute the local build/database/browser test stack. Root `AGENTS.md` explicitly requires reading the installed Next guides before application-code changes, so application-code edits and runtime certification remain for Codex Local/Cloud.

This document is an optimized execution handoff, not a claim that WS-A is closed.
