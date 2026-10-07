# Engineering Foundation

Status: mandatory project operating baseline

## Goal
Keep SatışDesk understandable, token-efficient, secure, testable and maintainable by humans and coding agents. Load the smallest useful context instead of repeatedly rediscovering the repository.

## Operating rules
- Repository evidence is the source of truth; chat summaries are handoffs, not authority.
- Search/map before full-file reads; constrain work to the affected subsystem and contracts.
- No success claim without exact-candidate tests/evidence.
- Separate executor from verifier for security, auth, tenant boundaries, payments, migrations and production incidents.
- Prefer reusable scripts/checklists over repeated long prompts.
- Architecture/trust-boundary changes require an ADR.
- External skills/tools are supply-chain inputs: review, pin, sandbox-test, measure and document before adoption.

## Core reusable skills
context-engineering; Project Security Shield; secure-review; independent-verifier; incident-recovery; TDD/regression; architecture/ADR; release-engineering; Supabase multi-tenant/RLS; payments/idempotency; design/accessibility review; skill/tool provenance.

## Commerce and revenue skills
- ai-revenue-automation: load [`skills/AI_REVENUE_AUTOMATION_SKILL.md`](./skills/AI_REVENUE_AUTOMATION_SKILL.md) for AI-prioritized sales actions and bounded revenue automation.
- commerce-signal-integration: load [`skills/COMMERCE_SIGNAL_INTEGRATION_SKILL.md`](./skills/COMMERCE_SIGNAL_INTEGRATION_SKILL.md) for Sovereign/store/POS/marketplace event ingestion into CRM.

## Context budget protocol
Start each task with only: goal, branch/SHA, affected subsystem, relevant contracts/tests, known blocker and definition of done. Retrieve details on demand. Prefer diffs, failing tests and targeted line ranges over whole repositories or giant logs. Handoffs contain only changed facts, evidence and the next blocker.

## External skill/tool admission
A tool must solve a repeated problem; have reviewed source/permissions/install/network/secret behavior; be maintained/licensed acceptably; be pinned to an immutable version where possible; pass non-production testing; show measurable token, latency, quality or safety benefit; and have a removal/rollback path. Duplication without measurable benefit is rejected.

## Definition of Done
Code + tests + security gates + maintainability docs + exact-candidate evidence + independent verification where required. Use `docs/security/PROJECT_SECURITY_SHIELD.md` as the mandatory security baseline.
