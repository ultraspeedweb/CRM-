# SatışDesk Connect Hub — WhatChimp benchmark and Sovereign adapter
Date: 2026-10-17 | Status: implementation blueprint, not a deployed integration

## Decision
Build the commercial capability natively in SatışDesk, using official Meta WhatsApp Cloud API as primary channel and optional third-party adapters (including WhatChimp subject to API contract). SatışDesk remains the operator-owned system of record for CRM, message timelines, team inbox, permissions, tasks, campaign consent and usage. Sovereign remains system of record for bookings, pricing, payments and customer profile. No database sharing.

## WhatChimp capability study
Primary sources: https://whatchimp.com/ , https://whatchimp.com/pricing/ , https://help.whatchimp.com/docs/whatsapp-business-api/what-is-whatsapp-business-api , https://help.whatchimp.com/docs/webhook-workflow/what-is-incoming-webhook-workflow .
Observable: shared team inbox; chatbot/AI; templates and broadcasts; contact segments; catalog/forms; Click-to-WhatsApp; roles; API/webhooks. Pricing currently advertises Basic $24/month and Pro $60/month when paid yearly, plus Meta messages. Do not copy marketing claims such as immunity from bans or approval time guarantees.

## Current SatışDesk foundation verified in source
- app/api/whatsapp/webhook/route.ts: Meta signature verification, phone-number-ID to tenant lookup, active-service check, inbound lead/conversation/message writes, delivery-status updates.
- lib/whatsapp.ts: HMAC verification, event parsing, token-env allowlist.
- Supabase: organizations, leads, conversations, messages, whatsapp_connections, audit_logs, billing_plans, organization_subscriptions and billing_events exist. Existing webhook does not establish a certified production outbound campaign or integration.

## Logical architecture
Sovereign (signed domain event, post-booking only) -> SatışDesk ingress API -> verified event envelope + idempotency ledger -> tenant/connection permission -> consent and booking-contact policy -> outbound message outbox -> Meta provider adapter -> delivery webhook -> SatışDesk conversation and analytics.
Other customer businesses -> SatışDesk isolated tenant connector -> same policy-enforced outbox.
WhatChimp (optional provider) -> connector interface -> inbound/outbound mapping; do not assume an undocumented endpoint, auth scheme or signature format.

## Event contract, version 1
Name: booking.confirmed, booking.updated, booking.cancelled, payment.completed, trip.reminder, customer.support_requested.
Payload:
```json
{
 "version": 1,
 "event_id": "<uuid>",
 "event_type": "booking.confirmed",
 "occurred_at": "<ISO timestamp>",
 "source": "sovereign",
 "source_tenant_id": "<uuid>",
 "booking_id": "<uuid>",
 "customer_reference": "<opaque scoped id>",
 "recipient_e164": "<phone>",
 "locale": "ar",
 "template_key": "booking_confirmation",
 "parameters": {"booking_reference":"<opaque booking reference>"}
}
```
Allowed booking fields must be minimum necessary and derived server-side from confirmed event data. No passport/KYC documents, payment-card data, secret tokens, or complete passenger manifests in payload, logs or templates.

## Ingress requirements
1. Per-source signing (rotatable HMAC key or asymmetric keys), timestamp tolerance, payload size caps, event schema validation, replay protection on (source, source_tenant_id, event_id).
2. Explicit binding table source_tenant_id -> SatışDesk organization_id; only a platform-approved mapping can be activated. Never trust organization ID from webhook as authority.
3. State transitions: event accepted -> eligible -> enqueued -> sent -> delivered/failed. Atomic idempotent state writes and retry/backoff, dead letter, operational metrics, kill switch.
4. Fail closed: unknown tenant, unconfirmed/invalid booking, missing recipient consent, disabled service, unapproved template, unavailable provider, exceeded budget, booking not eligible -> no send; audit reason.
5. Sovereign restriction is stronger than normal CRM marketing: **NO PRE-BOOKING CONTACT**; only after confirmed booking. Marketing campaigns from Sovereign-sourced contacts must not be enabled by default, even where contact exists. Separate valid marketing opt-in would still need business-rule approval.
6. Multi-tenant RLS and server-side authorization for every inbox, contact, template, connection, outbox and spend record. Never reveal cross-tenant identifiers.
7. Explicit cost accounting (Meta message category/country, provider charge, tenant budget, per-day hard caps), opted-out recipients and retention/deletion policies; apply current Meta platform policies.

## Product work packages and testable exits
**P0 — existing Meta channel:** exercise valid/invalid signature and replay; verify WhatsApp connection ownership, permission checks, inbound dedupe, outbound send, status webhook, stop switch and per-tenant isolation. Block commercial launch of messaging until sandbox and hosted verification pass.
**P1 — shared inbox:** unread queues, team routing, owner controls, templates, internal notes, status, mobile layout; verify two-agent and two-tenant browser flows.
**P2 — Sovereign adapter:** dedicated signed event endpoint, integration mapping UI with approval, post-booking eligible actions only, configurable branded booking templates, single booking E2E from Sovereign staging to SatışDesk staging to Meta sandbox and callback. No production integration before approval.
**P3 — outreach and AI:** campaign consent/segmentation and suppression, per-tenant spending controls, rate limits, safe human handoff, multilingual AI FAQs with audited tool permissions; start with internal tests, no unsolicited mass sends.
**P4 — optional WhatChimp adapter:** obtain vendor API documentation, official rate limits, auth/webhook semantics and terms; implement adapter and provider contract tests only after verified.
**P5 — commercial:** plan entitlements, Meta pass-through usage, trials, billing reconciliation, activation workflow, customer documentation and support SLAs. Only real hosted payment and customer tests qualify.

## Definition of DONE
One Sovereign confirmed booking triggers exactly one permitted booking confirmation after consent, with audit trail and delivery status; cancellation/updated booking use policy-specific templates; a pre-booking event and a replay send **zero** messages; another tenant sees **zero** Sovereign content; disabled service and exhausted budget cause **zero** sends; all hosted staging browser and provider contract tests succeed.

This plan is subordinate to SatışDesk full commercial release gate; no production deployment, vendor purchase, number migration or outgoing message was performed by authoring this document.
