# SatışDesk — Competitive Validation & Unit Economics (Working Model)
As of 2026-10-15. Research and simulation only; not live implementation or approved commercial prices.

## Evidence-based market benchmark
Source, price, and contract differences:
- Take App: Basic free with 50 orders/month recorded; Business $50/month after limited $1 first-month offer. Business includes 5 stores, 5 staff, 1,000 automated WhatsApp messages, 2,500 emails; no per-order platform commission. Official https://www.take.app/pricing
- Kommo: Base $25, Advanced $35, Pro $45 per user/month; enterprise custom. Official https://www.kommo.com/buy/tariff/
- respond.io: Starter $79, Growth $159, Advanced $279 per month displayed for annual billing, differentiated by active contacts, AI credits, users and feature limits. Official https://respond.io/pricing
- SleekFlow: Pro $109/month, Premium $279/month with yearly billing; usage and seat scope differ. Official https://sleekflow.io/en-us/pricing
- ikas: Lift TRY 39,948/year + VAT, Scale TRY 69,876/year + VAT at current promotional price. Official https://ikas.com/tr/e-ticaret-paketleri
- Ticimax: Advantage TRY 46,000/year promotional, Premier TRY 69,000/year. Official https://www.ticimax.com/e-ticaret-paketleri/
- WATI: complex regional/plan pricing; WhatsApp messages charged separately, AI add-ons can be billed separately. Do not quote a numeric all-in price without a live configured quote. Official https://www.wati.io/pricing/

### Comparability caveats
Per-seat vs per-store vs per-contact vs yearly prepaid are not equivalent. Separate Meta WhatsApp charges, AI credits, payment processing, onboarding, integrations, taxes, annual prepayment, promotional expiry and overages. Never compare normalized prices without including limits.

## Customer jobs scorecard (claims/research, not hands-on competitor account tests)
Scores: E = evidenced from official product/pricing feature copy, U = unverified. Do not award SatışDesk parity without production E2E.
| Job | Take App | Kommo | respond.io | ikas | SatışDesk target |
|---|---|---|---|---|---|
| Mobile-first quick product-to-order | E | U | U | E | SD-3 not certified |
| Unified cross-channel sales inbox | partial/verify | E | E | U | SD-2 in roadmap |
| Agent-controlled lead/deal workflow | U | E | E | U | WS8/9/12 |
| Profit/inventory/goal action loop | U | U | U | partial/verify | Master Plan primary differentiation |
| Multi-tenant SaaS owner controls | internal product capability | internal product capability | internal product capability | internal product capability | WS7/15 |

## Proposed pricing hypotheses (NOT approved)
Starter: TRY 1,990/mo.
Growth: TRY 4,990/mo.
Business: TRY 12,990/mo.
Enterprise: quotation.
Do not claim these have market validation. All amounts illustrative before VAT, payment processor fees and discounts.

## Model: spreadsheet-ready monthly unit economics (all illustrative assumptions)
Customer mix: Starter 50%, Growth 35%, Business 15%. Seats, AI use and support are limited per SKU, with excess usage billed transparently. Usage variable/direct servicing cost including compute, communications allowances, model token allowance, support labor and transaction support reserve:
Starter TRY 650/month; Growth TRY 1,600/month; Business TRY 4,000/month.
Therefore weighted revenue/tenant = 0.5*1990 + 0.35*4990 + 0.15*12990 = TRY 4,690.
Weighted direct cost/tenant = 0.5*650 + 0.35*1600 + 0.15*4000 = TRY 1,485.
Gross contribution/tenant = TRY 3,205; modeled direct gross margin = 68.34%.
These are examples, **not actual SatışDesk measured costs**.

| Paying companies | Modeled MRR TRY | Modeled direct costs TRY | Contribution before overhead TRY |
|---:|---:|---:|---:|
| 10 | 46,900 | 14,850 | 32,050 |
| 100 | 469,000 | 148,500 | 320,500 |
| 1,000 | 4,690,000 | 1,485,000 | 3,205,000 |

### Sensitivity to unexpected AI/Meta/support spend
For the same 4,690 TRY weighted ARPA: if cost per tenant is 1,485 / 2,500 / 3,500 TRY, direct margins are 68.34% / 46.70% / 25.37%. Overheads (engineering, acquisition CAC, VAT, payment fees, refunds, rent, non-variable staffing) are excluded. Gross contribution is NOT net profit.
At 100 paying companies, a 1,015 TRY/month increase in direct cost per tenant reduces contribution by TRY 101,500/month.

## Validation and approval gates
1. Measure actual model and WhatsApp/Meta provider invoices, time spent on support, Vercel/Supabase hosting, email/SMS, onboarding, payment fees and taxes; separate fixed from variable.
2. Compare official competitor onboarding demos (Take App, Kommo, respond.io) via authorized account/trial and timed scripts. No hands-on demo has yet been done in this research.
3. Structured customer discovery: 8–12 Turkish SMB decision makers, including WhatsApp-first multilingual sales and small retailers; collect incumbent vendor, current monthly spend, lead volume, objections, willing-to-pay under several configurations.
4. Run 2–4 controlled design partner pilots; measure time-to-first-value, successful lead->order, saved staff hours, 30-day retention, AI correctness and cost per transaction.
5. Owner approves price limits, discounts, entitlements, overages; stage billing/permissions and ensure no silent historical price alteration.
6. Keep SD-P0 launch blockers separate; none of the above grants authorization for Production changes.

## Initial feature design decisions
1. SD-2/WS9: signed WhatsApp integration first, inbound->Customer360->assigned follow-up, then Instagram.
2. SD-3/WS10: fast mobile storefront plus quote/cart/order lifecycle only when stock/tax/payment rules are authoritative.
3. SD-4/WS11: product margin, source attribution, goal gap and action-outcome ledger are the differentiators.
4. SD-5/WS12: AI suggestion -> policy check -> limited action -> independent outcome measurement.
5. SD-6/WS15: price-per-company + included seats/AI/contacts and usage metering; explicit Meta pass-through where applicable.
