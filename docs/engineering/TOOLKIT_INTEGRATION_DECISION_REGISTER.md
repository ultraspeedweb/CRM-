# Engineering Toolkit — Integration Decision Register (2026-10-09)

Status: **DISCOVERY ONLY — NOT DEPLOYED / NOT CERTIFIED**. This register does not imply packages are installed, wired, or commercially approved. No production or database changes are authorized by this file.

## Evidence baseline
- Repository package.json on main is the only dependency inventory checked in this pass.
- Sovereign: React 18 / Vite / Supabase; @sentry/react, @tanstack/react-query, Radix components, @playwright/test already declared. Presence is NOT runtime activation or E2E proof.
- SatışDesk: React 19 / Next.js 16 / Supabase; none of the proposed framework packages declared as direct dependencies in the checked package.json.
- Follow AGENTS.md, engineering foundation and Security Shield. Recheck exact branch SHA, runtime wiring, full dependency tree, licensing and tests before each change.

## Disposition by capability
| Candidate | Decision | Acceptance evidence needed |
|---|---|---|
| Refine CORE | Isolated admin CRUD proof of concept ONLY; no replacing existing pages | React/router/provider compatibility, tenant-safe server authorization, UI parity, bundle and license review |
| PostHog | Candidate for consent-gated product analytics and redacted replay | Privacy/KVKK review, masking tests, opt-out, sampling/cost, no payment/ID document capture |
| Sentry | Reuse if present; verify configuration before any new SDK | Error capture in non-prod, PII scrubbing, release tagging, sourcemap/access control |
| OpenTelemetry + Grafana | Pilot tracing for selected API/service only | Correlation IDs, retention, security and measurable overhead; avoid duplicate ingestion |
| Trigger.dev | Candidate for durable jobs where existing jobs cannot satisfy requirements | Idempotency, retries, queues, isolation, cost, failure/recovery tests |
| BullMQ | Alternative to Trigger.dev, NOT additive by default | Redis lifecycle and worker operations proof |
| n8n | Internal-only integration candidate; **no customer workflow editor/white-label** without commercial licensing | License clearance and secret/tenant isolation |
| Langfuse | Garfix AI trace/evaluation candidate | Masking, retention, opt-in, model cost and evaluation evidence |
| LiteLLM | Garfix AI gateway candidate | Key isolation, usage caps, license/features audit, fail-closed routing |
| LangGraph / Agno | Evaluate ONE orchestrator only if existing Garfix orchestration lacks capabilities | State replay and independent verifier evaluation |
| shadcn/ui + Radix | Reuse existing design system first | Accessibility and UI skill gate, no duplicate components |
| TanStack Table / Query | Extend only where current tables/caching need it | Query keys tenant-scoped, cache reset on sign-out/tenant switch |
| React Flow | Workflow editor POC, not an execution engine | Schema validation, RBAC and safe backend execution |
| Cerbos | Optional policy decision service, NOT a replacement for Supabase RLS | Deny-by-default, tenant isolation, policy consistency tests |
| Lago | Billing POC only, NOT payment provider or webhook finalizer | Contract licensing, provider compatibility, invoice correctness, idempotency |
| Unleash | Alternative to existing flags/PostHog flags; select ONE | Server authority, safe default, kill switch |
| Playwright | Use existing tests where present; strengthen critical flows | Auth, tenant boundaries, booking/payment (sandbox) and rollback smoke |
| SOPS | Secrets file management pilot, never commit decrypted material | KMS/key ownership and key rotation recovery |
| OWASP ZAP | Staging-only authorized baseline scan | No destructive active scans against production |

## Execution order (one vertical slice per PR)
1. **Observe before changing**: verify current Sentry/Playwright wiring (or baseline equivalent), add a non-production alert/trace proof, PII masking and consent tests.
2. **Close launch gates first**: auth session refresh, RideOS payment server finalization and relevant CRM acceptance flows remain separate from toolkit adoption.
3. **CRUD POC**: Refine on ONE isolated non-production admin resource, compare against existing implementation; discard if worse.
4. **Background/flags POC**: choose one queue orchestrator and one feature-flag service, with tenant isolation.
5. **Garfix isolated AI POC**: Langfuse + LiteLLM behind disabled-by-default config; evaluate orchestration only if needed.
6. **Billing/policies/security tools**: proof and independent verifier before any rollout.

## Mandatory delivery checklist for every candidate
- Exact target repo/branch/SHA and architecture owner; inventory current equivalent and dependencies.
- Legal license and service plan checked for **commercial multi-tenant SaaS/white-label**; recurring infra, data egress and vendor lock-in costs documented.
- Threat model: tenant A cannot read tenant B; server-side authorization is authoritative; PII/secrets masked; no client-side payment finalization.
- Disabled by default; CI typecheck, lint, unit, build, focused E2E and security checks pass on the exact candidate.
- Staging proof with logs, performance baseline, rollback procedure; independent verifier sign-off.
- Production rollout is a separately approved change with canary, metrics and rollback.
