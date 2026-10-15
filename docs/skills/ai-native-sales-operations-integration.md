# Skill: AI-Native Sales & Operations Integration

Status: PLANNED SKILL / NOT PRODUCTION CERTIFIED
Origin: Product design discussion 2026-10-15.
Purpose: extract proven capabilities from messaging AI agents and adapt them as first-class product functions rather than copy vendors.

## Shared contract
- Channels via official APIs/webhooks: WhatsApp Business Platform, Instagram Messaging, site chat, optionally email.
- Connector verifies sender signatures, tenant ownership, token scope, inbound idempotency, rate limits, retries and delivery status.
- Agent uses organization-scoped approved product catalog, prices, stock, service policy and CRM context; no fabricated prices, stock, discounts or delivery promises.
- Supported locales: Arabic (including dialect handling), Turkish, English; voice transcription must be opt-in and accurately documented.
- Actions are server-owned tools: fetch catalog/inventory, quote shipping, qualify lead, create draft order, reserve resources, create payment link, record payment webhook, hand off to human. AI does not directly write financial truth.
- Financial actions must rely on authoritative server validation, explicit permissions, customer consent and provider callbacks.
- Privacy: strict tenant isolation/RLS, secret isolation, retention controls, redaction, auditing, consent and opt-out for outbound campaigns.
- Human handoff for disputes, uncertain knowledge, atypical discounts, sensitive actions; toggle auto/human mode by tenant/channel.
- Observability: tracing, errors, queue health, delivery, cost per conversation, lead conversion, escalation, latency, opt-out.
- Garfix may observe and coordinate ONLY through scoped read/execute APIs; no cross-project database coupling and no unrestricted self-healing in Production.

## Product rollout order and gates
P0: Preserve current commercial-launch closure scope; no new features added to production release.
P1: Audit existing connector and inbound/outbound WhatsApp on isolated Staging; real Meta credentials from secure secrets, signed webhooks, idempotency, delivery receipts and human fallback E2E.
P2: AI response in shadow mode, then allowlisted pilot; scoped knowledge retrieval; verify correctness of actual catalog/prices, Arabic/Turkish/English; hallucination and prompt-injection tests.
P3: Full CRM conversion flow (lead -> qualification -> quote -> draft order/deal -> approved payment link -> payment webhook -> confirmation) using deterministic server actions. Negative cases and replay tests.
P4: Instagram messages, optional speech-to-text, outbound consent campaigns and opt-out safeguards; Meta compliance verification.
P5: Garfix monitor adapter, incident playbooks, scoped alerts and recovery; multi-tenant data leak tests.
P6: Commercial certification with verified deployment SHA, live test evidence, availability, failure handling, owner-approved rollout and GO/NO-GO.

## Project allocations
- SatışDesk owns sales inbox, contacts, opportunities, deals, automation rules, human handoff and AI sales-agent UX.
- Garfix owns runtime integrity, connector health, guardrails, diagnostics and authorized remediation; stays an independent product.
- Sovereign may reuse the same design for service discovery and booking assistance, respecting its no-prebooking-contact policy and existing payment/booking authority.
- Turkey–Syria commerce can later reuse product Q&A, inventory, draft orders, delivery quotes and payment confirmation.
- Shared logic should be a versioned interface/library or service, NEVER direct sharing of tenant databases or credentials.

## Acceptance evidence
A feature is only 'built' if linked to code/PR; only 'working' if supported by staging E2E with real service connector; and only 'launched' after production smoke tests and owner authorization. Do not infer readiness from README, passing build, or mock tests.

## Constraints
No unrelated refactor, no production modifications, no database writes/production credentials in examples, no unofficial WhatsApp automation, no bulk unsolicited messaging.

## SatışDesk current evidence
The main branch includes a signed WhatsApp webhook with lead and conversation creation; new conversations default to human handling. This DOES NOT demonstrate fully automated AI replies or operational Meta connection. Instagram appears as a lead source, not verified live messaging.
