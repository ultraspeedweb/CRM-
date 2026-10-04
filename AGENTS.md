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
4. `docs/engineering/skills/DELIVERY_VERIFICATION_SKILL.md` — contract-first delivery, DB/RLS gate, Design QA, business-event standard, Golden Path and independent verification.
5. Load only the task-relevant additional skill. For UI/UX also load `docs/engineering/skills/WEB_UI_DESIGN_SKILL.md`. For security-sensitive work load `docs/security/PROJECT_SECURITY_SHIELD.md`.

Do not restart broad product discovery when these sources already define the direction.

## Product Identity Is Locked

SatışDesk is **not a traditional CRM**. It is a **Governed Autonomous Revenue & Growth Operating System**.

CRM-like entities such as customers, leads, contacts and deals remain only as useful internal commercial data primitives. Do not turn them back into the product identity or spend roadmap capacity cloning generic CRM functionality.

Core loop: **Sense -> Understand -> Predict -> Decide -> Policy/Approve -> Act -> Verify -> Learn**

User-value loop: **Signal -> Insight -> Decision -> Action -> Verified Result**

## Scope Discipline

Every implementation task must identify:
- Workstream ID.
- Exact business problem.
- In-scope modules/files.
- Data and permission contract.
- Acceptance criteria / exit gate.
- Required tests/security/design checks.

Do not add adjacent features merely because they are convenient. Do not perform broad refactors, architecture rewrites, dependency migrations, cosmetic redesigns or new integrations unless required by the active workstream or separately approved.

If an unexpected issue blocks the active workstream, creates a security/data-integrity risk, or is a regression caused by current work, fix it. Otherwise record/defer it and continue the active workstream.

## Explicit Anti-Scope

Do not implement generic CRM clone work, competitor menu parity, static dashboard expansion without decision/action value, decorative AI chat, generic ERP/accounting unrelated to revenue/growth, autonomous high-impact actions without governance, or features without a defined business outcome.

## Workstream Dependency Order

**Wave 0:** Security Shield + verification baseline.

**Wave 1:** Product/role contract -> Revenue Graph -> Goal Intelligence -> Employee Execution Cockpit + Company Owner Growth Command Center + Platform Owner Control Plane.

**Wave 2:** Products/orders/inventory -> winning-product intelligence -> quotes/pricing/approvals.

**Wave 3:** Omnichannel -> website/store connector framework and attribution.

**Wave 4:** Decision/action engine -> AI copilot -> governed automation/agents -> scenario planning/briefings, with verifier/evals throughout.

**Wave 5:** Global scale/productization.

Do not jump to later waves merely because they are more interesting.

## Current Priority Vertical Slice

Until verified complete:

**Owner sets target -> system calculates trajectory/gap -> system identifies operational drivers -> employee sees prioritized action -> action is completed -> outcome updates business state -> owner sees verified progress.**

Do not replace it with disconnected screens or generic dashboards.

## Architecture & Safety Guardrails

- Preserve multi-tenant isolation and deny by default.
- Maintain RLS and role boundaries.
- Keep business logic deterministic/testable where possible.
- UI uses real governed data; fake KPI theater is not evidence.
- Maintain traceability from insights/actions to records.
- AI is tenant-scoped and permission-aware.
- Agents cannot self-expand authority.
- High-impact actions require approval/policy controls.
- Material actions require auditability and outcome state.
- Do not tightly couple SatışDesk identity to Garfix internals.

## Project Security Shield Is Mandatory

Apply relevant RLS/tenant isolation, RBAC/ABAC, IDOR/BOLA protections, input/API/AI controls, secrets/service-role/RPC safety, webhook verification/idempotency, dependency/secret/CI gates and audit/observability. Never bypass a security gate to make a feature pass.

## Contract-First + Independent Verification Is Mandatory

For new workstreams/material changes, use `DELIVERY_VERIFICATION_SKILL.md` before coding and before claiming completion. The builder does not commercially certify its own work. Verification is evidence-based and must cover applicable business rules, permissions, RLS, UI/UX states, regression, security/quality gates and E2E.

The differentiated Golden Path becomes a commercial E2E gate as its dependent stages become real. Do not fake future stages to make it green.

## Definition of Done

DONE requires applicable business acceptance criteria, tenant/role authorization, deterministic tests, required UI states, localization, audit/observability, E2E/regression, security/quality gates, updated contracts/docs and production verification before commercial-readiness claims.

## Product Change Control

Explicit owner/product approval is required for a new major workstream/persona/core module outside the master plan, North Star changes, major autonomy expansion, generic ERP/finance/HR/support expansion, or architecture/platform migration not needed for an active blocker.

## New-Idea Rule

- Supports active workstream -> include only if required for exit gate.
- Fits later workstream -> record/defer.
- Changes direction -> approval + master-plan update first.
- Does not serve North Star -> reject/defer.

Discussion does not automatically become implementation scope.

## Handoff Contract

Every handoff states only: active workstream/milestone; branch/PR/HEAD; verified complete work; current blocker; exact next executable step; tests/evidence/gates. Do not restart broad discovery if this exists.

## Source of Truth Hierarchy

1. Explicit current owner instruction.
2. `docs/SATISDESK_PRODUCT_MASTER_PLAN.md`.
3. `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`.
4. This `AGENTS.md`.
5. Workstream-specific contracts/skills.
6. Existing implementation patterns.

Security, data integrity and production safety remain mandatory.

---

Before coding answer:

> **Which approved workstream am I advancing, what exact business outcome does it enable, and what is its exit gate?**

If unclear, do not expand scope.