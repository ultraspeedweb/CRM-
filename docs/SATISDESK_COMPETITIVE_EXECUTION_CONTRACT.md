# SatışDesk — Competitive Feature Adoption & Autonomous Work Continuity
Status: APPROVED PRODUCT DECISION; implementation is gated.
Updated: 2026-10-13

## Immutable goal
Build a Turkish-first, Arabic/English-ready, WhatsApp-to-revenue operating system, not a generic CRM feature clone. Adopt competitors' strongest **workflows**, never their branding or UI wholesale. Keep the product north star in `SATISDESK_PRODUCT_MASTER_PLAN.md` authoritative.

## Benchmarks and what to adopt
| Reference | Strong pattern to adopt | Our measurable acceptance |
| --- | --- | --- |
| Kommo | Conversation-led sales, one inbox linked to lead and pipeline | Incoming WhatsApp contact -> deduplicated lead -> owner -> next action -> deal, with permission checks and webhook retry/idempotency |
| Pipedrive | Activity-first pipeline and next-action discipline | Manager/employee Today, Next, Overdue; active deal has accountable owner and action/date; overdue count is reproducible |
| HubSpot | Connected sales/service/marketing reporting and governed growth tiers | Tenant-safe funnel attribution, acquisition channel, quote-to-win reporting, owners' plans and entitlements |
| Zoho CRM | Custom workflows with stage governance | Trigger/condition/action execution with approvals, audit history, retries, dedupe and disable switch |
| Attio | Flexible data/workflows with uncluttered UX | Configurable fields and views only when actual customer use case is proved; preserve searchable consistent record model |
| Bitrix24 | Business-friendly package/team pricing | Plans, quotas and seat/add-on controls; transparent WhatsApp/AI consumption and overage |
| respond.io / SleekFlow | Multi-channel inbox automation with explicit message costs | Message, template and consumption quotas traceable per tenant, no unbudgeted AI/WhatsApp spend |

## Execution order (do not expand scope before closure)
0. **P0: Finish PR #37 and Stage certification**: exact-head Quality + dependency audit + DB replay + Local E2E all PASS; Vercel SSO-safe authenticated owner and ordinary-tenant negative browser E2E; verified service mutation + immutable audit; no token in repo/logs; do not disable deployment protection. Production untouched until certification.
1. **P0: SaaS Control Plane**: define owner-admin governance identity independent from paid tenant, catalog / plan / pricing / entitlements / subscriptions / demo/live / limits / support access / billing events / owner reports. No subscription editing without ledger and rollback. CSV, XLSX and PDF export all server authorized; distinguish CSV-as-Excel from actual XLSX.
2. **P0: Sales Execution**: employee Today/Next/Overdue, ownership, stale deals, overdue signals, stage aging, velocity, lost reasons; real saved and audited actions rather than mock widgets.
3. **P0: Conversation-to-Sale**: Meta-authorized WhatsApp business flow through lead -> assignment -> next action -> opportunity -> quote; template/24-hour-window/retries and idempotency; external credential and per-message fee gates.
4. **P1: Quotes and Manager Intelligence**: quote lifecycle, print/PDF, conversion/forecast/response SLA, drill-down and tenant-scoped analytics.
5. **P1: AI + Automation**: suggestions -> human approval -> policy checks -> execution -> observation; evaluation and cost controls. No autonomous high-impact mutations without approval.
6. **P2: Other channels, custom objects, inventory, integrations**: only after benchmarked pilot demand and mature P0 quality.

## Pricing decision — NOT yet final
Test Starter / Growth / Business AI price hypotheses (not published or billed) against actual Turkish customer willingness-to-pay, infrastructure cost, AI token usage, Meta WhatsApp fees, seat counts, tax and support. Never describe illustrative USD monthly ranges as official SatışDesk prices. Benchmark official vendor URLs and billing period/currency/date before quoting.

## Business acceptance gates per feature
- Product journey: every control works end-to-end against **hosted Staging** and has meaningful error/empty/loading states, mobile usability and Turkish copy.
- Data/security: SQL RLS and server authorization; negative tests for ordinary tenant/support/anon, cross-tenant, replay/idempotency, audit trails. No customer conversations exposed to global platform owner.
- Commercial: costs, quotas, entitlements and effective plan tested; no silent free services, unexpected billing, or unlimited automation.
- Engineering: exact-SHA DB, CI, audit and browser PASS; preview, rollback, operational monitoring, final Production smoke documented.
- Evidence before labels: BACKLOG -> IMPLEMENTED -> LOCAL_PASS -> STAGING_PASS -> MERGED -> PRODUCTION_CERTIFIED -> CLOSED.

## Always-on engineering continuity
At each continuation, read **AGENTS.md**, `SATISDESK_PRODUCT_MASTER_PLAN.md`, this file, and the active PR evidence. Check exact current SHA and current gates; do not assume previously observed successes remain current. Work on the highest incomplete P0 item with a small auditable diff. Never bypass Vercel SSO, silently merge a draft, or claim done without evidence. In completion report show: what changed, exact SHA/PR, PASS/FAIL/BLOCKED, risk and next specific action. Persist durable decisions in source control and maintain PR description. This document captures project decisions, not chat-wide account Memory.
