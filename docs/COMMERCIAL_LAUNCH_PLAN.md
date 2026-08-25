# SatışDesk — September 2026 Revenue Plan

## Commercial outcome

- Deadline: 30 September 2026.
- Primary KPI: TRY 200,000 in cash collected, excluding VAT and Meta usage fees.
- Offer math: 4 Founding Pilot customers × TRY 50,000 paid upfront.
- Pilot scope: setup, pipeline design, first data import, up to 5 users, team training, first month of managed launch support, and WhatsApp activation when the customer supplies an approved Meta business number.
- Promise boundary: we promise implementation and operating support, not guaranteed sales results for the customer.

## Funnel required

| Stage | September target | Operating definition |
| --- | ---: | --- |
| Qualified target accounts | 160 | Turkish real-estate team selling to international buyers, multilingual and visibly using WhatsApp |
| Two-way conversations | 80 | A decision maker or manager replies and discusses the workflow |
| Discovery calls | 24 | 20-minute call with current process, lead volume and pain confirmed |
| Live demos | 16 | Demo uses the prospect's language mix and a realistic lead journey |
| Proposals | 8 | Written scope, start date and TRY 50,000 payment request sent |
| Paid pilots | 4 | Payment collected and kickoff booked |

This is a provisional bottom-up target because no prior SatışDesk conversion history exists. Review conversion rates every Friday and double the top-of-funnel volume if booked demos fall below pace.

## Daily operating cadence

- 09:00: review yesterday's replies, overdue follow-ups and cash collected.
- 09:30–11:30: research and contact 8 new qualified accounts.
- 12:00: follow up all replies within 15 minutes during business hours.
- 14:00–17:00: discovery calls, tailored demos and proposals.
- 17:30: update every account in SatışDesk; no opportunity may exist only in WhatsApp.
- Friday: inspect funnel conversion, objections, demo-to-proposal rate and next week's forecast.

## Decision KPIs

1. **Cash collected** = successful customer payments received in September. Target TRY 200,000. This is the only revenue KPI; signed but unpaid proposals do not count.
2. **Demos completed** = qualified live demos attended by a decision maker. Target 16. This is the leading indicator most directly controlled by outreach quality.
3. **Paid-pilot conversion** = paid pilots ÷ proposals. Target 50% provisionally; investigate offer, urgency and trust if it falls below 30%.

Guardrails:

- 30-day cancellation/refund rate below 10%.
- Time to first usable workflow below 3 business days after receiving customer access and data.
- No customer data imported without documented permission; no Meta or Supabase secrets in browser code or Git.

## Offer and qualification

Best-fit customer:

- 3–20 salespeople.
- Handles Arabic, Turkish and/or English buyers.
- Receives leads through WhatsApp, Instagram, portals or web forms.
- Has missed follow-ups, unclear ownership, slow response or fragmented spreadsheets.
- Decision maker can attend one discovery and one setup session.

Disqualify for the September pilot if the business has no active lead flow, wants a fully custom ERP, cannot provide legal access to its WhatsApp Business assets, or will not assign an internal owner.

## Two-day product gate

Before paid onboarding:

- Production signup, organization bootstrap and login verified.
- Lead → follow-up → appointment → deal flow verified end to end.
- WhatsApp webhook signature verification and idempotent storage verified; live activation marked pending until Meta credentials are supplied.
- RLS isolation, roles, dependency audit, typecheck, lint, tests and production build pass.
- Backup/rollback path and deployment status recorded.

## Evidence used for segment choice

The first segment is supported by current public evidence that international-property agencies in Istanbul explicitly operate multilingual teams and WhatsApp-first client journeys, including [Bosphorus Brokers](https://www.bosphorusbrokers.com/), [Property Turkey Istanbul](https://www.propertyturkeyistanbul.com/), [Right Home](https://www.righthome.com.tr/en/our-services/1/real-estate-consultancy), and [Durukan Real Estate](https://durukanrealestate.com/en/). These are prospects and market evidence, not endorsements.
