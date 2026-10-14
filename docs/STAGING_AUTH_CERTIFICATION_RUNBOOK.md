# SatışDesk — Protected Staging certification unblock

## Verified evidence
Exact application candidate `12e46867603f94800437a81446fbeb91218fe41e` has successful Quality, Owner panel dependency audit, Database and Local E2E jobs. Hosted staging boundary smoke run `38491811312` is BLOCKED because the GitHub Actions secret `SATISDESK_STAGING_VERCEL_BYPASS` is empty/not configured. Vercel SSO currently protects Preview; DNS alone is not authorization proof.

## One-time secure handoff (authorized administrator)
1. In Vercel -> project **satisdesk** -> Settings -> Deployment Protection, create/rotate a **scoped automation bypass** for protected Staging testing. Keep SSO enabled. Confirm exact project and access scope before issuing.
2. In GitHub -> **ultraspeedweb/CRM-** -> Settings -> Secrets and variables -> Actions -> New repository secret: name `SATISDESK_STAGING_VERCEL_BYPASS`; enter the Vercel bypass value there only. NEVER paste this value into chat, PR comments, source code or an Actions log.
3. Trigger workflow **Admin staging authenticated-boundary smoke** on the candidate branch. A PASS certifies anonymous application boundary under the authorized deployment header; it **does not** certify an actual owner session.
4. Run human or trusted-browser hosted authenticated journey: platform owner login to `https://admin-staging.satisdesk.com/platform`; check list/export, service state change with reason and persisted audit event; check normal tenant and support cannot write; test refresh, expired session and cross-tenant denial. Use synthetic tenant data and preserve real customer records. Record redacted evidence only.
5. Check exact-head CI, deployment SHA, release rollback, billing/pilot limits, and permit merge/production deployment only after explicit evidence-based GO.

## Failure classification
- Missing secret => BLOCKED CONFIGURATION. Do not fix by disabling SSO.
- Redirect to Vercel `/sso-api` despite bypass => BLOCKED ACCESS/SCOPE. Verify bypass protection scope and domain alias.
- HTTP 200 on anonymous export => SECURITY FAIL / NO-GO.
- 401 or 403 on anonymous export with owner login/export succeeding => authorization expected, subject to tenant-negative tests.
- Owner service action with no audit => SECURITY FAIL / NO-GO.

## Scope caution
This PR does not implement dynamic pricing, subscriptions billing mutation or real XLSX. Do not claim full commercial SaaS closure or paid subscription readiness merely from four green CI gates.

## Hosted CRM database gap verified (2026-10-14, read-only)
- Supabase CRM project `yafhipcokviboywaeyqi` is `ACTIVE_HEALTHY`. Administrative SQL and migration listing now work.
- Hosted `get_platform_company_overview()` exists; `get_platform_service_overview()` and `set_platform_service_status(uuid,text,text,text)` do not exist; `private.platform_service_controls` does not exist.
- Preflight dependencies `public.organizations`, `public.audit_logs` and `private.has_platform_role(text[])` exist. The hosted DB currently contains one organization; its main branch is default. No distinct staging database was confirmed.
- Migration `supabase/migrations/20260926110000_add_platform_service_controls.sql` is **NOT** recorded among the 22 hosted migration entries. It must not be marked applied or certified from local CI success.
- **HOLD**: Do not apply that migration to project `yafhipcokviboywaeyqi` until the owner or deployment inventory proves the database's environment and approves a guarded change. Preserve rollback/backup evidence and avoid testing service mutations against actual tenant data. Preferred: dedicated Staging DB with synthetic tenant and authenticated test users, apply exact migration there, then run role/audit E2E.
- Only after the guarded hosted migration is verified should the operator certify the owner toggle UI; a deployed Preview alone cannot make the missing RPC work.
