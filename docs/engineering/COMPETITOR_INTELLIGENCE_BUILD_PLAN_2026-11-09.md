# SatışDesk — Competitor Intelligence & Build Execution Plan
**Research date:** 2026-11-09 (Europe/Istanbul)
**Scope:** SatışDesk only | **Status:** Decision-ready plan, NOT evidence of shipped functionality or release certification
**Branch:** docs/progress-reconciliation-20261103 | **Production baseline:** main @ 952a6ed8b69ad90047e6dd4e381891f51774924c

## 0. Product identity and precedence
SatışDesk is a **governed autonomous Revenue & Growth Operating System**, not a conventional CRM. The master product plan dated 2026-10-04 remains the product north star. Operational acceptance rules in `docs/SATISDESK_PRODUCT_ROADMAP.md`, `AGENTS.md`, and Engineering Foundation remain binding. This document adds current market evidence and stage gates; it does **not** silently redefine scope or overwrite the existing roadmap. Keep SatışDesk independent from other projects and providers.

**North star:**
Goal → Diagnose → Plan → Execute (permissioned) → Measure → Learn → Re-plan

**Customer journey:**
Channel / campaign → Lead → Conversation → Qualification → Assignment → Next action → Quote → Appointment → Deal / Order → Won revenue & margin → Goal contribution → Next best action

## 1. Competitor evidence (primary or provider documentation)
| Competitor | Verified dated development | Signal | SatışDesk action |
|---|---|---|---|
| HubSpot | 2026-09-16 Fall Spotlight: Breeze Assistant + contextual agents; 2026-11-02 October product roundup includes Revenue Hub quotes and admin/ads/AI updates | Agent grounded in live business context and integrated actions, not chatbot theater | **NOW:** employee priorities + owner action dashboard; approvals with source/context; measure task outcomes |
| Pipedrive | 2026-09-16 Nova GA meeting intelligence; Oct 2026 product updates: MCP product/lead access, admin control, duplication rules | Low-friction sales activities + permission-aware AI access | **NOW:** Today/Next/Overdue and dedupe checks; **LATER:** meeting capture/MCP write after security gate |
| Salesforce | October 2026 release notes: Agentforce context-driven testing, agent memory controls, external MCP per-user auth; Nov 2026 Claude CRUD expansion | AI governance, tests, traceability and delegated scope are product capabilities | **NOW:** independent action verifier, audit records, negative role tests; **LATER:** external agent interfaces |
| Kommo | Plan policy revised June 1, 2026; Sep 8 2026 documentation shows AI limits/channel caps; Aug 14 AI agent inbound-only and credit limits | WhatsApp-first UX with metered AI/channel use | **NOW:** inbox-to-deal path, explicit channel state and usage caps, simple value-priced tiers |
| Zoho CRM/Bigin | 2026-07-14 Bigin Zia agents, 2026-08 incentives and document parsing, Sep workflow subform triggers | Templates, small-business usability and explainable automation | **NEXT:** sales workflow templates and manager insights; **LATER:** advanced commissions |
| respond.io | 2026-09-30 AI Agent setup: skills, knowledge sync state, save-before-publish and instruction checks | Nonproduction test/publish workflow for agents | **NEXT:** draft → evaluate → approve → activate agent gate |

### Sources (URLs and dates)
- HubSpot Fall 2026 Spotlight, September 16: https://hubspot.gcs-web.com/news-releases/news-release-details/fall-26-spotlight-hubspot-just-made-its-most-foundational
- HubSpot October 2026 updates, posted November 2: https://community.hubspot.com/t/hubspot-product-updates-for-october-2026/163704
- Pipedrive Nova, September 16: https://www.pipedrive.com/en/newsroom/pipedrive-launches-nova-to-turn-sales-meetings-into-crm-intelligence
- Pipedrive Product Updates, October 2026 section: https://www.pipedrive.com/en/product-updates
- Salesforce Agentforce change log, October–November 2026: https://help.salesforce.com/s/articleView?id=platform.api_governance.htm&language=en_US&type=5
- Kommo plans, updated September 8: https://support.kommo.com/docs/kommo-subscription-plans-overview
- Kommo AI, updated August 14: https://support.kommo.com/docs/kommo-ai-agent
- Zoho CRM release notes: https://www.zoho.com/crm/whats-new/release-notes.html
- Zoho Bigin Q2 update, July 14: https://www.zoho.com/blog/bigin/q2_2026_updates.html
- respond.io changelog, September 30: https://roadmap.respond.io/changelog

