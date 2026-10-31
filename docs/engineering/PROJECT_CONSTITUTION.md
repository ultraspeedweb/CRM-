# SatışDesk — Project Constitution & Decision Memory

**Status:** Owner-intent roadmap, NOT certification of shipped features.
**Project:** `ultraspeedweb/CRM-`. **Independent** product; do not combine codebases, tenants, databases, secrets, deployments or subscriptions with other products.

## Identity
Independent multi-tenant AI Sales Desk SaaS for Turkish SMBs initially, Arabic markets later. WhatsApp Business and web widget first; CRM pipeline, staff and owner roles and verified AI-assisted workflows.

## Core product direction
A company workspace with owner/staff/platform-admin separation; consent-aware messaging, ticket/lead tracking, analytics and outbound actions through authorized provider APIs only. Separate from Sovereign and Garfix; external integrations are connectors.

## Non-negotiables
1. No reuse of customers, CRM tables, providers, credentials, phone numbers or auth belonging to other products.
2. Tenant/customer conversation isolation and least privilege are release-critical.
3. Outbound WhatsApp/social messaging requires verified provider authorization, consent and rate limits.
4. AI must not send unattended marketing, leak messages, or bypass approval policy.
5. Respect existing Next.js version-specific agent instructions and Engineering Foundation.
6. Owner/platform account is not a customer subscription account.

## Priority board (intent, not observed runtime)
- **NOW:** Verify actual staging preview accessibility and authenticated tenant-specific end-to-end acceptance; prior preview gating and historical migration notes are not current PASS evidence.
- **NEXT:** Complete secure WhatsApp/web-widget connected customer journey, role acceptance, and commercial operational gates.
- **LATER:** Additional messaging channels, white-label and advanced automations only after first channel is working.

## Engineering memory discipline
1. Before implementation: read this document, root `AGENTS.md`, current Engineering Foundation if present, and the appropriate skill; inspect actual git SHA, PR/CI, current code and provider environment.
2. Classify each claim as VERIFIED (linked evidence and commit), HISTORICAL (dated), PROPOSED (not built), or UNKNOWN. Never silently translate HISTORICAL into VERIFIED.
3. Keep one-scoped-feature-at-a-time, with a definition of done and tests before further features. When modifying a business or architecture decision, record an ADR at `docs/engineering/decisions/YYYY-MM-DD-short-title.md` with context, alternatives, decision, approvals, risks and supersedes links.
4. Capture exact test commands, outputs, branch, commit SHA, changed files, failed/unexecuted tests, deployment target, and verified blockers in this project's execution record. Avoid reports with unsupported completion percentages.
5. Multi-agent execution must have scoped role permissions, separate worktrees/file ownership, dependence order, an independent verifier and a reviewable PR.
6. Never copy customer data or credentials into documentation or another product. Do not modify Production or send real notifications/charges during tests. Staging writes require explicit scoped approval and verified target; production rollout requires separate owner approval.
7. Use provider and runtime evidence over old plans. Existing repository-specific `AGENTS.md`, engineering, and security policies remain binding; stricter rule wins.

## Project separation
- Garfix (`ultrablueai/garfix`): autonomous engineering company/product; only approved connectors, never its production DB/credentials.
- Sovereign (`ultrablueai/luxury-Car`): mobility/hospitality/tourism; own billing/booking boundary.
- SatışDesk (`ultraspeedweb/CRM-`): AI sales and customer conversations; own channels and auth.
- Qmenu (`ultrablueai/Qmenu`): multi-vertical commerce/queue/appointments; own merchants and data.
- DIMASQ and LearningOS: independent concepts with no confirmed accessible repositories in connected accounts; do not create or mix them automatically.

## Delivery evidence schema
Project | Exact repo / SHA | Current stage | Verified | Historical / Proposed | NOW outcome | Tests (executed / skipped) | Security / tenant concerns | PR | Owner approval | Next authorized step | PASS / FAIL / BLOCKED

**Do not claim a new feature is implemented because a plan, skill, screenshot, or PR draft describes it.**
