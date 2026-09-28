# SatışDesk — Commercial Product Roadmap & Execution Contract

Status: ACTIVE SOURCE OF TRUTH
Owner: Platform / Product Engineering
Execution rule: CLOSE ONE WORKSTREAM END-TO-END BEFORE STARTING THE NEXT.

## 1. Product North Star

SatışDesk is a WhatsApp-first, AI-native Sales Operating System for Turkish SMBs and regional teams selling through WhatsApp, phone, social channels and direct follow-up.

Core commercial loop:

Lead → Conversation → Qualification → Next Action → Follow-up → Quote → Appointment → Deal → Outcome → Analytics → AI Next Action

Every feature must strengthen this loop. No isolated screens, decorative AI, dead routes, or unconnected features.

## 2. Product Principles

1. Turkish-first, Arabic/English-ready.
2. WhatsApp-first sales execution, not generic CRM data storage.
3. Every active lead/deal must have owner, state and next action.
4. AI assists decisions and data entry; deterministic authorization/business rules remain authoritative.
5. Tenant isolation and least privilege are non-negotiable.
6. Platform Owner manages SaaS metadata/lifecycle without unrestricted tenant customer-content access.
7. All critical mutations require auditability.
8. Export/print obey the same RBAC/RLS as UI/API access.
9. Production READY is not Commercial GO. GO requires end-to-end production certification.
10. Do not add unrelated features while a launch blocker is open.
11. Compete on quality, security, reliability and measurable value, not lowest price.
12. Platform Owner access is platform governance and does not require a customer subscription.

## 3. Competitive Direction

Adopt proven patterns without cloning products:

- Pipedrive: next-activity discipline, pipeline clarity, sales execution and AI-connected workflows.
- Kommo: messaging/WhatsApp-first selling and conversational qualification.
- Zoho CRM: workflow governance, cadences, scoring and operational analytics.
- Turkish CRM/ERP products: local workflow expectations, quotes, PDF/print/export and practical SMB operations.

SatışDesk differentiation target:

**WhatsApp-first + Turkish-first + AI-native + simple SMB operation + strong owner control plane + auditable multi-tenant security.**

Commercial positioning: premium-value operational SaaS. Pricing is value-based and cost-aware; SatışDesk does not compete primarily by being the cheapest option.

## 4. Execution State Machine

Each workstream moves only through:

BACKLOG → ACTIVE → IMPLEMENTED → TESTED → PREVIEW_CERTIFIED → MERGED → PRODUCTION_CERTIFIED → CLOSED

A workstream cannot be CLOSED if any required gate is missing.

---

# WS7 — COMMERCIAL V1 / PLATFORM CONTROL PLANE CLOSURE

Priority: P0
Status: ACTIVE
Active PR: #20 (MERGED); security hardening PR #22 (MERGED)

## Scope

- Platform Owner access and authorization contract.
- Ordinary tenant users denied `/platform` and privileged exports.
- Platform company/subscription metadata overview.
- CSV export with authorization boundary.
- Print / Save-as-PDF workflow.
- Duplicate-tenant prevention / idempotent onboarding.
- Subscription/company lifecycle visibility.
- Platform Owner does not require a customer subscription.
- Proven test-tenant cleanup only; preserve real owner tenant.
- Production auth recovery and email-verification smoke tests.
- Tenant/RBAC isolation regression tests.

## Required tests

- Platform owner positive authorization test.
- Ordinary authenticated tenant negative authorization test.
- Anonymous negative authorization test.
- `/platform/export` positive + negative authorization tests.
- CSV headers/content boundary test: platform metadata only.
- Print control functional smoke test.
- Duplicate onboarding retry/double-submit test.
- Quality gate.
- Database/migration replay gate.
- Local/browser E2E gate.
- Production runtime/error smoke test after merge.

## Definition of Done

All tests pass; PR merged; Vercel Production maps to merge SHA; no blocking build/runtime errors; production owner flow works; unauthorized flows fail closed; tenant isolation passes; subscription lifecycle has no launch-blocking unknown state. A null customer subscription on the Platform Owner governance identity is valid and is not a launch blocker.

---

# WS8 — SALES EXECUTION ENGINE

Priority: P1
Status: BACKLOG — DO NOT START BEFORE WS7 CLOSES

## Goal

Make SatışDesk drive daily sales work rather than merely store CRM records.

## Scope

- Mandatory Next Action for active opportunities where appropriate.
- Follow-up date/time and responsible owner.
- Stale lead/deal detection.
- Overdue follow-up queue.
- Today / Next / Overdue workspace.
- Escalation rules for unattended valuable leads.
- Lost-reason taxonomy.
- Sales velocity and stage aging.

## Done

A manager can answer: who needs action now, what is overdue, what is at risk, why deals are lost, and who owns every action.

---

# WS9 — WHATSAPP / OMNICHANNEL SALES WORKSPACE

Priority: P1
Status: BACKLOG

## Goal

Turn incoming conversations into controlled sales execution.

## Scope

