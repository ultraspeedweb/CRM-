# SatışDesk — Autonomous Revenue OS Execution Plan

Status: ACTIVE EXECUTION SOURCE OF TRUTH
Date: 2026-10-04
Branch: feat/autonomous-revenue-os-foundation-20261004
Product North Star: docs/SATISDESK_PRODUCT_MASTER_PLAN.md

## Decision

Traditional CRM is removed as SatışDesk's product direction.

Existing lead/customer/deal/contact capabilities are retained only as internal commercial data primitives where they support the Revenue & Growth OS. Do not spend roadmap capacity reproducing generic CRM features, generic dashboards or menu parity with incumbent CRMs.

Target product:

**Governed Autonomous Revenue & Growth Operating System**

Operating loop:

**Sense -> Understand -> Predict -> Decide -> Policy/Approve -> Act -> Verify -> Learn**

UX loop:

**Signal -> Insight -> Decision -> Action -> Verified Result**

## Execution Rules

1. No new generic CRM workstream.
2. Do not delete useful existing data foundations merely because they resemble CRM primitives.
3. Replace generic dashboard UX progressively with role-specific operating surfaces.
4. Every workstream must connect to the Business Digital Twin / Revenue Graph.
5. Every important metric must be attributable and drillable where feasible.
6. Every high-impact automated action requires policy/permission/audit and verification.
7. Merge only after required tests/gates pass.
8. Keep tenant isolation and Project Security Shield mandatory.
9. Do not expand into generic ERP; commerce exists to improve revenue, margin and goal execution.
10. Commercial GO is based on differentiated end-to-end outcomes, not CRUD completeness.

# Workstream Map

## WS-A — Product Shell & Role Contract [P0]

Goal: establish the new product identity and role boundaries.

Deliverables:
- Route/navigation contract for Employee Execution Cockpit.
- Route/navigation contract for Company Owner Growth Command Center.
- Platform Owner Control Plane contract.
- Customer Portal boundary (progressive, not launch-blocking unless required by launch package).
- Explicit role/permission matrix.
- Remove/rename generic CRM-first navigation language where it misrepresents product purpose.
- Preserve underlying sales data primitives.

Exit gate:
- Owner, manager and employee cannot accidentally receive the same generic dashboard.
- Authorization tests prove role/tenant boundaries.

## WS-B — Revenue Graph / Business Digital Twin Foundation [P0]

Goal: create the canonical attribution model used by every intelligence layer.

Deliverables:
- Canonical IDs/relationships for organization, branch/team, employee, customer, product/service, channel/campaign, quote/order and goal.
- Event/activity model for commercially meaningful actions.
- Revenue/margin attribution contract.
- Data provenance/source fields for imported/integrated data.
- Historical timestamps/status transitions needed for velocity/aging.
- Data-quality checks for missing/ambiguous attribution.

Exit gate:
- A sale/order can be traced to product, customer, responsible actor, source/channel and goal contribution where applicable.
- Cross-tenant leakage tests pass.

## WS-C — Goal Intelligence Engine [P0]

Goal: make company targets executable, forecastable and diagnosable.

Deliverables:
- Goal schema: metric, baseline, target, period, scope, owner, milestones.
- Goal progress calculation.
- Expected-vs-actual trajectory.
- Required run rate.
- Forecast/end-state projection.
- Goal status: on-track / at-risk / off-track using documented logic.
- Goal decomposition by employee/team/product/channel/time.
- Gap-driver explanation.

Exit gate:
- Owner can set a measurable goal and see current progress, expected progress, remaining gap, required run rate, forecast and primary drivers.
- Calculations have deterministic tests.

## WS-D — Employee Execution Cockpit [P0]

Goal: employee sees what to do now, not a reporting dashboard.

Deliverables:
- Today / Next / Overdue execution queue.
- Ranked opportunities/tasks.
- Customer context and unified activity summary.
- Quote/order/product context needed to execute.
- Personal target contribution.
- Next Best Action contract with reason/evidence.
- AI suggested response/action behind permissions.
- Clear completion/outcome capture.

Exit gate:
- Employee can start the day and execute prioritized work without navigating generic CRM lists.
- Actions update the Revenue Graph and goal progress.

## WS-E — Company Owner Growth Command Center [P0]

Goal: owner operates the company toward goals.

Deliverables:
- Goal trajectory and forecast.
- Revenue/gross margin and pipeline coverage.
- Top positive/negative drivers.
- Employee/team contribution and bottlenecks.
- Winning/declining products.
- Channel contribution.
- Inventory/quote/order risks relevant to target.
- Recommended decisions/actions.
- Approval queue.
- Drill-down to evidence.
- Excel/PDF reporting for decision-grade views.

Exit gate:
- Owner can answer: Are we reaching the target? Why? What should change? What requires my approval? Did prior actions work?

## WS-F — Platform Owner Control Plane [P0]

Goal: operate SatışDesk as a SaaS platform.

