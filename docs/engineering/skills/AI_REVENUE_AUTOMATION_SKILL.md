# AI Revenue Automation Skill

## Objective
Turn customer and commerce signals into safe, explainable next actions for sales teams without allowing AI to become an unbounded CRM authority.

## Inputs
Lead/deal state, owner, stage age, recent activities, customer intent, quotes/orders/bookings, product/service interest, objections, loss reasons and permitted engagement signals.

## Outputs
Prioritized Today/Next/Overdue actions, suggested outreach, risk/opportunity flags, follow-up timing, proposal/quote assistance and human-readable rationale.

## Rules
AI suggestions never silently change ownership, pricing, discounts, contract terms, deal stage, payment state or customer consent. Protected changes use deterministic server actions with RBAC/ABAC, tenant scope and audit.

## Workflow
1. Gather only tenant-scoped evidence.
2. Calculate deterministic commercial facts first.
3. Use AI for synthesis, prioritization and language where useful.
4. Attach evidence/rationale to every recommended action.
5. Require policy approval for protected mutations.
6. Record outcome so recommendation quality can be evaluated.
7. Measure acceptance, conversion lift, false-positive rate, stale-action rate and time saved.
8. Maintain human handoff and override paths.

## Commerce integration
Treat external commerce platforms, Sovereign and future storefront/POS systems as event sources through stable contracts. CRM consumes customer/revenue signals but does not duplicate order/payment truth.

## Garfix hooks
Garfix monitors automation quality, policy violations, drift, failed actions and regression metrics and can pause a faulty automation under policy.

## Definition of Done
Revenue automation produces useful prioritized action with evidence, preserves tenant/security boundaries and cannot create unauthorized commercial commitments.
