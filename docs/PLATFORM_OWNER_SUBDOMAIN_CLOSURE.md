# SatışDesk — Platform Owner Subdomain Closure Contract

Status: IMPLEMENTATION PENDING / NOT PRODUCTION CERTIFIED
Baseline: main 952a6ed8b69ad90047e6dd4e381891f51774924c (2026-10-13 verification)
Target: admin.satisdesk.com (proposed; NOT configured)
Owner: Platform Engineering

## Verified state (2026-10-13)
- Vercel project `satisdesk` has verified `satisdesk.com`, `www.satisdesk.com` (redirect to apex), and `satisdesk.vercel.app`.
- No owner/admin subdomain is attached to this Vercel project.
- `app/platform/page.tsx` contains a metadata-only, read-only platform dashboard, redirects anonymous users to `/login`, and relies on `get_platform_company_overview` RPC authorization, redirecting RPC failures to `/dashboard`.
- Export route lives at `/platform/export`; it needs explicit auth and tenant-boundary regression tests.
- `next.config.ts` has no hostname routing. A DNS record or attaching a domain is NOT proof of hostname-level access control.
- Roadmap WS15 billing/catalog mutations and WS16 actual XLSX exports remain separately gated; do not label these complete.

## Target domain and route contract
- `satisdesk.com`: public SaaS entrance and ordinary tenant workspace.
- `admin.satisdesk.com`: Platform Owner-only entry. All owner administrative surfaces and privileged exports remain protected by the existing server-side authorization layer, independently of host routing.
- Do not create another source of truth, fork the tenant platform, or duplicate authentication schemas.
- Platform Owner governance identity does not need a tenant customer subscription.
- Ordinary tenant owners are **not** platform owners and must never gain platform APIs, RPC privileges, exports, or bypass via alternate host/header.
- Never allow unrestricted tenant leads, chat contents, contact records, or other private company content in platform owner reporting.

## Sequenced implementation plan
1. Discover exact runtime auth/session/cookie behavior, deployment mapping, existing routing and rate limits before editing code. Capture immutable baseline and preserve current public routes.
2. Implement an explicit host allowlist and guarded routing for `admin.satisdesk.com`; derive the effective host only from trusted deployment request semantics (not arbitrary spoofable forwarded headers). Reject or redirect unrecognized hosts deliberately. Preserve existing /platform links pending end-to-end migration.
3. Enforce authorization server-side in each page, action, API handler and RPC; use a dedicated Platform Owner permission rather than hostname, browser state, or tenant-owner role. Ensure anonymous and ordinary company accounts fail closed.
4. Use tenant-scoped, secure and compatible authentication cookies across the two hosts only where strictly required; avoid over-broad `.satisdesk.com` cookies unless threat model and runtime tests demand them.
5. Stage `admin.satisdesk.com` in Vercel, prove DNS and TLS/domain ownership, run real-browser sign-in/refresh/logout and deep-link tests. Do not turn on production host routing before staging passes.
6. Execute all gates below on exact release SHA; only then request controlled production domain attachment and zero-downtime deployment approval.
7. After production certification, remove legacy owner entry from ordinary workspace navigation without breaking bookmarked users; treat legacy `/platform` routes as protected and backwards-compatible until safely migrated.

## Mandatory negative and positive test matrix
| Actor | Public host /dashboard | Public host /platform | Admin host owner UI | Platform export / RPC |
| --- | --- | --- | --- | --- |
| Anonymous | login redirect | denied | login redirect | denied |
| Tenant employee | scoped workspace | denied | denied | denied |
| Tenant company owner | scoped owner workspace | denied | denied | denied |
| Platform Owner | permitted governance navigation | protected compatibility route | allowed | metadata only |
| Disabled platform account | denied | denied | denied | denied |

Additionally verify:
- Direct URL, deep link, altered Host/X-Forwarded-Host, wrong origin, nested API paths, browser refresh, new session, expired session, password recovery, multiple tabs.
- RLS/cross-tenant resistance, parameter tampering, export schema and CSV injection, immutable audit on high-impact mutations.
- Responsive UI and accessible nav across mobile/desktop; no decorative or dead admin controls.
- Rollback preserves current `satisdesk.com` traffic and never deletes tenant content.
- CI: typecheck, lint, unit, DB/RLS migration replay, browser E2E, production dependency audit, preview, staging host E2E, production smoke.

## Owner control-plane scope / no false completeness
Currently evidenced: metadata company/subscription overview, CSV and print/PDF.
Separate workstreams requiring code, tests and approval: plan price editing and entitlements, subscription mutations, service show/hide, demo/live governance, usage and margin reporting, audited operator actions, real XLSX exports.

## Release decision
NO-GO for owner-subdomain production cutover until code-backed host policy, server-side permissions and staging cross-host auth pass. Domain changes must not be represented as complete from this document alone.
