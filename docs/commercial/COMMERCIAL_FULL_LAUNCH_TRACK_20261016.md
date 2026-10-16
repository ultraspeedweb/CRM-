# SATIŞDESK — COMMERCIAL LAUNCH EXECUTION TRACK
Date: 2026-10-16. Owner: commercial release. Single source of truth for PR #40 and follow-on work. **Not a launch certificate.**

## Commercial outcome
One authorized paying pilot company can discover the product, receive an accurate written offer, register and verify an account, create its own isolated workspace, onboard its permitted leads, complete a real sales workflow, access support, sign a contract and pay through a certified collection process, without exposing other tenants.

## Release phases — sequential, evidence-required
| Phase | Deliverable | Closure proof | State |
| --- | --- | --- | --- |
| A — Customer offer | AR/TR/EN public pilot and indicative pricing, transparent scope, qualification, FAQs, customer onboarding document | exact-SHA UI test, product owner approval of contract/prices | IMPLEMENTED, not approved |
| B — Tenant activation | signup, email verification, password reset, organization bootstrap, selected language, duplicate protection, employee roles | hosted browser proof, two tenants cross-isolation and negative admin/export checks | IN PROGRESS |
| C — Sales value | lead, follow-up, appointment, deal won/lost, owner and next activity, export without formulas | fresh DB + browser E2E + customer acceptance script | LOCAL TESTED; hosted pending |
| D — Commercial operations | agreement, offer version, approved plan and entitlements, invoices/collections/provider fees, onboarding support, renewals/refunds, data protection | real end-to-end sandbox billing and authorized customer lifecycle proof | NOT CERTIFIED |
| E — Security/reliability | production-dependency audit and full dependency audit, RBAC/RLS, backups, recovery and rollback, browser/device QA, responsive UI | PASS in CI, authenticated staging on exact release SHA | BLOCKED: full audit |
| F — Launch deployment | consolidate approved PRs, verify staging parity, main alignment, review and deploy with authorization | immutable SHA, deployment logs, production smoke, observed alerts | NOT STARTED |
| G — First customers | consent-based 10 discovery interviews, offers, contract+invoice, supported paid pilot onboarding, day-7 and day-30 reviews | signed agreements, authorized collection and acceptance evidence | NOT STARTED |

## Current verified evidence
- Candidate: PR #40 branch feat/commercial-pilot-offer-20261016. Current checked candidate d9cd8a63e74db4bea923272661b0e9bcd374dbe9.
- DB gate: PASS run 38858840134.
- Quality gate: FAIL run 38858844308, full dev dependency tree high advisory. Independent compile/lint/test/build results need exact-run inspection.
- Local browser E2E run 38858839989 in progress at the time this plan was authored; not treated as success.
- Production currently continues to serve an older main SHA, not PR #40. Do not publish this offer as an approved paid subscription until ready.

## Non-negotiable launch blockers
1. Fix or formally disposition full high-severity dependency audit without suppressing detection.
2. Certify production-equivalent hosted Auth, verification/resend/recovery, Platform Owner, ordinary tenant denies, data export and isolation with test identities.
3. Price is provisional. Obtain validated unit economics and owner-approved legally usable offer/terms; tax and pass-through costs explicit.
4. Verify deterministic subscription activation and payment provider sandbox then authorized production purchase/callback/refund/reconciliation. No fake payments or implied automatic billing.
5. Verify responsive/mobile/PWA, browser caching, help/support contacts and deployment rollback.

## Execution discipline
Each work item must land as tested code, product UI or verified commercial artifact, attached to a PR with proof. No repeated audit loops, cosmetic-only work or inaccurate GO claims. Advance one phase only when its Done criteria pass. Safe Preview changes allowed; Production writes/financial commitments require explicit approval. Use the same customer journey as acceptance tests, not merely screenshots.

## Next work packet
Close B customer onboarding with tests for real company values, locale persistence, sign-in verification and tenant duplication; extend E2E to two-tenant role/export denial; then certify hosted Staging. In parallel prepare C real product usage demos and D payment contract readiness without collecting money early.

## Hosted staging evidence — checked 2026-10-16
Supabase account SatışDesk staging project juokgqyjdomgbofpvlfq (eu-west-3) reports ACTIVE_HEALTHY and 29 migrations installed. Read-only table metadata shows 1 organization, 1 membership, 3 billing plans, **0 organization subscriptions, 0 leads, 0 deals, 0 billing events**. These counts show setup, not a certified paid-customer lifecycle.
Supabase security advisor reported 7 WARN notices for authenticated-callable SECURITY DEFINER RPCs and a WARN that leaked-password protection is disabled. These are review items, not proof of an exploit. Inspect explicit authorization guards, grants, and threat model for each RPC before modifying privileges. See https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable and https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection .
Staging environment does not prove production/preview is pointing at this project; verify environment bindings before any hosted journey certification. Do not insert synthetic paid subscription/billing events to claim commercial GO.
