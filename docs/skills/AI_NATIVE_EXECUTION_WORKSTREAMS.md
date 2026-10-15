# SatışDesk — Revenue OS Execution Workstreams

Canonical references: docs/SATISDESK_PRODUCT_MASTER_PLAN.md, docs/SATISDESK_PRODUCT_ROADMAP.md, docs/SATISDESK_REVENUE_OS_PLAN.md.
Do not replace or downgrade these existing plans.
# AI-Native Product Execution Contract — 2026-10-15

Status: PLANNED / NOT PRODUCTION-CERTIFIED. Documentation-only extension to the existing master plan, not a replacement.

## Governance and precedence
1. Product Master Plan and existing active launch workstreams remain authoritative.
2. This document connects approved capabilities to verifiable slices; does not authorize Production changes.
3. One slice at a time: INVENTORY -> GAP -> DESIGN -> IMPLEMENT -> TEST -> STAGING E2E -> INDEPENDENT VERIFY -> APPROVE -> MERGE -> PRODUCTION CERTIFY -> CLOSED.
4. Each slice records owner, source-of-truth path, existing code/PR, dependencies, risk, acceptance tests, release SHA, evidence links, operations manual and rollback.
5. A change in an existing capability updates its canonical workstream instead of creating a duplicated product subsystem.

## Reusable skill contract
Skill format: Trigger -> Inputs -> Evidence retrieval -> Plan -> Policy -> Tool execution -> Independent verification -> Audit/outcomes -> Failure recovery.
Each skill declares required tools, permission scopes, approval boundaries, idempotency, timeout/retry, tests, metrics, cost budgets, prompt injection safety, tenant isolation, human handoff and rollback.
Skill status labels: PLANNED / IMPLEMENTED / STAGING_VERIFIED / PRODUCTION_CERTIFIED; never infer completion from a plan.

## Universal architecture
Project/Business Truth -> Canonical events -> Evidence-grounded Context -> Agent planner/model router -> Policy firewall -> Scoped tools and durable workflows -> Verifier -> Outcome ledger -> Evaluation and learning.
Local models only after hardware suitability, privacy and measured task benchmarks; cloud model fallback must obey the same policies.
Human-in-the-loop and break-glass access must be explicit and fully audited.

## Cross-product boundary
Garfix and SatışDesk remain independent SaaS products with separate auth, tenants, data, databases, secrets, billing and policies. Integrate only via versioned narrow APIs and tenant-authorized tokens, not direct cross-project DB access. Sovereign and commerce integrations follow each project's domain rules.

## Canonical business operating logic
GOAL -> DIAGNOSE -> PLAN -> POLICY/APPROVAL -> EXECUTE -> MEASURE -> LEARN -> REPLAN.
Customer/channel -> identity resolution -> Customer 360 -> lead/opportunity -> owner & next action -> quote -> order -> authorized payment -> gross margin -> goal contribution.
Owner/employee/customer/platform surfaces remain distinct.

## Ordered slices mapped to existing roadmap
- SD-P0 COMMERCIAL-CLOSURE: Complete active WS7 and launch gates: auth, owner control plane, subscription boundaries, roles/RLS, exports, production deployment parity, staging/live E2E. No new features added to current launch candidate.
- SD-1 SALES-EXECUTION: WS8. Today/Next/Overdue, every actionable deal owned, SLA, stage aging, velocity, lost reasons. Acceptance: manager can act directly; role-scoped E2E and persisted updates.
- SD-2 OMNICHANNEL-CUSTOMER360: WS9, existing WhatsApp webhook first; verify outbound, signatures, consent, dedup, 24-hour rules, threading and handoff with real Meta test in Staging; Instagram only after WhatsApp reliability. Acceptance: inbound to qualified lead and assigned follow-up without data loss or duplicate sends.
- SD-3 COMMERCE-QUOTE: WS10 + master plan product/inventory/order model. Test authoritative stock/price/tax/discount, role approvals, PDF, order/quote history, payment webhook; no AI financial authority.
- SD-4 REVENUE-GRAPH-GOALS: master plan Goal Engine + Manager Intelligence WS11. Canonical attribution from source through margin, funnel, forecasts, scenario analysis. Acceptance: KPIs reconcile to source records; forecasts identified as uncertain; no causality claims absent evidence.
- SD-5 AI-REVENUE-AGENTS: WS12, WS13. Sales copilot, revenue analyst, inventory intelligence, manager assistant, automation. Phase: shadow -> approval required -> narrow scoped auto-execution after evaluation. Tests: fabricated pricing, wrong tenant, prompt injection, action replay, escalations.
- SD-6 PLATFORM-COMMERCIAL: WS15/16, plan entitlements, pricing governed by owner, usage/cost metering, white-label and export boundaries. Acceptance: no silent historical contract modification or privilege escalation.
- SD-7 INTEGRATION-MARKETPLACE: WS14; external store/connectors/agent skills only after API/RBAC/audit contracts, with reliability and per-tenant isolation tests.

## Skills registry
- customer-identity-resolution (CRM account scope; no cross-tenant merge)
- omnichannel-sales-intake (signed webhooks; consent and reply-window rules)
- lead-qualification-and-next-action (evidence-linked and explainable)
- quote-to-order-and-payment (deterministic price/stock/payment authority)
- revenue-goal-diagnosis (source-reconciled metrics and scenario estimates)
- governed-campaign-and-followup (opt-in, templates, throttles, opt-out)
- platform-commercial-governance (owner approval, billing history, metering)
- verified-action-outcome (attribution with causal caveats and rollback)

## First executable slice
Before new code, inventory current WS7 launch gates and latest release evidence; attach current failing test/log to each blocker, fix only those blockers, rerun CI/DB/browser E2E. No unrelated architecture or features.
