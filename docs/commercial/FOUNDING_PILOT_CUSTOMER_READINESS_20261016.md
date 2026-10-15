# SatışDesk — Founding Pilot Customer Readiness Pack
Version 2026-10-16. Internal sales/onboarding reference — NOT an executed customer contract, invoice, published offer, or authorization to use live credentials.

## Product sold
Managed initial deployment and first month of SatışDesk for one Türkiye-based company, up to five named users, TRY 50,000 **provisional offering**, VAT and WhatsApp/Meta charges separated in the eventual signed agreement.

## Discovery qualification (must be recorded)
- Company legal/trade name and authorized decision maker; business sector and country.
- Team seats, sales channels, Arabic/Turkish/English requirements, monthly inbound lead volume.
- Current workflow for lead → owner → next action → appointment → deal.
- Authorized source, permission and lawful basis for imported customer records.
- WhatsApp activation readiness: customer-owned Meta assets, approved number, message templates, required opt-in.
- Success criterion proposed by client (time to follow-up, overdue queue reduction, lead ownership or conversion), baseline before pilot.
- Commercial terms, VAT, optional provider pass-through, data ownership, support hours, onboarding scope and cancellation needs.
- Whether pilot is appropriate or should be rejected if product functionality is not runtime-certified.

## Account conversion states
1. QUALIFIED — prospect and decision maker identified; no promise of unavailable feature.
2. DISCOVERY_DONE — pain/workflow/data risks and desired success metric documented.
3. PROPOSAL_SENT — versioned written quote, delivery boundaries, taxes/fees and expiry; no automatic billing.
4. CONTRACT_SIGNED — written agreement includes rights, hosting/security disclosures and acceptable feature scope.
5. PAYMENT_CONFIRMED — payment only through lawful invoiced payment route, confirmed on server; no unverified transfer screenshots.
6. TECHNICAL_GO — exact deployed SHA and tenant-auth/RLS/role checks, subscription entitlements, backups, current dependency audit disposition, customer onboarding smoke.
7. ENABLED — tenant provisioned idempotently, correct roles, scoped user invites; never copy another customer's content.
8. ACTIVATED — starter data loaded by customer authorization, sales pipeline + next actions established; WhatsApp integration activated **only** after vendor approval.
9. ACCEPTED — training, workflow demo and client acceptance recorded.
10. REVIEWED — day-7/day-30 metrics, support hours, tenant usage and next contractual renewal action.

## Mandatory stop conditions
- Security audit not resolved/explicitly approved; no certified hosted auth/tenant export; permission to import data missing; Meta onboarding unavailable for promised scope.
- The current GitHub preview or Vercel READY status is NOT commercial runtime approval.
- Never advertise AI agent outcomes or WhatsApp features that have not passed actual provider E2E.
- Do not collect customers' passwords, WhatsApp tokens, Meta system user secrets or Supabase service role keys through email/chat.
- Customer billing prices must reflect a signed quote; site display is not proof the corresponding deterministic billing system is configured.

## Pilot acceptance evidence
| Gate | Evidence required |
| --- | --- |
| Account access | signed-up and verified email, login/logout/session, password reset and 2 supported devices |
| Tenant privacy | 2-tenant negative access, owner vs employee access and private export authorization |
| Sales execution | lead create, assign, next action, follow-up, appointment and deal updates with audit trail |
| Data migration | import permission, sample reconciliation, rejection/error report, cleanup policy |
| Billing | contract version, entitlements and correct status; no fictitious revenue |
| Operations | 24h post-release error review, support route, owner/admin handoff and rollback readiness |

## Go-to-market funnel test
Start with 10 consent-based prospect interviews, record current monthly spend, lead volume, current tools and actual willingness to pay. Aim for 2–4 supervised design-partner pilots only **after** hosted certification. Publishing the page or opening an account is not an accepted sales contract.

## Separation
WS7 must clear commercial release gates. PR #40 is a customer-facing pilot funnel candidate, independently reviewed and staged. Neither PR is authorization to deploy Production.
