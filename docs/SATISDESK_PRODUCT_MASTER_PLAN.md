# SatışDesk — Product Master Plan

Status: Source of Truth for product direction
Updated: 2026-10-04

## 1. Product Definition

SatışDesk is not a traditional CRM. It is a multi-tenant Sales & Commerce Operating System that connects goals, employees, customers, channels, products, inventory, quotes, orders, revenue, analytics, AI and automation into one operating loop.

Core promise:
- The employee knows what to do next.
- The company owner knows what is happening, what is working, what is failing and whether the company is moving toward its target.
- SatışDesk recommends and automates the next best actions.
- The platform owner controls tenants, plans, services, pricing, limits, integrations, security and platform economics.

## 2. Core Operating Loop

Channels -> Leads/Customers -> AI Qualification -> Employee -> Deal -> Quote -> Order -> Product/Inventory -> Revenue/Margin -> Analytics -> Goal Progress -> Recommended Actions -> Automation.

Every important record must be attributable where applicable to organization, branch/team, employee, customer, product/service, channel/campaign and time period.

## 3. Role-Based Workspaces

### 3.1 Employee Workspace
Daily execution workspace, not a generic dashboard.

Must include:
- My Today / Next / Overdue.
- Assigned leads, customers and deals.
- Conversations and omnichannel inbox.
- Appointments and follow-ups.
- Quotes and orders.
- Product catalog, available stock and allowed prices/discounts.
- Personal sales target and progress.
- Won/lost and conversion metrics.
- Commission when enabled.
- AI Sales Copilot: summary, lead priority, suggested response, next best action, risk warnings.

### 3.2 Company Owner / Manager Command Center
The primary customer management surface.

Must include:
- Revenue, gross margin and sales trends.
- Pipeline, forecast and conversion funnel.
- Goal progress and projected goal attainment.
- Employee/team performance and workload.
- Today / Next / Overdue across the company.
- Response time and follow-up SLA.
- Won/lost, loss reasons, stage aging and sales velocity.
- Product performance: units, revenue, margin, winners, laggards and dead stock.
- Inventory health and low-stock alerts.
- Channel/campaign performance and attributable revenue.
- Quotes, orders and approval queues.
- Drill-down from every KPI to underlying records.
- Reports and Excel/PDF export.
- Employee, role, permission, target and approval management.

### 3.3 SatışDesk Platform Owner Control Plane
Internal platform administration.

Must include:
- Tenants/companies and their status.
- Plans, subscriptions, add-ons and entitlements.
- Dynamic/manual pricing and service catalog.
- Feature flags and show/hide/enable/disable services.
- Demo vs Live controls.
- Usage limits and AI usage/cost.
- Platform revenue and subscription metrics.
- Integrations status.
- Security/audit/health visibility.
- Support/tenant administration.
- Platform owner is not treated as a normal paid tenant subscription.

## 4. Goal Intelligence & Growth Engine — Core Differentiator

A company must be able to define measurable business goals, for example:
- Reach TRY 1,000,000 monthly revenue.
- Sell 5,000 units this quarter.
- Reach 30% gross margin.
- Acquire 1,000 new customers.
- Raise conversion to 20%.
- Reduce overdue follow-ups below 5%.
- Grow a selected product/category/channel.

### 4.1 Goal Model
Each goal requires:
- Metric and target value.
- Baseline value.
- Start/end dates.
- Scope: company, branch, team, employee, product/category or channel.
- Owner/accountable person.
- Milestones.
- Leading and lagging indicators.

### 4.2 Progress Tracking
SatışDesk continuously calculates:
- Current value vs target.
- Percentage completion.
- Expected progress by current date.
- Actual vs expected trajectory.
- Required daily/weekly/monthly run rate.
- Forecasted end value.
- Probability/risk of missing the goal.
- Gap remaining.

Example: target TRY 1M/month, current TRY 420K. The system must not only show 42%. It must calculate elapsed time, remaining selling days, required daily run rate, current run rate, pipeline coverage and forecast whether the company is on-track or off-track.

### 4.3 Goal Decomposition
A company goal should be decomposable into operational drivers:
Revenue Target -> Orders Needed -> Qualified Opportunities Needed -> Leads Needed -> Activities/Follow-ups Needed.

It can also be decomposed by:
- employee/team,
- product/category,
- branch,
- channel/campaign,
- week/month.

The owner sees exactly where the target gap comes from.