- WhatsApp conversation → lead/contact/deal linkage.
- Conversation ownership and assignment.
- Qualification fields captured from conversation.
- Approved templates and follow-up actions.
- Appointment/quote creation from conversation context.
- Instagram/social ingestion only after WhatsApp path is production-stable.
- Full audit trail for automated/agent actions.

## Done

A lead can travel from inbound conversation to qualified opportunity and next action without fragmented manual copying.

---

# WS10 — PROFESSIONAL QUOTES & COMMERCIAL DOCUMENTS

Priority: P1
Status: BACKLOG

## Scope

- Branded quote builder.
- Products/services/quantity/tax/discount totals.
- Quote lifecycle: draft → sent → viewed/accepted/rejected/expired where technically supportable.
- PDF generation/print.
- WhatsApp/email delivery integration.
- Deal linkage and audit history.
- Permission-controlled export.

## Done

A salesperson can create and send a professional quote from the deal and management can track its commercial outcome.

---

# WS11 — MANAGER INTELLIGENCE

Priority: P1/P2
Status: BACKLOG

## Scope

- Conversion by source, owner and stage.
- Response/follow-up latency.
- Stage aging and sales velocity.
- Lost reasons.
- Funnel and forecast.
- Campaign/source quality when attribution exists.
- Team performance with privacy-safe metrics.

## Done

Management can identify bottlenecks and sales leakage without exporting raw data for basic analysis.

---

# WS12 — AI SALES COPILOT

Priority: P2
Status: BACKLOG

## Guardrail

AI must solve measurable sales work; no decorative chatbot.

## Scope

- Conversation/meeting summaries.
- Suggested CRM field updates requiring policy-appropriate confirmation.
- Lead qualification assistance.
- Suggested reply.
- Next-best-action recommendation.
- Deal-risk signals.
- Follow-up drafting.
- Manager digest: unattended leads, expiring quotes, falling response rates, pipeline risk.
- Prompt/model evaluations before production promotion.

## Done

AI reduces manual CRM work and missed follow-ups with measurable quality and safe failure modes.

---

# WS13 — AUTOMATION / CADENCES / BLUEPRINTS

Priority: P2
Status: BACKLOG

## Scope

- Follow-up cadences.
- Trigger → condition → action automation.
- Required-stage fields and transition rules.
- Human approval for high-impact actions.
- Rate limiting/idempotency.
- Audit log and replay-safe execution.

## Done

Repeatable sales processes can be enforced without unsafe or duplicate automated actions.

---

# WS14 — INTEGRATION & AI ACCESS LAYER

Priority: P3
Status: BACKLOG

## Scope

- Stable API contracts.
- Webhooks.
- Scoped integration tokens.
- MCP-compatible access only after API/RBAC/audit contracts are stable.
- Read/write scopes, approvals and audit trail.
- External AI must never bypass tenant boundaries.

## Done

Authorized external tools can perform controlled CRM operations with the same policy guarantees as first-party UI.

---

# WS15 — COMMERCIAL PRICING & BILLING CONTROL PLANE

Priority: P1/P2
Status: BACKLOG — COMMERCIAL DEVELOPMENT PHASE; DO NOT INTERRUPT ACTIVE LAUNCH CLOSURE

## Goal

Give Platform Owner governed control of plans, services, add-ons, prices and customer subscriptions without requiring a code deployment, backed by market evidence and unit economics.

## Pricing strategy

Use **Value-Based + Cost-Aware Pricing**:

Base Plan + included capacity + Add-ons + Usage + contract term + governed volume discounts.

Dynamic intelligence is recommendation-only in the first phase. Customer billing remains deterministic, explainable and owner-controlled.

## Platform Owner capabilities

- Create/edit plans and monthly/annual prices.
- Configure currencies, included users, limits and entitlements.
- Create/edit services and add-ons and attach them to plans.
- Publish/hide/archive plans and services without destructive deletion.
- Mark plans public, private, custom or internal.
- Configure trials and approved promotional periods.
- Assign/change customer-company subscriptions with explicit confirmation and audit history.
- Preserve effective dates and historical contracted prices.
- View tenant commercial state without requiring Platform Owner itself to have a subscription.

## Smart Pricing Engine

Where measurable, recommendations consider users, WhatsApp/Meta/channel costs, AI usage/cost, automations, storage/infrastructure, branches/teams, support level, add-ons, integrations, contract duration and approved volume discounts.

Platform Owner intelligence should show estimated cost-to-serve, MRR/ARR, effective price, gross margin, usage versus limits, recommended plan/add-on/price action, minimum safe-price guardrail, and explanation.

**Phase 1: engine recommends; Platform Owner approves. No autonomous price or billing mutation.**

## Market & Unit Economics Gate

Before public pricing is certified:

1. Benchmark relevant Turkish and global CRM/omnichannel/WhatsApp-first competitors.
2. Calculate real cost-to-serve including Supabase, Vercel, AI, WhatsApp/Meta, email, storage, automation, support, payment fees, taxes and other material variable costs.
3. Model economics at 10 / 100 / 1,000 paying tenants and representative usage bands.
4. Define target gross-margin floor and overage/add-on economics.
5. Validate willingness-to-pay and value positioning for target Turkish SMB segments.
6. Approve final plans/prices through Platform Owner governance.

