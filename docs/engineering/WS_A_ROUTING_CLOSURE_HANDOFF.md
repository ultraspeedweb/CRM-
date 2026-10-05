# WS-A routing closure handoff

Status: BLOCKED; implementation and verification pending.
Inspected baseline: 3520f474805c4e36479afde6f522930e7c09e7c3.
Branch: feat/autonomous-revenue-os-foundation-20261004.

## Approved outcome

Preserve SatışDesk as a Governed Autonomous Revenue & Growth OS. Authenticated users land in their authorized operating surface, and tenant membership never grants Platform Owner authority. Complete WS-A before expanding into Revenue Graph and Goal Intelligence.

## Evidence from inspected files

- lib/workspace-routing.ts resolves active membership by user_id and status, propagates query errors, routes users without membership to onboarding, and delegates role routing to workspaceHomeForRole.
- app/auth/confirm/route.ts still defaults to /dashboard. Its startsWith("/") check accepts protocol-relative destinations such as //example.invalid; resolving these against an origin can produce an external redirect.
- app/not-found.tsx still links to /dashboard.
- These findings are source review, not runtime verification or an exhaustive reference inventory.

## Implementation scope and contract

Inspect the existing WS-A contracts and affected nested AGENTS files first; reuse them rather than creating a competing role model.

1. Inventory internal /dashboard references on this branch, including auth confirmation, server actions, follow-up redirects, navigation and not-found. Distinguish compatibility entry points from internal dependencies.
2. Centralize post-auth destination decisions in the existing routing contract using verified identity and active tenant membership.
3. Define allowed return destinations from the existing route/permission contract. Reject external, protocol-relative, malformed and unauthorized destinations; avoid routing loops. Preserve intentional authorized recovery flows.
4. Propagate membership lookup failures as errors, never fabricate membership or access.
5. Enforce Platform Owner authorization through a separate server-side authority contract. Tenant owner/admin/manager membership is insufficient.
6. Replace internal legacy dependencies while preserving approved compatibility behavior and underlying commercial data.
7. Keep loading, empty, denied and error states truthful; use real governed data and no fabricated KPIs.

## Required acceptance evidence

- Cross-role positive and negative tests for owner/admin/manager/agent/viewer/unknown and separate Platform Owner authority.
- Cross-tenant negative tests at applicable server/database boundaries; redirect behavior alone is not authorization.
- Authentication confirmation tests for invalid/expired tokens, identity resolution, membership errors, legacy defaults and unsafe return URLs.
- Regression coverage for affected server actions and follow-up destinations.
- Arabic RTL, Turkish/English LTR, keyboard/focus/semantics, responsive and no-fake-KPI verification.
- Database, Quality, Security and E2E gates on the exact candidate; dependency security remains fail-closed without force or bypass.
- Independent verifier compares implementation and evidence against WS-A acceptance criteria.
- No merge until every applicable gate is satisfied. No commercial-readiness claim without required production evidence.

## External execution blocker and next step

The current chat exposes GitHub file operations but no local terminal/filesystem execution tool. No installed Next documentation, build, database or browser tests were run. AGENTS.md requires reading the installed Next guides before application code changes.

Resume in an execution-enabled checkout at the current branch HEAD, read the relevant node_modules/next/dist/docs guides and existing WS-A contracts, inventory references, implement the scoped fixes, run exact-candidate gates and obtain independent verification. This document is a handoff, not WS-A closure.
