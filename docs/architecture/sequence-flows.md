# Sequence Flows

## Purpose
Capture the canonical request/response flows for onboarding, refresh, moderation, and public rendering in the MVP system.

## Audience
- Engineers implementing API and UI behavior
- QA and E2E test authors
- Operations contributors troubleshooting workflow issues

## Owner
TBD - Engineering Lead

## Backup Owner
TBD - QA Lead

## Review Cadence
Per release milestone and whenever any primary flow changes.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/moderation-state-machine.md`
- `docs/architecture/provider-adapter-architecture.md`

## Key Decisions / Invariants
- Manual refresh is the only ingestion trigger mode in MVP.
- Refresh is allowed only for approved linked accounts.
- New/updated ingested items enter `pending_review` before publication.
- Public read paths enforce moderation and visibility filters.

### Flow 1: Member Onboarding and Account Linking
1. Member authenticates via Supabase Auth.
2. Member submits provider link (itch.io/Medium URL or slug).
3. API validates input through adapter `validateLink`.
4. System persists `linked_accounts` row with `pending_review`.
5. Admin reviews and sets `approved` or `rejected`.

### Flow 2: Manual Content Refresh
1. Member requests refresh for an approved linked account.
2. API verifies ownership and link approval state.
3. Adapter `fetchItems` retrieves provider entries.
4. Adapter `normalize` maps data to common content schema.
5. System upserts `content_items` as `pending_review`.
6. System writes `sync_logs` result (`success`, `partial_success`, or `failed`).

### Flow 3: Content Moderation and Publishing
1. Admin opens moderation queue of `pending_review` items.
2. Admin approves or rejects each item.
3. System records decision in `moderation_actions`.
4. Approved items become eligible for public display.
5. Member may toggle approved items to `hidden_by_member`.

### Flow 4: Public Content Query
1. Guest requests landing/projects/member profile data.
2. API queries `content_items` constrained by:
   - `moderation_status=approved`
   - `visibility=public`
   - linked account state `approved`
3. Response returns metadata and canonical URLs for direct source access.

## Failure Modes
- **Refresh unauthorized:** member refreshes another user account due to missing ownership checks.
- **Moderation bypass:** ingestion path directly marks items approved.
- **Stale publication:** rejected items remain cached in public query results.
- **Opaque errors:** failed refreshes lack actionable and sanitized sync log entries.

## Change Log
- 2026-04-29: Initial MVP sequence flows defined for onboarding, refresh, moderation, and public queries.
