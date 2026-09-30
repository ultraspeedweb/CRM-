# Web UI / Product Design Skill

## Objective
Build clear, fast, accessible, responsive and maintainable SaaS interfaces. Design around the user's job and evidence, not decoration.

## Workflow
Identify role/job/success action -> map journey -> reuse design-system primitives -> cover loading/empty/error/validation/disabled/success/permission states -> verify mobile/tablet/desktop -> verify RTL/LTR/localization -> accessibility/keyboard/focus -> performance -> visual/browser regression evidence.

## Design system
Use semantic tokens for typography, spacing, radius, elevation, colors and interaction states. Prefer composable primitives and stable variants. Reject duplicated components and unexplained one-off styling.

## CRM/SaaS rules
Hierarchy is status -> action needed -> primary metrics -> detail. Tables and pipelines must remain usable on smaller screens, expose clear ownership/next action, handle empty/error/loading states and support export/print when the product contract requires it. UI hiding never replaces server authorization.

## Forms and actions
Keep forms concise; use clear labels and validation; preserve user input after recoverable failures; protect destructive/irreversible actions; prevent duplicate submissions; provide explicit processing and result states.

## Review gate
Responsive behavior; RTL/LTR/localization expansion; keyboard/focus/semantics/contrast; loading/empty/error/success/permission states; overflow/layout-shift check; design-system consistency; no journey dead ends; privacy-safe errors; visual or browser E2E evidence for launch-critical flows.

## Definition of Done
End-to-end usable for the intended role, responsive/localizable, accessible, consistent with maintainable tokens/primitives and verified across critical states.
