# Moderation State Machine

## Purpose
Document allowed state transitions for linked accounts and content items to guarantee safe publication behavior.

## Audience
- Backend engineers implementing moderation logic
- Admin operations and governance maintainers
- QA contributors validating moderation workflows

## Owner
TBD - Moderation Operations Lead

## Backup Owner
TBD - Engineering Lead

## Review Cadence
Monthly and on every policy or moderation workflow change.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/sequence-flows.md`

## Key Decisions / Invariants
- Public content visibility is strictly moderation-gated.
- Members can submit links and request refresh, but cannot approve moderation states.
- Admin actions are authoritative and must be audit-logged.
- State transitions must be explicit; no implicit auto-approval paths.

### Linked Account States
- `pending_review` -> initial state after member submits account reference.
- `approved` -> account is allowed for manual refresh ingestion.
- `rejected` -> account is denied for ingestion until resubmission/review.

Allowed transitions:
- `pending_review -> approved` (admin approve)
- `pending_review -> rejected` (admin reject)
- `rejected -> pending_review` (member resubmits corrected link)

### Content Item States
- `pending_review` -> initial state after adapter ingest/upsert.
- `approved` -> item eligible for public display, subject to member visibility.
- `rejected` -> never public.
- `visibility` dimension:
  - `public` (default for approved items)
  - `hidden_by_member` (member opt-out from public rendering)

Allowed transitions:
- `pending_review -> approved` (admin approve)
- `pending_review -> rejected` (admin reject)
- `approved.visibility public <-> hidden_by_member` (member toggle)

### Publication Rule
An item is renderable on public pages only when:
- `moderation_status = approved`
- `visibility = public`
- parent linked account remains in `approved` state

## Failure Modes
- **Invalid transition bug:** application allows unsupported state changes.
- **Audit gap:** moderation action taken without a matching `moderation_actions` record.
- **Orphan visibility:** hidden item becomes public after unrelated sync due to transition overwrite.
- **Queue starvation:** pending states accumulate without admin review SLA.

## Change Log
- 2026-04-29: Initial linked-account and content-item moderation state machine documented.
