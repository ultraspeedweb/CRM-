# WS-A — Product Shell, Role Contract & Product Design Gate

Status: IN PROGRESS
Branch: `feat/autonomous-revenue-os-foundation-20261004`
Depends on: Project Security Shield + Engineering Foundation
North Star: `docs/SATISDESK_PRODUCT_MASTER_PLAN.md`
Execution plan: `docs/AUTONOMOUS_REVENUE_OS_EXECUTION_PLAN.md`

## Business outcome

Stop presenting SatışDesk as one generic CRM workspace. Establish distinct operating surfaces for each role while preserving the existing commercial data primitives and security boundaries.

## Existing role truth

Current organization roles are:
- `owner`
- `admin`
- `manager`
- `agent`
- `viewer`

The current workspace resolves the active organization membership and role server-side. The existing sidebar is generic for every role. WS-A changes the shell contract before broader feature implementation.

## Role-to-surface contract

### Employee / `agent`
Primary surface: **Employee Execution Cockpit**.

Primary questions:
- What should I do now?
- Which customer/opportunity has highest priority?
- What is overdue?
- How am I contributing to the goal?

Default destination: `/work`

Allowed operational areas are scoped to assigned/authorized data. Management controls are not exposed merely by hiding UI; server/RLS authorization remains authoritative.

### Company Manager / `manager`
Primary surface: **Growth Command Center** with team-level management scope.

Primary questions:
- Is my team on track?
- What is blocking the target?
- Which employees/opportunities/products need intervention?
- What approvals/actions require attention?

Default destination: `/command`

### Company Admin / `admin`
Primary surface: **Growth Command Center**, plus tenant administration permitted by policy.

Default destination: `/command`

### Company Owner / `owner`
Primary surface: **Growth Command Center** with organization-level goal, people, product, channel, revenue/margin and approval visibility.

Default destination: `/command`

### Viewer / `viewer`
Primary surface: read-only **Insights** view.

Default destination: `/insights`

No execution or management mutation is implied by UI visibility.

### SatışDesk Platform Owner
This is a platform-level authority, not equivalent to tenant `owner`.

Primary surface: **Platform Control Plane**.

Target destination: `/platform`

Platform authority must be backed by an explicit platform-level authorization contract before the route is considered implemented. Do not infer platform authority from tenant ownership.

## Route contract

New product-facing route families:
- `/work` — Employee Execution Cockpit.
- `/command` — Company Owner/Manager Growth Command Center.
- `/insights` — authorized read-only intelligence surface.
- `/platform` — SatışDesk Platform Owner Control Plane; requires separate platform authorization.

Existing routes such as `/leads`, `/deals`, `/follow-ups`, `/quotes`, `/conversations` remain supporting operational modules/data primitives. They are not the product identity or default experience.

`/dashboard` is transitional. It must not remain the universal role landing page after WS-A closure. Redirect/compatibility behavior should be introduced only with role-aware server authorization and regression coverage.

## Navigation contract

Navigation is role-aware and job-oriented.

Employee navigation prioritizes:
1. My Work
2. Conversations/customer context
3. Quotes/orders needed for execution
4. Personal progress

Owner/manager navigation prioritizes:
1. Command Center
2. Goals
3. Team execution
4. Revenue/products/channels
5. Decisions/approvals
6. Reports/exports

Platform owner navigation prioritizes:
1. Platform health
2. Tenants
3. Plans/services/entitlements
4. Usage/economics
5. Integrations
6. Security/audit

Do not expose unavailable future modules as fake working navigation. Add them when their workstream provides a real route and authorization contract.

## Product Design / UI-UX Gate

This is a cross-cutting gate for every workstream, not a final cosmetic phase.

Required design qualities:
- Premium professional SaaS identity without generic AI-dashboard appearance.
- Role/job-first information architecture.
- Hierarchy: status/signal -> action needed -> primary evidence -> detail.
- `Signal -> Insight -> Decision -> Action -> Verified Result` interaction model.
- Responsive mobile/tablet/desktop behavior.
- PWA-quality interaction where applicable.
- First-class Arabic RTL, Turkish and English LTR.
- Locale-safe text expansion and formatting.
- Accessible keyboard/focus/semantics/contrast.
- Semantic design tokens for typography, spacing, radius, elevation, color and interaction states.
- Reusable components; avoid one-off duplicated styling.
- Loading, empty, error, validation, disabled, processing, success and permission states.
- Tables/data visualizations usable on smaller screens.
- Drill-down from insight to evidence where product contract requires it.
- Export/print when the workstream requires it.
- UI hiding never substitutes for server authorization.

### Visual language

The interface should feel like an operating command system, not a conventional CRM menu plus cards.

Prioritize:
- actionable queues,
- trajectory/progress,
- exceptions and risks,
- recommendations/decisions,
- evidence and drill-down,
- execution state,
- measured outcomes.

De-prioritize decorative metric grids with no action path.

## Authorization rules

1. Server/RLS remains source of authority.
2. `owner/admin/manager` may receive management UI only for the active organization and within their permitted scope.
3. `agent` receives execution UI; management mutations remain denied server-side.
4. `viewer` is read-only.
5. Platform owner authority must be modeled separately from tenant roles.
6. Cross-tenant negative tests are mandatory for role-sensitive new surfaces.
7. No route is considered protected because it is absent from the sidebar.

## First implementation tasks

1. Introduce a typed role/surface contract in application code using existing role values.
2. Pass active membership role into the workspace shell/sidebar from the existing server-side `requireWorkspace()` result.
3. Make navigation role-aware without granting new server privileges.
4. Introduce real route shells for `/work`, `/command`, `/insights` using current governed data only; no fake KPIs.
5. Keep `/platform` blocked until an explicit platform authorization contract exists.
6. Add role-routing/visibility tests and negative authorization coverage.
7. Apply Product Design Gate to each new shell.
8. Only after verification, make role-aware landing behavior replace universal `/dashboard`.

## Exit gate

WS-A is complete only when:
- Employee, manager/admin/owner and viewer have distinct intended landing surfaces.
- Navigation reflects job and role rather than generic CRM parity.
- Platform owner is explicitly separated from tenant owner.
- Existing operational modules remain usable as supporting primitives.
- Server authorization/RLS remains authoritative.
- Cross-role and cross-tenant negative tests pass.
- New shells pass responsive, RTL/LTR, accessibility and critical-state review.
- `/dashboard` is no longer the universal role experience.
- No fake KPI/dashboard content is used as completion evidence.

## Out of scope for WS-A

- Goal calculations (WS-C).
- Revenue Graph schema expansion (WS-B).
- Product/inventory implementation (WS-G).
- Social/store connectors (WS-J/WS-K).
- Autonomous agents (WS-O).
- Broad cosmetic redesign of legacy pages unrelated to the new shell.

## Next allowed dependency

After the role/surface contract is implemented and verified, continue WS-B Revenue Graph / Business Digital Twin Foundation and WS-C Goal Intelligence. UI shells can then consume those real contracts.