Deliverables:
- Tenant/company administration.
- Plans/subscriptions/add-ons/entitlements.
- Services and pricing management.
- Feature enable/disable and show/hide.
- Demo/Live mode.
- Usage/limits.
- AI/automation usage and cost visibility.
- Integration health.
- Security/audit/tenant health.
- Platform revenue metrics.

Exit gate:
- Platform owner can package and control customer capabilities without normal tenant subscription constraints.

## WS-G — Product, Order & Inventory Revenue Layer [P1]

Goal: know what entered stock, what sold, what makes money and what is blocking growth.

Deliverables:
- Product/service catalog and categories.
- SKU/barcode where relevant.
- Cost/selling price/tax/price lists.
- Suppliers and inbound stock.
- Warehouses/stock movements/reservations.
- Orders/order items.
- Returns/cancellations.
- COGS/gross margin.
- Low-stock and stock-out risk.

Exit gate:
- Product profitability and inventory movement reconcile to orders/sales within defined accounting scope.

## WS-H — Winning Product & Opportunity Intelligence [P1]

Goal: identify profitable growth opportunities rather than top-line popularity.

Deliverables:
- Units/revenue/margin/conversion/velocity/turnover/returns/discount dependency/trend.
- Winner / Growth Opportunity / Volume-Low Margin / High Margin-Low Volume / At Risk / Dead Stock classifications.
- Evidence-backed product recommendations.
- Stock-out revenue-at-risk signal.
- Product contribution to goals.

Exit gate:
- A product is never called a winner using revenue alone.
- Owner can drill from classification to evidence.

## WS-I — Quotes, Pricing & Approval Engine [P1]

Goal: turn commercial intent into governed offers and orders.

Deliverables:
- Quote items/products/services.
- Price lists.
- Discount rules by role.
- Approval thresholds.
- Quote versions/status/view/accept/reject where supported.
- PDF/print.
- Follow-up automation.
- Accepted quote -> order/deal transition.

Exit gate:
- Unauthorized discounts cannot bypass approval.
- Quote lifecycle is auditable end-to-end.

## WS-J — Omnichannel Customer 360 [P2]

Goal: one customer truth across communication sources.

Deliverables:
- Identity resolution rules.
- Unified timeline.
- WhatsApp integration foundation.
- Instagram/Facebook/Messenger connectors where official APIs permit.
- Email.
- Website forms/live chat.
- Lead/ad sources.
- Human handoff with context.

Exit gate:
- Same customer is not treated as unrelated records across connected channels when identity can be safely resolved.

## WS-K — Website / Store / Connector Framework [P2]

Goal: make SatışDesk ecosystem-ready and globally extensible.

Deliverables:
- Reusable connector interface.
- Webhook ingestion/outbound events.
- Sync state/retry/idempotency/observability.
- Customer/product/order/status sync contracts.
- Inventory sync safeguards.
- Attribution contract.
- Progressive connectors for commercially relevant store/site platforms.

Exit gate:
- New connector can be added without hard-coding its domain logic throughout core modules.

## WS-L — Decision, Policy & Action Engine [P2/P3]

Goal: convert insight into safe execution.

Deliverables:
- Recommendation object with evidence, expected outcome and confidence/limitations.
- Policy checks.
- Human approval state.
- Tool/action execution state.
- Retry/failure/handoff state.
- Audit record.
- Action Outcome Ledger.

Exit gate:
- High-impact action cannot execute outside its authority boundary.
- Executed actions have verifiable outcomes/status.

## WS-M — Scenario Planning & Forecast Simulation [P3]

Goal: help owner evaluate decisions before acting.

Deliverables:
- What-if model for conversion, price/discount, stock, product mix, channel mix and staffing assumptions.
- Goal impact projection.
- Revenue/margin-at-risk projections.
- Clear separation between simulation and actual data.

Exit gate:
- Simulation never presents assumptions as facts and exposes inputs used.

## WS-N — AI Revenue & Growth Copilot [P3]

Goal: intelligence embedded in workflows, not chatbot theater.

Deliverables:
- Conversation/customer summaries.
- Qualification/routing assistance.
- Next Best Action.
- Suggested replies.
- Deal risk.
- Goal gap diagnosis.
- Product/channel opportunity insights.
- Management briefing.
- Scenario explanation.

Exit gate:
- AI output is tenant-scoped, permission-aware, evidence-linked where required and covered by evals for critical tasks.

## WS-O — Automation & Governed Agents [P3]

Goal: execute repetitive revenue work safely.

Deliverables:
- Event/rule engine.
- SLA reminders/escalations.
- Quote follow-up.
- Stalled opportunity rescue.
- Low-stock/winner alerts.
- Goal-off-track action plans.
- Bounded specialist agents with explicit tools/permissions.

Exit gate:
- No agent can self-expand authority.
- Automation actions are observable and reversible/controlled where appropriate.

## WS-P — Independent Verifier, Evals & Outcome Measurement [P0 ongoing / P3 depth]

Goal: never trust autonomous claims without evidence.

Deliverables:
- Deterministic business-rule tests.
- AI eval datasets/scenarios for critical capabilities.
- Tool result verification.
- Contradiction/anomaly checks.
- Recommendation quality metrics.
- Action outcome measurement.
- Failure/retry/handoff telemetry.

