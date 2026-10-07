# WS-D — Goal Driver Decomposition

Status: STACKED IMPLEMENTATION — NOT COMMERCIAL CERTIFICATION
Date: 2026-10-07
Branch: feat/goal-driver-decomposition-20261007
Parent: WS-C Goal Intelligence

## Business outcome

Translate a measurable goal gap into explicit operational drivers so a company knows what volume of work the current evidence implies.

Initial revenue chain:

Revenue Gap -> Won Outcomes -> Qualified Opportunities -> Leads -> Activities

## Deterministic contract

The first slice requires explicit evidence:
- average won outcome value,
- qualified-to-won rate,
- lead-to-qualified rate,
- activities per lead.

Missing or invalid evidence fails closed. The engine never silently invents conversion rates.

The output is a scenario, not a causal guarantee.

## Capacity assessment

Where current pipeline/work capacity is known, compare required versus available:
- won outcomes,
- qualified opportunities,
- leads,
- activities.

Unknown capacity is unknown, never treated as zero.

## Next slices

- derive evidence from tenant-safe historical Revenue Graph and lifecycle data,
- time-window and currency segmentation,
- branch/employee/channel decomposition,
- identify the highest-leverage bottleneck,
- connect bottlenecks to WS-E Next Best Action,
- later add product/margin drivers after WS-G.

## Guardrails

- no mixed-currency calculations,
- no fake conversion rates,
- no causality claim from correlation,
- no autonomous customer-facing action,
- all derived evidence must be traceable to source records and window definitions.