### 4.4 Winning Product Intelligence
For every product/service calculate where data is available:
- Units sold.
- Revenue.
- Gross profit and margin.
- Conversion rate.
- Sales velocity.
- Inventory turnover.
- Return/cancellation rate.
- Discount dependency.
- Channel performance.
- Employee performance selling the item.
- Trend vs previous period.

Classify products into actionable groups such as:
- Winner: strong demand + healthy margin + sustainable stock.
- Growth opportunity: positive trend but underexposed.
- Volume seller / low margin.
- High margin / low volume.
- At risk: falling demand or margin.
- Dead/slow stock.

Never call a product a winner based only on revenue. Margin, returns, discounts, stock and trend matter.

### 4.5 Goal-to-Action Recommendations
The system should explain WHY a goal is on/off track and propose measurable actions, for example:
- Increase focus on Product A because it has stronger margin and conversion.
- Reassign neglected high-value leads.
- Recover overdue quotes.
- Increase stock for a winning SKU before stock-out.
- Reduce discounting on a product where demand remains strong.
- Shift effort from a weak channel to a higher-converting channel.
- Coach/assist an employee with low conversion or slow response.
- Launch a reactivation segment for previous customers.

Recommendations must be evidence-backed, measurable and linked to underlying records. High-impact actions require owner/manager approval according to permissions.

### 4.6 Goal Command Center
Owner view must show:
- Goal scorecard.
- On-track / At-risk / Off-track status.
- Actual vs expected trajectory chart.
- Forecast at deadline.
- Remaining gap and required run rate.
- Top positive drivers.
- Top blockers.
- Winning products.
- Best channels.
- Team contribution.
- Recommended actions.
- Action execution status and measured outcome.

This closes the loop: Goal -> Diagnose -> Recommend -> Execute -> Measure -> Learn.

## 5. Product, Inventory & Commerce Engine

Required entities/capabilities:
- Products/services, categories, SKU/barcode.
- Cost, selling price, tax and price lists.
- Suppliers.
- Purchase/inbound stock.
- Warehouses/locations.
- Stock movements and reservations.
- Low-stock/reorder alerts.
- Orders and order items.
- Returns/cancellations.
- Cost of goods, revenue, gross profit and margin.
- Product/customer/employee/channel attribution.

Core lifecycle:
Supplier/Purchase -> Stock In -> Available Inventory -> Quote/Order -> Sale -> Stock Out -> Revenue/Margin -> Return/Adjustment when needed.

## 6. Quotes, Pricing & Approvals

Quote lifecycle:
Customer -> Products/Services -> Quantity -> Price List -> Discount -> Tax -> Quote -> Approval -> Sent -> Viewed -> Accepted/Rejected -> Order/Deal.

Required:
- Quote templates and PDF/print.
- Versioning/status history.
- Discount limits by role.
- Approval workflow above thresholds.
- Price lists and customer-specific pricing when enabled.
- Quote follow-up automation.

## 7. Omnichannel & Customer 360

Target architecture: one customer identity and one timeline across supported channels.

Channels/integrations to support progressively where APIs and commercial constraints permit:
- WhatsApp.
- Instagram.
- Facebook/Messenger.
- Email.
- Website forms/live chat.
- Advertising lead sources.
- Other commercially relevant channels through connectors/webhooks.

Customer 360 should unify conversations, leads, deals, quotes, orders, products purchased, payments/status where available, activities and service history.

## 8. Websites, Stores & Commerce Connectors

Integrate progressively with relevant commerce platforms and company websites.

Connector responsibilities may include:
- Customer sync.
- Product/catalog sync.
- Inventory sync where safe.
- Orders and status sync.
- Channel/source attribution.
- Revenue attribution.
- Webhooks/API integration.

The desired trace is:
Campaign/Channel -> Conversation/Lead -> Employee -> Quote/Order -> Product -> Revenue/Margin.

## 9. Analytics & BI Layer

Not static metric cards. Dashboards require filters and drill-down.

Core dimensions:
- Time.
- Company/branch/team/employee.
- Product/category.
- Channel/campaign/source.
- Customer segment.

Core analytics:
- Revenue and margin.
- Funnel/conversion.
- Pipeline and forecast.
- Stage aging.
- Sales velocity.
- Win/loss reasons.
- Employee performance.
- Product performance.
- Inventory turnover.
- Channel ROI/attributed revenue where cost data exists.
- Repeat customers and cohorts where useful.
- Goal progress and forecast.

