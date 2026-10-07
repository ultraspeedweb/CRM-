# WS-C — Goal Intelligence Foundation

Status: STACKED IMPLEMENTATION — NOT COMMERCIAL CERTIFICATION  
Date: 2026-10-07  
Branch: feat/goal-intelligence-foundation-20261007  
Parent candidate: 235e7e2b0d7983fb656c6738c8edfe44c8cdc19a

## Business outcome

Turn a company goal into a measurable execution contract instead of a passive KPI card.

First deterministic loop:

Goal -> Current Result -> Expected Pace -> Gap -> Required Run Rate -> Forecast -> Action Signals

This workstream intentionally starts with deterministic math before AI recommendations or autonomous execution.

## V1 contract

For a numeric goal, calculate:
- baseline and target delta,
- current achieved delta,
- completion ratio,
- elapsed time ratio,
- expected value by now,
- pace gap,
- remaining gap,
- current daily run rate,
- required daily run rate,
- naive end-of-period forecast from observed run rate,
- trajectory status: not_started / ahead / on_track / at_risk / complete / expired.

## Action signals

The deterministic layer may emit:
- preserve_pace,
- close_pace_gap,
- increase_run_rate,
- goal_complete,
- goal_expired.

These are execution signals, not AI advice. Later workstreams may explain or decompose them using governed business evidence.

## Guardrails

- No cross-currency arithmetic.
- No invented forecast when no elapsed run-rate evidence exists.
- No claim that an intervention caused an outcome without evidence.
- No AI mutation of goals.
- No database goal schema is introduced in this slice.
- Goal persistence requires a reviewed Supabase migration, RLS, role policy and replay tests.
- Revenue values consumed by a revenue goal must come from a time-scoped, tenant-safe Revenue Graph query.

## Next slices

1. Persistence contract for company/team/employee/product/channel-scoped goals.
2. Goal-to-Revenue-Graph adapter with date-window and currency enforcement.
3. Driver decomposition: revenue -> won outcomes -> qualified opportunities -> leads -> activities.
4. Owner Command Center projection.
5. Policy-governed recommended actions and outcome ledger.
6. Learning loop that updates recommendations from verified outcomes without rewriting historical truth.

## Definition of Done for foundation

- Deterministic trajectory calculator implemented.
- Invalid goal contracts fail closed.
- Time boundaries tested.
- Baseline semantics tested.
- Action signals tested.
- Quality/code gates pass on exact candidate, aside from inherited documented upstream blockers.
- No Production deployment before parent workstreams are certified.
