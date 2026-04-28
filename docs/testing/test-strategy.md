# Test Strategy (MVP)

## Purpose
Define the end-to-end quality strategy for the GDC Aggregator MVP, including test scope, coverage targets, and flow-based confidence gates for releases.

## Audience
- Developers implementing features and bug fixes
- Reviewers validating release readiness

## Owner
TBD - Primary Owner (placeholder)

## Backup Owner
TBD - Backup Owner (placeholder)

## Review Cadence
Monthly, and after any change to authentication, moderation logic, provider adapters, or public visibility rules.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/testing/unit-integration-e2e-matrix.md`
- CI workflow configuration and test reports

## Key Decisions / Invariants
- Test coverage target is **>=80%** for the MVP codebase.
- Test layers are mandatory: **unit + integration + e2e**.
- Public data exposure invariant must be tested in integration/e2e: only approved/public content is visible.
- Manual refresh flow is in scope; scheduled sync behavior is out of scope for MVP tests.
- Provider adapter behavior is validated with deterministic mocks/fixtures in unit and integration tests.

## Coverage Target and Quality Gates
- **Minimum**: >=80% line/function coverage.
- **Release gate**:
  - Unit tests pass
  - Integration tests pass
  - E2E smoke and critical path tests pass
  - Coverage report meets threshold
- **PR expectation**: new behavior must include or update tests in the relevant layer(s).

## Test Pyramid for MVP

### Unit Tests (largest layer)
Validate isolated business logic and pure transformations:
- Input validation and sanitization helpers
- Role checks and authorization helper logic
- Moderation state transitions
- Provider normalization and error mapping functions
- Query filter builder logic for approved/public constraints

### Integration Tests (service boundaries)
Validate interactions between API routes, auth context, database layer, and adapters:
- Link submission -> moderation queue persistence
- Admin approve/reject actions -> state transitions and audit entries
- Manual refresh endpoint -> fetch/normalize/upsert/log behavior
- Public feed/profile APIs -> approved-only and visibility filtering

### E2E Tests (critical journeys)
Validate user-visible outcomes across full stack:
- Member onboarding/login and linking external accounts
- Admin moderation for links and content items
- Guest browsing approved content in landing/projects/member profile views

## Execution Cadence
- Unit tests run on every local feature iteration and in CI.
- Integration tests run in CI for pull requests and release branches.
- E2E critical flows run in CI for pull requests touching auth/moderation/provider/public pages, and always for release candidates.

## Failure Modes
- **False confidence from unit-only testing**: integration gaps miss auth/DB policy regressions.
- **Insufficient e2e coverage**: role-boundary or routing regressions detected late.
- **Mock drift**: provider fixture formats no longer represent live provider payloads.
- **Coverage gaming**: high percentage with low critical-path assertion quality.

## Change Log
- 2026-04-29: Created initial test strategy with >=80% target and MVP flow alignment.
