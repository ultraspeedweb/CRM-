<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SatışDesk — Mandatory Agent & Contributor Execution Contract

This file is the mandatory entry point for every AI agent, coding assistant, developer, contractor, reviewer or automation that changes SatışDesk.

## Read Before Work

Before planning or changing application code, read in this order:

1. `docs/SATISDESK_PRODUCT_MASTER_PLAN.md` — locked product North Star.
2. `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md` — active workstreams, dependency order, milestones and Definition of Done.
3. `docs/engineering/ENGINEERING_FOUNDATION.md` — engineering baseline.
4. Load only the task-relevant skill. For UI/UX, responsive, accessibility, forms, command centers, tables or visual changes, also load `docs/engineering/skills/WEB_UI_DESIGN_SKILL.md`. For security-sensitive work, load `docs/security/PROJECT_SECURITY_SHIELD.md`.

Do not restart broad product discovery when these sources already define the direction.

## Product Identity Is Locked

SatışDesk is **not a traditional CRM**. It is a **Governed Autonomous Revenue & Growth Operating System**.

CRM-like entities such as customers, leads, contacts and deals remain only as useful internal commercial data primitives. Do not turn them back into the product identity or spend roadmap capacity cloning generic CRM functionality.

Core loop:

**Sense -> Understand -> Predict -> Decide -> Policy/Approve -> Act -> Verify -> Learn**

User-value loop:

**Signal -> Insight -> Decision -> Action -> Verified Result**

## Scope Discipline

Every implementation task must identify:
- Workstream ID from `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`.
- Exact business problem being solved.
- In-scope files/modules.
- Acceptance criteria / exit gate.
- Required tests and security checks.

Do not add adjacent features merely because they are convenient while editing the same module.

Do not perform broad refactors, architecture rewrites, dependency migrations, cosmetic redesigns or new integrations unless required by the active workstream or separately approved.

If an unexpected issue is discovered, fix it immediately only when it blocks the active workstream, creates a security/data-integrity risk, or is a regression caused by the current change. Otherwise record/defer it and continue the active workstream.

## Explicit Anti-Scope

Unless the product North Star is intentionally amended, do not implement:
- Generic CRM clone work.
- Competitor menu parity for its own sake.
- Static dashboard/card expansion without decision/action value.
- Decorative AI chatbot features.
- Generic ERP/accounting expansion unrelated to revenue/growth outcomes.
- Autonomous high-impact actions without permission, policy, audit and verification.
- Features without a defined business problem and observable/measurable outcome where applicable.

## Workstream Dependency Order

Respect the execution plan. Current sequence:

**Wave 0:** Security Shield + verification baseline.

**Wave 1:** Product/role contract -> Revenue Graph -> Goal Intelligence -> Employee Execution Cockpit + Company Owner Growth Command Center + Platform Owner Control Plane.

**Wave 2:** Products/orders/inventory -> winning-product intelligence -> quotes/pricing/approvals.

**Wave 3:** Omnichannel -> website/store connector framework and attribution.

**Wave 4:** Decision/action engine -> AI copilot -> governed automation/agents -> scenario planning/briefings, with verifier/evals throughout.

**Wave 5:** Global scale/productization.

Do not jump to later waves merely because they are more interesting.

## Current Priority Vertical Slice

Until verified complete, prioritize this differentiated story:

**Owner sets target -> system calculates trajectory/gap -> system identifies operational drivers -> employee sees prioritized action -> action is completed -> outcome updates business state -> owner sees verified progress.**

Do not replace it with disconnected screens or generic dashboards.

## Architecture & Safety Guardrails

- Preserve multi-tenant isolation and deny by default.
- Maintain RLS and role boundaries.
- Use existing project patterns unless the active workstream requires a justified change.
- Keep business logic deterministic/testable where possible.
- UI must use real governed data; fake KPI theater is not completion evidence.
- Maintain traceability from major insights/actions to underlying records.
- AI must be tenant-scoped and permission-aware.
- Agents cannot self-expand permissions or authority.
- High-impact actions require configured approval/policy controls.
- Material actions require auditability and outcome state.
- Do not tightly couple SatışDesk product identity to Garfix internals; consume reusable mature capabilities through governed interfaces.

## Project Security Shield Is Mandatory

For touched scope, apply as relevant:
- RLS and tenant isolation.
- RBAC/ABAC.
- IDOR/BOLA and privilege-escalation defenses.
- Input/API/AI safety controls.
- Secrets/service-role/RPC safety.
- Webhook verification/idempotency.
- Dependency/secret/CI gates.
- Audit/logging/observability.

Never bypass a security gate to make a feature pass.

## Definition of Done

Do not claim completion because code or documentation exists. For applicable scope, DONE requires:
- Business acceptance criteria satisfied.
- Tenant/role authorization verified.
- Deterministic business logic tested.
- Required UI states implemented.
- Localization maintained.
- Audit/observability included for material actions.
- Relevant E2E/regression tests pass.
- Security and quality gates pass.
- Documentation/contracts updated if behavior changed.
- Production verification before claiming commercial readiness.

## Product Change Control

Explicit owner/product approval is required before implementing:
- A new major workstream.
- A new product persona/role.
- A new core module outside the master plan.
- A change to the North Star/product identity.
- A major autonomy expansion.
- Generic ERP/finance/HR/support expansion.
- An architecture/platform migration not required to resolve an active blocker.

No developer or AI agent may rewrite the North Star merely to justify its preferred implementation.

## New-Idea Rule

Classify every new idea:
- Supports active workstream -> include only if required for its exit gate.
- Fits a later existing workstream -> record/defer there; do not implement now.
- Changes product direction -> explicit approval and master-plan update first.
- Does not serve the North Star -> reject/defer.

Discussion does not automatically become implementation scope.

## Handoff Contract

Every handoff between humans/agents/tools must state only:
- Active workstream and milestone.
- Branch/PR and current HEAD.
- Verified complete work.
- Current failing/blocking item.
- Exact next executable step.
- Tests/evidence/gates.

Do not restart broad discovery if this information already exists.

## Completion Reporting

At the end of a workstream/slice, report:
- Implemented.
- Verified.
- Tests/gates.
- Remaining blocker, if any.
- Next workstream allowed by dependency order.

Avoid speculative feature lists in execution reports.

## Source of Truth Hierarchy

For product/execution scope conflicts:

1. Explicit current owner instruction.
2. `docs/SATISDESK_PRODUCT_MASTER_PLAN.md`.
3. `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`.
4. This `AGENTS.md`.
5. Workstream-specific technical documents.
6. Existing implementation patterns.

Security, data integrity and production-safety gates remain mandatory even under urgent execution.

---

Before coding, every contributor must be able to answer:

> **Which approved SatışDesk workstream am I advancing, what exact business outcome does this change enable, and what is its exit gate?**

If those answers are unclear, do not expand implementation scope.