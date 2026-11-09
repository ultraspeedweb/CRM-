# SatışDesk — Commercial Closure Execution Board
Date: 2026-11-10 | Product source: docs/SATISDESK_PRODUCT_MASTER_PLAN.md | Current release: **NO-GO**

## Rules
One stage at a time; no status marked CLOSED from documentation or build success alone. No production database writes, forced Git pushes, secret rotations or releases without reviewed, explicit target authorization. Every gate needs exact SHA, run URL, role/tenant negative tests and rollback owner. CRM/SatışDesk must remain isolated from all unrelated projects.

## Phase 0 — Repair existing candidate and close security risks (ACTIVE)
- [x] PR #46: Next 16.4.5, Vitest 4.1.12, locked dependencies and safe preflight. Quality, Database and Local E2E successful on SHA 288ca98a.
- [ ] Independent security review, preview authorization/tenant tests, approved merge and production rollout of PR #46. Production is still on main 952a6ed8 until observed otherwise.
- [x] New independent PR (platform export): neutralize spreadsheet formula injection in exported tenant metadata and fix local/preview auth redirect; automated unit regression included.
- [ ] This PR exact SHA Quality, Database, E2E and independent authorization review.

## Phase 1 — Commercial launch acceptance (P0)
- [ ] Restore safe read-only Supabase SQL diagnostics; differentiate expired connector credentials, network timeout and actual database health. No grant widening.
- [ ] Auth: signup, verification, recovery, login, idempotent company onboarding.
- [ ] Four-role matrix (anonymous, agent, tenant owner, platform operator) and cross-org A/B tests; `/platform` and `/platform/export` negative and positive cases; CSV contents and XLSX/print contract.
- [ ] Lead → conversation → assignment → next action → follow-up → quote → accepted/rejected → deal won/lost → reporting; checked on TR/AR/EN/mobile and with disabled providers.
- [ ] Payment/subscription/seat limits: verified plans, customer lifecycle, no unapproved billing, fail-closed and support contacts.
- [ ] WhatsApp/Meta configured? Test official provider if credentials/approval available; else clearly mark Not configured and limit launch claims.
- [ ] Exact merge candidate: Quality + isolated DB replay + browser E2E + security negatives + Vercel Preview acceptance + rollback.
- [ ] Approved rollout, exact production SHA match, runtime smoke, monitoring and rollback rehearsal evidence.

## Phase 2 — Differentiated product (P1, after P0)
- [ ] Employee Today/Next/Overdue execution cockpit; owner goals/forecast/attribution and action outcomes; prioritize existing WS8–WS10 code.
- [ ] Governed AI recommendations with approvals, independent verifier, action/outcome ledger.
- [ ] Channel/AI consumption ledger, costed plans and billing policy before expanding features.
- [ ] Product/inventory intelligence and connectors only where supported by measurable usage.

## Release certificate fields
Candidate SHA: UNKNOWN | Security verifier: NOT SIGNED | Preview pass: NOT CERTIFIED | Production approved: NO | Production smoke: NOT CERTIFIED
Verdict: **NO-GO** until all P0 evidence passes.
