# WS-B — Revenue Graph / Business Digital Twin Contract

Status: STACKED IMPLEMENTATION CONTRACT — NOT COMMERCIAL CERTIFICATION
Date: 2026-10-06
Branch: feat/revenue-graph-foundation-20261006
Parent candidate: 7977d80abbd3904a08f324d6678dee5099f6ad6e
Workstream: WS-B

## Business outcome
Create a canonical, tenant-safe attribution model over the commercial data SatışDesk already has, so downstream goal intelligence can explain where a revenue result came from instead of aggregating anonymous totals.

Trace where current data permits:
Organization -> Branch -> Customer/Lead -> Source/Channel/Campaign -> Responsible Employee -> Deal -> Quote Evidence -> Revenue Outcome

Missing or ambiguous attribution must be explicit; never fabricate links.

## Existing source of truth
Reuse organizations, branches, organization_members, lead_sources, leads, lead_events, deals, quotes, quote_items, follow_ups, appointments and conversations.
Do not create duplicate customer, employee, channel or opportunity tables for WS-B.

## Canonical v1 semantics
- Until WS-G introduces orders, a closed won deal is the canonical sale/revenue outcome.
- deal.stage = won means revenue outcome.
- deal.amount is the current canonical revenue value because existing reporting already uses it.
- An accepted quote is supporting commercial evidence; its total never silently replaces deal.amount.
- A material accepted-quote/deal mismatch is a data-quality condition.
- lead_id is the current customer/prospect anchor. Identity unification belongs to WS-J.
- deals.owner_user_id is the accountable revenue actor.
- leads.source_id -> lead_sources is the primary structured source; leads.source_channel is fallback evidence; UTM/campaign fields are supporting dimensions.
- leads.attribution is supplemental metadata only, never an authorization source.
- leads.branch_id is the current branch dimension.
- Product/order/margin attribution is not available until WS-G. Do not infer products from free-text quote lines and do not invent COGS/margin.
- Goal contribution is not available until WS-C. Do not fake it.
- Team attribution is not yet available as a stable dimension; branch and accountable employee remain the governed dimensions for v1.

## Canonical Revenue Graph record
organizationId, dealId, leadId, branchId, sourceId, sourceName, sourceChannel, campaignName, utmSource, utmMedium, utmCampaign, ownerUserId, dealStage, dealStageEnteredAt, dealAmount, dealCurrency, dealClosedAt, acceptedQuoteId, acceptedQuoteTotal, acceptedQuoteCurrency, acceptedQuoteAcceptedAt, revenueOutcome, revenueValue, revenueCurrency, dataQualityIssues.

## Data-quality taxonomy
Stable initial issue codes:
- missing_responsible_actor
- missing_source_attribution
- missing_revenue_value
- won_without_closed_at
- accepted_quote_currency_mismatch
- accepted_quote_value_mismatch
- missing_branch_dimension

Rules:
- Won + no deal amount => missing_revenue_value (blocking).
- Won + no owner => missing_responsible_actor (warning for revenue total; blocking for employee attribution).
- Won + no source_id and no source_channel => missing_source_attribution (warning for revenue total; blocking for channel attribution).
- Won + no closed_at => won_without_closed_at (blocking for time-window reporting).
- Accepted quote with different currency => accepted_quote_currency_mismatch and values are not compared.
- Accepted quote in same currency with material difference => accepted_quote_value_mismatch.
- Missing branch => missing_branch_dimension warning.

Material mismatch threshold: absolute difference greater than max(1 currency unit, 0.5% of deal amount). This never mutates financial values.

## Commercial event envelope
Required where applicable: eventName, organizationId, occurredAt, actorUserId, sourceType, sourceId, correlationId, dealId, leadId, metadata.
Initial stable names: lead.created, lead.qualified, followup.created, followup.completed, quote.sent, quote.accepted, deal.stage_changed, deal.won, deal.lost, outcome.recorded.
Existing lead_events remains valid evidence. A generalized ledger requires a reviewed Supabase migration.

## Permissions / RLS
- Every Revenue Graph query is organization-scoped.
- Underlying RLS remains the first enforcement boundary.
- New exposed-schema views must use security_invoker on supported Postgres versions.
- Do not introduce SECURITY DEFINER merely to make attribution queries work.
- No client-side service-role usage.
- Cross-tenant records must never fill missing attribution.

## Acceptance criteria
1. Deterministic service builds the canonical record from governed source rows.
2. Won revenue uses deal.amount and never silently substitutes quote totals.
3. Missing actor/source/value/time attribution is surfaced with stable issue codes.
4. Quote/deal inconsistencies are detected deterministically.
5. Source provenance resolves through tenant-scoped `lead_sources`; stage timing is carried for velocity/aging consumers.
6. Assembly rejects cross-tenant rows even if an upstream query regresses.
7. Cross-tenant negative tests pass for any new database object.
8. Any migration is generated with Supabase CLI, reviewed, and replayed from zero.
9. Exact-candidate database, quality, code verification and E2E gates pass.
10. Independent verifier confirms contract and implementation match.

## Explicit out of scope
- Goal schema/calculations (WS-C).
- Product/order/inventory attribution (WS-G).
- Cross-channel identity resolution (WS-J).
- Generic event-sourcing rewrite.
- Replacing existing reporting totals before reconciliation.
- AI-generated attribution.
- Production migration while PR #31 remains security-blocked.