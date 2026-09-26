# Workstream 4 — Governed AI Sales Agent execution

Commercial V1 closure contract:

1. AI suggestions remain proposals until explicitly approved.
2. Only owner/admin/manager may execute an approved suggestion.
3. Execution is tenant scoped by organization_id and suggestion_id.
4. Only approved `sales_reply` suggestions with non-empty content are executable.
5. Execution creates a pending outbound message; the existing channel delivery layer remains responsible for provider delivery.
6. Successful execution transitions the suggestion to `sent` and writes `ai.suggestion.executed` to `audit_logs` with message/conversation/approver evidence.
7. No anonymous/public execution privilege is granted.

This slice intentionally does not add autonomous discounting, pricing, deletion, subscription, or other sensitive tools.
