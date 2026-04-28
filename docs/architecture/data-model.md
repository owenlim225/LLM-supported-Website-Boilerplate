# Data Model

## Purpose
Define the MVP relational schema, core entities, and data invariants that support aggregation, moderation, and public visibility.

## Audience
- Backend and database implementers
- QA and integration test authors
- Maintainers reviewing schema changes

## Owner
TBD - Data/Backend Lead

## Backup Owner
TBD - Engineering Lead

## Review Cadence
Per schema migration and at least once per release milestone.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/moderation-state-machine.md`

## Key Decisions / Invariants
- Schema is optimized for metadata-only persistence with normalized external references.
- Each `linked_account` belongs to exactly one `user`.
- Each `content_item` references one `linked_account` and one owning `user`.
- `provider` is constrained to `itchio` and `medium` in MVP.
- Public rendering requires `moderation_status=approved` and `visibility=public`.
- Sync operations always produce a `sync_logs` record, including partial failures.
- Moderation actions are append-only audit events.

### Core Tables
- **`users`:** identity profile and role (`member` or `admin`).
- **`linked_accounts`:** provider linkage metadata, auth mode, and review status.
- **`content_items`:** normalized provider content metadata and moderation/visibility controls.
- **`sync_logs`:** refresh execution outcomes and sanitized error context.
- **`moderation_actions`:** audit trail for approve/reject/feature actions.

### Suggested Relational Constraints
- Unique composite key on `content_items(provider, external_item_id)` to avoid duplicate imports.
- Foreign keys:
  - `linked_accounts.user_id -> users.id`
  - `content_items.user_id -> users.id`
  - `content_items.linked_account_id -> linked_accounts.id`
  - `sync_logs.linked_account_id -> linked_accounts.id`
- Check constraints for enum-like status fields (`link_status`, `moderation_status`, `visibility`, `trigger_mode`).

## Failure Modes
- **Duplicate content rows:** missing uniqueness on provider item identity.
- **Orphaned records:** weak foreign key controls after account deletion or migration.
- **State inconsistency:** moderation and visibility fields drift from allowed transitions.
- **Sensitive data leakage:** storing unsanitized provider errors or unencrypted tokens.

## Change Log
- 2026-04-29: Initial MVP data model and invariants documented.
