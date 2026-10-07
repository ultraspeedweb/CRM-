# Commerce Signal Integration Skill

## Objective
Standardize how SatışDesk consumes events from Sovereign, web stores, POS and external marketplaces to build a complete customer and revenue view.

## Canonical event families
customer.created/updated; lead.intent_detected; quote.created/accepted/expired; order/booking.created/confirmed/cancelled/refunded; payment.authorized/paid/failed/refunded; shipment/fulfillment status; product/service interest; abandoned journey; support/handoff outcome.

## Workflow
1. Define producer, schema version and tenant identity.
2. Validate and authenticate the event.
3. Deduplicate by immutable event/idempotency key.
4. Resolve customer identity without unsafe cross-tenant merging.
5. Map event to CRM timeline, deal/account context and next-action logic.
6. Never overwrite source financial/order truth with inferred CRM state.
7. Support replay and out-of-order events.
8. Reconcile aggregate revenue against source systems.
9. Track lag, failure and dead-letter metrics.

## Design rule
CRM is the relationship/action system; commerce platforms remain transaction systems of record.

## Garfix hooks
Detect ingestion gaps, replay storms, identity conflicts, schema drift and reconciliation mismatch.

## Definition of Done
A commerce event is ingested once, attributed to the correct tenant/customer, visible in CRM context and safely replayable without corrupting transaction truth.
