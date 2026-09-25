# SatışDesk Revenue OS

## Commercial mission
Ship a sellable AI-first Customer & Sales Operating System quickly, then expand from real revenue.

**North star:** One Customer → One Truth → One Next Best Action.

## Product surfaces
- Employee Workspace: Today queue, Customer 360, inbox, leads, follow-ups, appointments, deals, AI copilot.
- Company Dashboard: team, pipeline, revenue, channels, campaigns, automation, integrations, AI controls, reports.
- Customer Portal: orders/services/appointments/messages where the vertical requires it.
- Platform Control Plane: tenants, users, plans, subscriptions, quotas, integration health, AI usage/cost, domains, white-label, audit, incidents and platform revenue.

## Core architecture
Sources (web/forms/WhatsApp/ads/stores) → Connector Framework → Normalize → Identity Resolution → Customer 360 → Event Engine → CRM/Support/Automation/AI/Analytics.

### Customer 360
Resolve one real customer across phone, email, WhatsApp, forms, ads, Shopify and WooCommerce while preserving source and journey history.

### Event Engine
Canonical events drive automation, AI and analytics. Initial events: lead.created, message.received, follow_up.due, appointment.booked, deal.stage_changed, order.created, payment.completed, deal.won.

### Connector Framework
All integrations use a shared contract for authentication, API/webhook ingestion, normalization, idempotency, identity resolution, event emission, health/observability and tenant isolation.

## AI Sales Agent
The SatışDesk Agent is operational, not a decorative chatbot. It understands inquiries, retrieves Customer 360 context, qualifies, scores, summarizes, suggests replies, recommends next action, proposes follow-up/appointments, routes work, detects stale/risky opportunities, escalates and hands off to humans.

Execution contract: **AI proposes → Policy authorizes → Tool executes → Audit records → Independent verification where risk requires it → Human approval/handoff when required.**

Every action carries organization context, authenticated actor, permission check, validated input, idempotency where applicable, audit record and outcome. Critical, financial, destructive, terminal-state and bulk outbound actions require approval initially.

## Manager Assistant
Answers operational questions from authorized tenant data: new/qualified/uncontacted leads, overdue follow-ups, appointments, at-risk deals, campaign/source performance, team workload and recommended interventions.

## Commercial V1 — fastest path to money
1. Auth + organization onboarding.
2. Leads + basic Customer 360.
3. Pipeline/deals.
4. Follow-ups + appointments.
5. Employee/team roles and permissions.
6. Sales Cockpit / Today Queue / Next Best Action.
7. Notifications + assignment/escalation.
8. Unified Inbox foundation.
9. WhatsApp + web/form intake.
10. Governed AI Agent V1 + human handoff.
11. Essential reports.
12. Plans/subscriptions/usage limits.
13. Platform Control Plane essentials.
14. Arabic/Turkish/English production quality.

## Revenue expansion after first paying users
- Shopify connector.
- WooCommerce connector.
- Orders and purchase history.
- Meta/Google/TikTok attribution.
- Event-driven Automation Builder.
- Advanced analytics and forecasting.
- Email/calendar connectors.
- White label + custom domain.
- Agency/reseller controls.

## Dashboard responsibilities
### Employee
Today queue, urgent replies, overdue follow-ups, priority leads, appointments, assigned deals, AI recommendations and personal performance.

### Company
Revenue/pipeline, funnel, response SLA, stale opportunities, employee performance, source/channel performance, integrations, automation and AI policy.

### Customer
Profile, orders/services, appointments, status/documents and support entry points only where useful.

### Platform
Tenants/status, users, plans/billing, defensible MRR/ARR, quotas, connector/WhatsApp/Meta/AI health, white-label/domain state, errors, audit, feature flags and platform health.

## Execution order
1. Preserve verified lifecycle and quality gates.
2. Sales Cockpit / Today Queue using existing data and no migration unless proven necessary.
3. Complete Employee + Company + Platform operational dashboard gaps.
4. Notification center + assignment/escalation.
5. Governed AI Agent runtime + tools + audit + handoff.
6. Unified Inbox + WhatsApp/web intake hardening.
7. Billing/plans/subscriptions/limits + commercial Platform controls.
8. Sell Commercial V1 and onboard pilots.
9. Shopify + WooCommerce through Connector Framework.
10. Attribution + Automation.
11. White label/custom domain/agency layer.

## Current slice — P0 Sales Cockpit
Use existing leads, conversations, follow_ups, appointments and deals. Deterministically rank overdue follow-ups and reply-needed customers first, then high-score neglected leads, upcoming appointments and stale active deals. Show reason, urgency and direct action. AI explanation comes only after deterministic behavior is reliable.

## Definition of Done
A feature is done only when the user outcome works end-to-end; organization isolation/RLS and authorization are proven; AR/TR/EN are complete; loading/empty/error/mobile states work; tests are updated; security/database gates pass where relevant; critical E2E passes; failures are observable; and exact release SHA is verified.

## Product discipline
Revenue before breadth. One complete vertical slice at a time. No speculative infrastructure, disconnected feature dumping, cross-project coupling, client service keys, or production promotion without exact-SHA verification.