Every headline metric should be drillable to the records that created it.

## 10. AI Sales & Commerce Copilot

AI should assist decisions and execution, not be a decorative chatbot.

Capabilities:
- Conversation summaries.
- Lead scoring/priority support.
- Suggested replies.
- Next Best Action.
- Deal risk detection.
- Goal gap diagnosis.
- Winning-product and channel insights.
- Quote/follow-up assistance.
- Management summaries.
- Anomaly and opportunity detection.

AI recommendations must respect tenant isolation, role permissions, auditability and approval boundaries.

## 11. Automation Engine

Examples:
- New lead -> assign.
- No response within SLA -> remind/escalate.
- Hot lead -> manager alert.
- Overdue follow-up -> escalation.
- Quote unanswered -> follow-up sequence.
- Stalled deal -> rescue workflow.
- Low stock on winning product -> alert/reorder recommendation.
- Goal off-track -> diagnosis and recommended action plan.
- Won deal/order -> next operational workflow.

Automation should be event/rule based and measurable.

## 12. Supporting Platform Capabilities

Required or planned as appropriate:
- Customer 360.
- Teams/branches.
- Roles/RBAC and granular permissions.
- Custom fields/tags/segments.
- Goals/targets.
- Commissions.
- Approval workflows.
- Notifications center.
- Documents.
- Audit/activity timeline.
- Excel/PDF import/export/reporting.
- Public/integration API and webhooks.
- Integrations center.
- Localization: Turkish, Arabic, English.

## 13. Security & Governance

Project Security Shield applies across the platform:
- Deny-by-default authorization.
- Multi-tenant isolation and Supabase RLS.
- RBAC/ABAC where required.
- IDOR/BOLA and privilege-escalation protection.
- Input/API/AI firewall controls.
- Secrets and service-role protection.
- Secure RPC/SECURITY DEFINER patterns.
- Webhook verification and idempotency.
- Dependency/secret/CI security gates.
- Logging, anomaly detection and audit trail.
- Independent verification and regression before production closure.

## 14. Product Principles

1. Do not build features only to fill menus.
2. Every major module must solve an operating problem and connect to the business data graph.
3. Owner dashboards must answer: What happened? Why? What happens next? What should we do?
4. Employee screens prioritize execution over reporting.
5. Platform owner controls commercial packaging without code changes where practical.
6. AI recommendations must be grounded in measurable company data.
7. No metric without traceability/drill-down where feasible.
8. No Commercial GO merely because login, CRUD and a generic dashboard work.
9. Avoid becoming a generic ERP: prioritize the Lead -> Sale -> Product -> Revenue -> Intelligence loop.
10. Build core capabilities first, then package mature capabilities as sellable services/add-ons.

## 15. Commercial GO Definition

Commercial launch requires at minimum a coherent, tested customer journey with:
- Secure authentication/onboarding and tenant isolation.
- Employee Workspace.
- Company Owner/Manager Command Center.
- Platform Owner Control Plane.
- Core CRM/Sales Execution Engine.
- Quotes and sales/order flow required by launch scope.
- Product/catalog and inventory visibility required by launch scope.
- Goal tracking with meaningful progress/forecast visibility.
- Required channel integration(s) for the launch package.
- Analytics with trustworthy attribution and drill-down.
- Role/permission tests and critical E2E coverage.
- Security/quality gates passing.
- Production certification.

Advanced connectors and later ERP-like depth can ship progressively; the launch product must already deliver a differentiated operating loop rather than a generic CRM.

## 16. Roadmap Priority

P0 — Product identity and launch blockers
- Employee Workspace.
- Company Owner Command Center.
- Platform Owner Control Plane.
- Role/permission separation.
- Goal Intelligence foundation.
- Reliable Sales Execution Engine and production E2E.

P1 — Commerce operating loop
- Product/catalog.
- Orders.
- Inventory/stock movements.
- Enhanced quotes/pricing/approvals.
- Product profitability and winning-product intelligence.

P2 — Omnichannel and commerce integrations
- Unified inbox/customer timeline.
- Social/channel connectors.
- Website/store connectors.
- Attribution.

P3 — Advanced intelligence and automation
- Forecasting and goal decomposition.
- Recommendation engine.
- Advanced automation.
- Channel/product optimization.
- AI management copilot.

This document is the product-direction source of truth. New work should be evaluated against it instead of repeatedly rediscovering SatışDesk scope.