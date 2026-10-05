# SatışDesk — Contract-First Delivery & Independent Verification Skill

Status: MANDATORY for new workstreams and material changes

## Purpose

Reduce rework and prevent scope drift by forcing implementation to begin from an explicit contract and end with independent evidence rather than developer self-certification.

## Before implementation

For the active workstream, record:
- Workstream ID and milestone.
- Business outcome.
- In-scope modules/files.
- Data contract and source of truth.
- Role/permission/RLS contract.
- UX states: loading, empty, error, denied, processing, success.
- Events/actions produced or consumed.
- Acceptance criteria and exit gate.
- Required deterministic tests, E2E and security checks.
- Explicit out-of-scope items.

Do not broaden implementation beyond this contract unless the owner/product source of truth is intentionally updated.

## Database / RLS migration gate

Any migration affecting tenant/business data must verify:
- organization/tenant ownership and foreign-key relationships.
- RLS enabled where required.
- deny-by-default policy behavior.
- owner/admin/manager/agent/viewer access expectations.
- cross-tenant negative cases.
- SECURITY DEFINER search_path and privilege safety.
- service-role usage is justified and not exposed client-side.
- indexes for new foreign keys/filter paths where required.
- no destructive change without explicit migration/rollback strategy.
- existing data/backfill behavior is defined.

## Product Design QA gate

For UI work verify:
- role/job-first information architecture.
- Signal -> Insight -> Decision -> Action -> Verified Result path.
- real governed data; no fake KPI theater.
- responsive desktop/tablet/mobile.
- Arabic RTL and Turkish/English LTR.
- keyboard/focus/semantic accessibility.
- loading/empty/error/permission/processing/success states.
- usable tables/charts on smaller screens.
- drill-down to evidence where required.
- UI hiding is never the authorization mechanism.

## Business Event Standard

Material business events should use stable names and carry only necessary governed identifiers/metadata.

Initial taxonomy:
- goal.created / goal.updated / goal.status_changed
- recommendation.issued / recommendation.approved / recommendation.rejected
- action.started / action.completed / action.failed / action.verified
- followup.created / followup.completed / followup.overdue
- quote.sent / quote.accepted / quote.rejected
- order.created / order.won / order.cancelled
- stock.risk_detected / stock.replenished
- outcome.recorded / outcome.verified

Every event should be attributable where applicable to organization, actor/agent, source record, timestamp and correlation/action id. Do not put secrets or unrestricted customer content in telemetry.

## Golden Path E2E

The differentiated product gate is:

Owner sets target -> trajectory/gap calculated -> operational driver identified -> employee receives prioritized action -> employee completes action -> outcome is recorded -> business/goal state updates -> owner sees verified progress.

This test becomes a commercial gate as its dependent workstreams become implemented. Do not fake future stages merely to make the scenario green.

## Independent Verifier protocol

The verifier must evaluate evidence, not implementation intent:
1. Compare code against workstream contract.
2. Check permissions and tenant isolation.
3. Check deterministic calculations/business rules.
4. Check critical UX states and localization.
5. Check regression impact.
6. Check security/quality gates.
7. Check E2E evidence.
8. Check that claimed outcomes are observable from real data.
9. Return PASS, FAIL or BLOCKED with exact evidence.

The builder must not mark its own work commercially certified without verifier/gate evidence.

## AI / Revenue Intelligence eval harness

When AI intelligence becomes active, maintain fixed evaluation scenarios for at least:
- goal behind plan.
- high revenue but low margin product.
- high margin growth opportunity.
- stock-out risk on a winning product.
- overdue high-value opportunities.
- weak conversion/slow response employee pattern.
- strong revenue but weak channel profitability.
- conflicting/insufficient evidence.

Score correctness, evidence grounding, unsafe overclaiming, permission compliance and recommended-action quality. Never claim causation from sequence alone.

## Feature Flag / Capability Registry contract

New sellable or optional capabilities should have a stable capability id and support tenant entitlement/enablement rather than scattered hard-coded checks. Do not implement a full registry until its workstream requires it, but do not introduce incompatible one-off feature flags.

## Connector SDK contract

New external connectors should converge on a reusable contract covering authentication, webhook verification, idempotency, mapping, sync state, retry/backoff, rate limits, health/observability and tenant-safe secrets. Implement the SDK when WS-K begins; until then avoid hard-coding new provider behavior into unrelated core modules.

## Garfix execution protocol

Reusable autonomous execution follows:
Planner -> Policy/Approval -> Executor -> Independent Verifier -> Recovery/Handoff -> Outcome.

SatışDesk may adopt this contract progressively but must not embed Garfix as an uncontrolled monolith or allow agents to self-expand authority.

## Definition of verified

A change is VERIFIED only when the applicable contract, tests, security checks, UI/UX gate and evidence are all satisfied. Documentation alone is not verification.