### Critical external cost change: WhatsApp
From **2026-10-01**, WhatsApp Business Platform service replies became billable per delivered outgoing message after a **1,000 free service message allowance per business phone number per month**; utility templates sent inside the customer-service window are also chargeable. Rates depend on recipient market and type. Supported by multiple provider support documents, but final market rate cards and contractual pass-through must be checked against actual BSP/Meta terms before invoicing.
- Zoho provider explanation: https://help.zoho.com/portal/en/kb/desk/support-channels/instant-messaging/whatsapp/articles/whatsapp-business-platform-comprehensive-pricing-user-education-guide-2024-2025
- Wati updated Oct 21: https://support.wati.io/en/articles/16954666-whatsapp-business-platform-api-pricing-changes-service-messages-and-click-to-message-ads
- respond.io pricing (October 2026): https://respond.io/help/whatsapp/whatsapp-pricing

**Immediate design implication:** subscription billing must separate platform seat/features from pass-through WhatsApp costs, included monthly allowances, AI usage, overage and addons. Build usage ledger with idempotency and market/category/phone number dimensions. NO invented public prices, NO autonomous billing changes.

## 2. Current technical baseline, reconciling historical records
These claims are evidence classifications, not percentages:
- **VERIFIED MERGE HISTORY:** WS7 platform governance/export hardening; WS8 sales execution (#24, d846516); WS9 omnichannel contracts (#25, 2f79a20); WS10 professional quotes (#26, c47fd00). The older roadmap's BACKLOG/ACTIVE status labels predate merges and are stale.
- **VERIFIED DEPLOYMENT STATE:** Vercel Production READY on main SHA 952a6ed8 (Oct 4) and Preview READY on engineering-skills branch SHA 41532b9. READY is not authenticated E2E proof.
- **VERIFIED DOCS:** 2026-11-03 execution handoff exists on this independent review branch; engineering-skills branch 13 commits ahead of main, unmerged.
- **BLOCKED LIVE DB READ:** Supabase core CRM metadata ACTIVE_HEALTHY but direct list_tables/read-only SQL and migrations failed SQLSTATE 28P01 authentication; adviser endpoints also reported hibernation. Distinguish metadata health, connector auth and database availability; do not rotate production secrets casually.
- **UNKNOWN:** browser E2E and tenant isolation at exact SHA, Meta real inbound/outbound, official WhatsApp permission and templates, production database target proof, migration replay, product/inventory/goal-engine feature completeness, rollback rehearsals.
- August 31 historical patch archives are reference only, not reapply instructions.

## 3. Market positioning and product choices
**Differentiation statement:** Turkish/Arabic/English-first, WhatsApp-led Sales & Growth OS for SMB teams: every inbound interaction moves to accountable next action, quote/deal and attributable result, with owner goals and safe AI actions.

**Design principles:**
1. Employee home displays 3–7 highest-impact actionable tasks, not 40 dashboard cards.
2. Owner home answers: goal on track? why? what next? which approved action improved result?
3. A single customer timeline and cross-linked outcomes; avoid duplicated records.
4. AI outputs must cite tenant data, respect roles, support approval and capture outcomes.
5. Product/inventory depth only as required to connect real sales/margin outcomes; no generic ERP expansion.
6. Monetization separates subscriptions, feature entitlements, Meta channel fees, AI usage and support.
7. Integrations and autonomous actions remain disabled/Not configured until real provider authentication and staged tests pass.

## 4. Ordered executable plan (no scope expansion until blocker gates)
### Gate A — Commercial runtime and identity (P0, START HERE)
**Known blocker:** Supabase connector SQL auth failed; live authenticated journey not certified.
- A1 Check CRM project ID and connector read-only role access through approved dashboard/integration diagnostics. Keep secrets redacted. No Production secret rotation or database privilege changes without separately reviewed authorization.
- A2 Compare nonsecret production env metadata with CRM project identity (do not decrypt/report secrets). Verify exact deployment SHA and public HTTP smoke; validate auth callback hostnames, domains, redirect allowlists.
- A3 Nonproduction isolated migration replay from empty DB; owner/staff/anonymous + Org A/B regression. SECURITY DEFINER RPC negative tests for owner employee/marketing/subscription functions.
- A4 Auth flows: signup, verify email, login/logout, password recovery, onboarding, duplicate creation retry.
- A5 Today queue, lead assignment, human handoff, deal transitions, quote PDF/export, platform owner console tests with mock provider and tenant test data.
**Done:** logged commands/exit codes, browser screenshots/videos or CI artifacts for exact SHA, no P0/P1, security verifier signoff, explicit rollback. Gate status now BLOCKED, not PASS.

### Gate B — First fully connected customer-to-revenue pilot (P0)
**Use existing WS7–WS10 implementations; patch only gaps found by tests.**
- Input: web form + WhatsApp simulated inbound → normalized lead with source/consent → owner assignment → qualification → next action → quotation → won/lost deal → owner dashboard metric.
- Explicit fallback UI for not-configured WhatsApp; do not send real outbound messages in tests.
- All writes organization-scoped + audited. Failed events visible with retry/idempotency.
**Done:** employee and manager test scenario, negative cross-tenant case, export parity, TR/AR/EN/mobile.

### Gate C — Differentiated Growth V1 (P1 after A/B)
- Employee Execution Cockpit: Today/Next/Overdue + ranked actions, ownership, due dates, reasons.
- Owner Growth Command Center: company goal, current vs expected, remaining gap, required run rate, pipeline coverage, revenue/margin, loss reasons.
- Each signal has drilldown to customer/deal/quote and single approved next action.
- Create a small `Action Outcome Ledger` only if no suitable existing schema exists (inspect migrations first); measure whether the action succeeded, not speculative AI uplift.
**Done:** deterministic example/edge-case tests for dates, missing attribution, zero targets, currencies and permissions; at least one end-to-end goal→action→outcome journey.

### Gate D — Governed AI Sales Assistant (P1)
- Read-only customer summary and next-best-action using scoped context.
- Proposed changes shown as diffs; user approves writes. Role/tenant policy checker, input validation, audit and rate limits.
- Evaluation set for AR/TR/EN, cross-tenant prompts, instructions injection, false attribution, missing data.
- Draft → evaluate → approve → activate agent publishing; outbound remains disabled by default.
**Done:** independent verifier, safety metrics, human handoff and no unauthorized writes.

### Gate E — Commercial operations & billing (P1)
- Platform admin plan/addon catalog + feature gates + quotas.
- Per-message WhatsApp cost ledger (message category, country, phone ID, provider charge, monthly free allowance, delivery status); reconciliation before charging.
- AI usage and provider cost metering. Transparent usage and overage preview.
- Model costs at 10/100/1,000 customers; segment-level willingness-to-pay test; no invented market prices or autopricing.
**Done:** subscription and billing idempotency/security tests + approved commercial pricing policy.

### Gate F — Wider intelligence / later
- Deeper products, inventory, stock risk and margin attribution only after dependable transaction data exists.
- More channels (Instagram, social, ads), external MCP writes, meeting recordings, custom domains, multilingual voice, white-label depth and advanced commissions when validated demand supports it.
- Never open all workstreams in parallel; keep one execution stream and independent verification per security-critical change.

## 5. Acceptance matrix for initial development sprint
| ID | Test / proof | Expected outcome | Current |
|---|---|---|---|
| A-01 | Supabase read-only connector diagnostics | SQL read from CRM works without broadening grants | BLOCKED (28P01) |
| A-02 | Production identity cross-check | Safe nonsecret proof project target is CRM | NOT RUN |
| A-03 | Isolated migrations | Clean replay and generated types match | NOT RUN |
| A-04 | Anonymous/tenant/platform owner role matrix | Unauthorized cross-role/cross-tenant access denied | NOT RUN |
| A-05 | Signup/email recovery/onboarding | Full journey, duplicate retry idempotent | NOT RUN |
| B-01 | Web/WhatsApp simulated lead→quote→deal | Authenticated 3-language end-to-end, audited | NOT RUN |
| B-02 | Current quote PDF/CSV/XLSX export | Valid typed output, role-specific data only | NOT RUN |
| C-01 | Revenue goal → gap → next action → outcome | Deterministic and source-linked calculation | NOT RUN |
| D-01 | AI approval boundary | No unauthorized outbound or tenant data access | NOT RUN |
| E-01 | WhatsApp cost metering | Correct free allowance, market/category and idempotency | NOT RUN |

## 6. Execution guardrails
- Work from a review/feature branch. No main merge, production deploy, prod DB writes/SQL, staging restart, password or key rotations without reviewed target-specific authorization.
- Never claim success from documents, historic PR merges, feature-name search or Vercel READY alone.
- Exact-SHA typecheck + lint + unit + DB isolated replay + browser E2E + security negatives + rollback and owner approval are mandatory release gates.
- Retain all customer data, preserve historical decisions, isolate every product/project. Mark evidence VERIFIED / HISTORICAL / PROPOSED / UNKNOWN.
- Before adding schema or new UI, inspect existing implementation and tests; fix smallest coherent regression first.

## 7. Immediate handoff / next coding task
**Task:** Restore reliable nonproduction diagnostics and establish one verified end-to-end pilot path on existing code without expanding product scope. First attempt read-only Supabase access and separate authentication failure from database liveness; then inspect exact WS7–WS10 E2E fixtures and CI checks before any refactor. This plan is a review artifact, NOT a declaration that workstreams or release gates passed.