Existing database plan prices remain provisional until this gate is complete.

## Safety

- Database/control plane is commercial source of truth; avoid duplicated hardcoded prices.
- All catalog and price mutations are RBAC-protected and audited.
- Ordinary tenants cannot mutate catalog pricing.
- Existing customer prices cannot silently change.
- No pricing based on protected/sensitive attributes.
- No irreversible billing action without explicit authorization.
- Usage metering must be idempotent and reconciled before affecting billing.

## Done

Platform Owner can safely govern catalog and customer subscriptions; pricing recommendations are cost-aware, value-aware, explainable and non-autonomous; public prices are supported by market study and unit economics; historical pricing and entitlement/billing boundaries are tested in Production.

---

# WS16 — UNIFIED EXPORT & REPORTING CONTRACT

Priority: P1/P2
Status: BACKLOG — APPLY INCREMENTALLY TO RELEVANT WORKSTREAMS

## Goal

Any authorized user who can legitimately work with a report or dataset can export or print that permitted data in useful professional formats without bypassing tenant or role boundaries.

## Contract

Relevant data/report screens should provide, where appropriate:

- Real Excel `.xlsx` output, not a CSV merely labelled Excel.
- CSV for interoperable raw/tabular workflows.
- Print / Save-as-PDF for human-readable reports.

Exports must contain only the same authorized data scope available to that user under RLS/RBAC. Export is never an alternate authorization path.

## Excel quality

- Structured, useful column names.
- Correct numeric/date cell types where applicable.
- Stable ordering and machine-usable values.
- No UI-only decoration mixed into raw datasets.
- Clear report/sheet naming.
- Tenant/report/date context where useful.

## Role scope

- Employees export only data allowed by their role and tenant.
- Managers export only authorized team/company reports.
- Platform Owner exports platform metadata and commercial/operational information allowed by Platform policy, not unrestricted tenant customer content.

## Target surfaces

Apply progressively to CRM customers, leads, deals/opportunities, appointments, sales reports, quotes/documents, subscription/commercial reports and Platform Owner control-plane reports as those surfaces mature.

## Required tests

- Positive export authorization per supported role.
- Ordinary tenant/anonymous negative cases for privileged exports.
- Cross-tenant denial.
- XLSX opens as a valid workbook and contains expected typed cells/headers.
- CSV boundary/content tests.
- Print/PDF functional smoke tests.
- Large-report limits/timeouts handled safely.
- Formula-injection-safe CSV/XLSX string handling where applicable.

## Done

Authorized users can reliably download/work with permitted data in XLSX/CSV and print/save appropriate reports as PDF, with no authorization widening or cross-tenant leakage.

---

# 5. Commercial Launch Gates

Commercial GO requires all P0 gates:

- Auth signup/login/email verification/recovery PASS.
- Onboarding PASS and idempotent.
- Tenant isolation PASS.
- Role boundaries PASS.
- Platform Owner control plane PASS.
- Current WS7 export/print authorization PASS.
- Subscription/company lifecycle has a valid commercial state; Platform Owner governance identity is exempt from customer-subscription requirements.
- Required migrations applied and replay-tested.
- Quality/DB/E2E gates PASS on merge candidate.
- Production deployment maps to certified SHA.
- Production runtime smoke PASS.
- No known P0 security/payment/data-loss blocker.

## Verdict language

- GO: all required launch gates passed.
- CONDITIONAL GO: only explicitly accepted non-P0 limitations remain.
- NO-GO: any P0 gate is failing, unverified, or unsafe.

# 6. Autonomous Execution Rules

For every run:

1. Read this roadmap and current PR/workstream state.
2. Resume the highest-priority ACTIVE workstream; never restart audit from zero.
3. Reproduce the current blocker with evidence.
4. Implement the smallest coherent fix.
5. Add/strengthen automated regression coverage for the defect or authorization contract.
6. Run required gates.
7. If Preview fails, fix there; do not touch Production.
8. Merge only when required gates pass.
9. Verify Production against the exact merge SHA.
10. Close the workstream only after production certification.
11. Then activate the next workstream.

Stop and require explicit approval only for destructive production data changes, privilege escalation not previously approved, secrets/credential changes, irreversible billing actions, or materially expanded product scope.

# 7. Current Execution Order

1. WS7 — Commercial V1 / Platform Control Plane Closure (ACTIVE)
2. WS8 — Sales Execution Engine
3. WS9 — WhatsApp / Omnichannel Sales Workspace
4. WS10 — Professional Quotes & Commercial Documents
5. WS11 — Manager Intelligence
6. WS12 — AI Sales Copilot
7. WS13 — Automation / Cadences / Blueprints
8. WS15 — Commercial Pricing & Billing Control Plane
9. WS16 — Unified Export & Reporting Contract
10. WS14 — Integration & AI Access Layer

WS15 and WS16 capture the agreed commercial pricing and universal reporting/export direction. They must not interrupt WS7 closure; relevant export requirements may be implemented incrementally when a workstream already touches that surface.

This file is the execution roadmap. Update statuses and evidence as workstreams progress; do not silently redefine Done criteria to make a failing gate pass.
