# WS7 / PR #39 — Security disposition and release gate evidence

Date: 2026-10-15
Exact candidate: d7f47846f331b7557118afdec2784d9598225a5c

## Verified automated gates
- Database: PASS (GitHub Actions run 38724512571).
- Local Browser E2E: PASS (GitHub Actions run 38724512711).
- Quality job (run 38724512647): npm ci PASS, production-only `npm audit --omit=dev --audit-level=high` PASS, `npm run verify` PASS, full `npm audit --audit-level=high` FAIL.
- Earlier run 38714166849 had 46/46 Vitest PASS, typecheck/lint/Next build PASS; the later independent verify step also PASS.
- Vercel status for earlier SHA is not production runtime certification.

## Remaining advisory
GitHub advisory GHSA-vfj7-8cjw-p6xm / CVE-2026-93687: `braces@3.0.3` recursion stack exhaustion (High), affected <=3.0.3, no patched version as of 2026-10-15.
Dependency path in this candidate lockfile: eslint-config-next@16.4.1 -> @next/eslint-plugin-next@16.4.1 -> fast-glob@3.3.1 -> micromatch@4.0.8 -> braces@3.0.3.
These packages are marked dev:true in lockfile. Production-only audit PASS verifies the *install dependency tree* for production, not all possible build-time/deployment-time exposure.
Primary sources:
- https://github.com/advisories/GHSA-vfj7-8cjw-p6xm
- https://github.com/mrmlnc/fast-glob/issues/532
- https://github.com/micromatch/braces/issues/84

## Safe decision
- Not an acceptable workaround: `npm audit fix --force` (downgrades eslint-config-next), blanket audit suppression, changing audit-level, marking CI green with `continue-on-error`, or declaring launch GO.
- Remediation candidate only when tested: upstream dependency update replacing fast-glob/micromatch/braces, or reviewed maintained and licensed alternative preserving ESLint parity. Re-run full audit and behavior tests. Neither currently verified.
- A limited development-tool exception requires separate owner authorization, time limit, advisory tracking, confirmed production bundle/process isolation, mitigation details, and explicit risk acceptance. No exception has been authorized.
- PR remains DRAFT / NO-GO while strict full audit fails and until authorized Staging-to-Production certification.

## Commercial WS7 closure also requires
Production auth signup/login/recovery; Platform Owner identity/RBAC; tenant isolation; export authorization and CSV/Excel content; subscription lifecycle; exact SHA preview/Staging E2E; documented deployment/rollback; production smoke and sign-off. No claim these are certified merely because local CI passes.