Exit gate:
- Critical AI/automation capability has explicit acceptance criteria and regression evidence.

## WS-Q — Proactive Owner Briefing [P2/P3]

Goal: bring decisions to the owner instead of requiring dashboard hunting.

Deliverables:
- Daily/weekly change summary.
- Goal/forecast status.
- Biggest opportunity/risk.
- Product/channel/team changes.
- Approval requests.
- Executed actions and verified results.
- Progressive delivery through in-app/email/WhatsApp where permitted.

Exit gate:
- Briefing is concise, evidence-backed and actionable.

## WS-R — Global Productization [P0 foundation / P4 expansion]

Goal: make internationalization architectural.

Deliverables:
- Turkish/Arabic/English first-class UX.
- Locale/currency/time/tax handling.
- RTL quality.
- Import/export/migration tools.
- API/webhooks.
- White-label/custom-domain readiness where justified.
- Accessibility/responsive/PWA quality.
- Enterprise audit/roles/approvals/data portability.

Exit gate:
- No core flow assumes one language, one currency, one channel or one market.

## WS-S — Security Shield & Tenant Governance [P0 ongoing]

Goal: security as product capability.

Deliverables:
- Deny-by-default authorization.
- RLS/tenant isolation.
- RBAC/ABAC.
- IDOR/BOLA/privilege escalation protection.
- API/input/AI firewall controls.
- Secrets/service-role/RPC hardening.
- Webhook verification/idempotency.
- Dependency/secret/CI gates.
- Logging/anomaly/audit trail.

Exit gate:
- Security gates pass before merge/deploy for affected scope.

# Execution Sequence

Do not run all workstreams as independent feature projects. Execute in dependency order.

### Wave 0 — Protect the foundation
WS-S + WS-P baseline. Keep existing production functionality working. No destructive CRM purge.

### Wave 1 — Establish differentiated P0
WS-A -> WS-B -> WS-C, then WS-D + WS-E + WS-F on the same contracts.

This is the first major commercial milestone: SatışDesk visibly stops behaving like a generic CRM.

### Wave 2 — Connect revenue reality
WS-G -> WS-H -> WS-I. Connect products, stock, orders, margin and offers to goals.

### Wave 3 — Connect the outside world
WS-J -> WS-K, while extending attribution into channels/stores.

### Wave 4 — Governed autonomy
WS-L -> WS-N -> WS-O, with WS-P verification throughout. WS-M and WS-Q consume these capabilities.

### Wave 5 — Global scale
Deepen WS-R and platform packaging once the differentiated operating loop is production-proven.

# First Implementation Slice

Start here, not with cosmetic redesign:

1. Define role/permission contract and route ownership.
2. Define Revenue Graph attribution contract.
3. Implement goal domain model and deterministic goal-progress/run-rate service.
4. Build Company Owner Goal Command Center vertical slice using real tenant data.
5. Build Employee Execution Queue vertical slice tied to the same goal and action model.
6. Add action/outcome event capture foundation.
7. Verify tenant isolation, role separation and calculations.
8. Only then expand into product/inventory/order intelligence.

The first slice must demonstrate one complete differentiated story:

**Owner sets target -> system calculates trajectory/gap -> system identifies operational drivers -> employee sees prioritized action -> action is completed -> outcome updates business state -> owner sees verified progress.**

# Commercial Milestones

## M1 — Differentiated Core
Owner Goal Command Center + Employee Execution Cockpit + role isolation + goal engine + real data.

## M2 — Revenue Intelligence
Products/orders/inventory/margin + winning product intelligence + quotes/pricing approvals.

## M3 — Connected Revenue OS
Omnichannel + website/store connectors + reliable attribution.

## M4 — Governed Autonomous Growth
Decision/action engine + AI copilot + automation/agents + verifier + outcome ledger.

## M5 — Global Platform
International productization + enterprise controls + capability packaging.

# Definition of Done for Every Workstream

A workstream is DONE only when:
- Data model/migration is reviewed and tenant-safe where applicable.
- Authorization/RLS is tested.
- Core business logic has deterministic tests.
- UI is role-appropriate and uses real data, not fake KPI theater.
- Error/empty/loading states exist.
- Relevant localization is complete.
- Observability/audit is included for material actions.
- Required E2E passes.
- Security/quality gates pass.
- Documentation/contracts are updated.
- Production verification is complete before claiming commercial readiness.

# Anti-Scope / Explicitly Rejected Direction

Do not spend roadmap time on:
- Building a generic CRM clone.
- Copying competitors' menu structures for parity.
- Decorative AI chat without operational context/actions.
- Static dashboard cards with no decision/action path.
- Generic ERP/accounting depth unrelated to revenue/growth loop.
- Autonomous actions without policy/approval/audit/verification.
- Features that cannot explain which business problem they solve.

# Current Start Point

Active implementation branch:

`feat/autonomous-revenue-os-foundation-20261004`

This execution plan is the workstream source of truth. Implementation should proceed through the first vertical slice before broadening scope.