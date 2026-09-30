# Project Security Shield

Status: Mandatory security and commercial-release policy
Applies to: SatışDesk and reusable project baseline

## Purpose
Defense in depth: Prevent -> Detect -> Contain -> Reproduce safely -> Fix -> Independent Security Verifier -> Regression -> Release.

## Mandatory layers
- Edge/WAF: rate limiting, abuse/bot controls, DDoS posture, request validation.
- Input/AI firewall: command/code/prompt injection, SSRF, unsafe URLs/files/inputs, privileged-action allowlists.
- Identity/session: secure lifecycle, refresh/revocation, session-fixation resistance and step-up where required.
- Authorization: deny-by-default RBAC/ABAC, RLS/tenant isolation, IDOR/BOLA and privilege-escalation resistance.
- API/backend: SQLi, command injection, XSS, CSRF, SSRF and schema/input validation.
- Database/secrets: least privilege, SECURITY DEFINER/RPC review, service-role isolation, secret scanning/rotation.
- Payments/webhooks where applicable: authenticity/signature verification, replay/idempotency protection, server-side authority/finalization and reconciliation.
- Supply chain/CI: dependency/SCA, secret scanning, workflow/action hardening and provenance checks.
- Runtime: audit/security logs, anomaly signals and actionable alerts.
- Independent verification: executor does not self-certify security-sensitive fixes.

## Threat baseline
Applicable CWE-78/77/918/862/863/306/287/501/269/384/89/120/79 plus OWASP Web/API/LLM, multi-tenancy, supply-chain, secrets, misconfiguration and business-logic abuse. This is a minimum baseline, not an exhaustive list.

## Release policy
- Unresolved Critical = Production BLOCKED.
- High requires explicit evidence-backed disposition/approval.
- Scanner output alone is not closure.
- Cross-tenant and privilege boundaries require negative tests.
- SECURITY DEFINER/RPC privileges are reviewed function-by-function, not bulk modified without regression evidence.
- Security evidence must match the exact release candidate.

## Definition of Done
Controls are source-controlled where possible; security regressions are repeatable; negative tests cover trust boundaries; residual risk is documented; and independent verification passes before commercial certification.

## Reuse rule
Adopt this document in future projects as the default security skill/policy. Project-specific gates may extend it; a protection layer may be marked N/A only with documented evidence.
