# Unit/Integration/E2E Matrix (MVP Flows)

## Purpose
Map MVP product flows to required test coverage across unit, integration, and e2e layers so teams can implement tests consistently and maintain release confidence.

## Audience
- Developers writing tests for new or changed behavior
- Reviewers checking whether MVP flows are fully covered

## Owner
TBD - Primary Owner (placeholder)

## Backup Owner
TBD - Backup Owner (placeholder)

## Review Cadence
Bi-weekly during active MVP delivery, then monthly post-launch.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/testing/test-strategy.md`

## Key Decisions / Invariants
- Every critical MVP flow must be represented in at least integration and e2e coverage.
- Unit coverage is required for all non-trivial business rules in each flow.
- Aggregate coverage target remains **>=80%**.
- Public content queries must enforce approved/public visibility invariants.

## MVP Flow Coverage Matrix

| MVP Flow | Unit Tests | Integration Tests | E2E Tests |
|---|---|---|---|
| Member signup/login (magic link/google) | Auth callback parsing, session helper logic | Auth route/session creation with Supabase test context | User signs in and reaches member dashboard |
| Member links itch.io/Medium account | URL/slug validation, provider field normalization | Submit link -> `linked_accounts` row in `pending_review` | Member submits link from dashboard and sees pending state |
| Admin reviews linked account | Role guard and moderation transition helpers | Admin approve/reject endpoint updates status + audit record | Admin approves/rejects pending linked account in moderation UI |
| Member triggers manual refresh | Refresh request validation, rate-limit rule unit tests | Refresh endpoint calls adapter, upserts `content_items`, writes `sync_logs` | Member triggers refresh and sees updated sync result feedback |
| Adapter fetch + normalize content | Provider adapters: map raw payload -> normalized schema | Adapter integration with mocked provider responses and DB upsert path | Covered indirectly via member refresh flow and admin moderation flow |
| Admin moderates content items | Moderation transition functions (`pending -> approved/rejected`) | Content moderation endpoint updates visibility eligibility | Admin approves/rejects fetched items from moderation queue |
| Guest sees only approved/public content | Query filter and visibility predicates | Public API returns only approved + visible records | Guest visits landing/projects/profile and sees only approved content |
| Member hides approved item | Member visibility toggle business rules | Toggle endpoint updates `visibility` without bypassing moderation state | Member hides item and item no longer appears in public/member views as expected |
| Sync failure handling | Error mapper/sanitization helpers | Partial/failed sync writes sanitized error data in `sync_logs` | Member/admin sees actionable, non-sensitive error status in UI |

## Minimum Test Set for Release
- One passing unit suite per module touched by MVP logic.
- Integration coverage for all write paths (`link`, `refresh`, `moderate`).
- E2E coverage for three core personas:
  - Member
  - Admin
  - Guest
- CI enforcement of coverage threshold at **>=80%**.

## Failure Modes
- **Flow not represented in matrix**: critical behavior ships without the right test layer.
- **Layer mismatch**: heavy e2e reliance with weak integration assertions slows feedback and hides root causes.
- **Persona gaps**: member/admin/guest boundaries regress unnoticed.

## Change Log
- 2026-04-29: Created initial MVP flow coverage matrix and release minimum test set.
