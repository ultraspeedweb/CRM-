# ADR 001: Service admission and deployment credentials

Date: 2026-10-20. Status: implemented; hosted certification pending.

## Context

The server service guard queried a private schema through PostgREST, although that
schema is intentionally not exposed. Fixing this availability failure without
additional controls would expose latent WhatsApp authorization and credential
routing problems. Conversation writes also bypassed the manager-only AI resume
RPC. The existing AI execution function referenced invalid message columns and
claimed delivery before any certified sender existed.

## Decision

- Keep the private schema unexposed. A service-role-only public RPC returns one
  boolean for an organization/service pair. Tenant and anonymous execution is
  revoked. Unknown services/organizations and lookup failures deny access.
- Core suspension overrides every service. Core, web inbox, automations and
  notifications can operate without a paid subscription. External integrations
  default off and require explicit operator enablement. Server calls additionally
  require an exact `true` deployment release flag for WhatsApp, AI and stores.
- Only trusted server provisioning can write WhatsApp credential routing. Tenant
  roles retain connection visibility but cannot activate or rebind credentials.
  Sending also checks a write-capable tenant role before reading credentials or
  contacting Meta. UI readiness follows the same admission decision.
- New conversations start with human handling. A database trigger requires a
  manager role and service enablement for direct INSERT/UPDATE into AI handling,
  including transitions outside the resume RPC. Human handoff remains available.
- AI execution fails explicitly until an independently certified outbox exists.
  It neither writes messages nor changes suggestions to `sent`.

## Rollout and verification

Replay migrations and run pgTAP on a fresh database, including cross-tenant and
direct Data API negative cases. Run server action tests proving no external send
for viewers, and browser tests for inbox visibility/read state and platform role
separation. Independently review the migration and execution evidence.

Apply this migration to confirmed staging before deploying dependent server code.
An old database fails closed. Confirm Preview binds to staging before creating
hosted test identities. Keep all external release flags false until their own
integration acceptance passes. Production rollout remains separately gated.

## Consequences and rollback

Tenant admins can no longer self-provision Meta credentials. An authenticated
operator workflow with audited routing approval is needed before live WhatsApp
certification. AI generation/delivery remains unavailable, visibly and safely.

Emergency containment is to leave release flags false and disable the service or
core switch. Rolling back application code must not restore tenant credential
writes or remove the AI transition guard. A schema rollback needs a separate
review; it is not an automatic part of an application rollback.
