# Provider Adapter Architecture

## Purpose
Define the adapter boundary that isolates provider-specific integration behavior while preserving a stable internal ingestion contract.

## Audience
- Engineers implementing provider integrations
- Reviewers assessing extensibility and reliability
- QA authors building adapter-level tests

## Owner
TBD - Integrations Lead

## Backup Owner
TBD - Backend Lead

## Review Cadence
Per provider behavior change, new provider onboarding, or major API policy update.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/sequence-flows.md`

## Key Decisions / Invariants
- MVP provider set is fixed to itch.io and Medium.
- All provider logic must implement a shared adapter contract:
  - `validateLink(input)`
  - `fetchItems(accountRef, cursor?)`
  - `normalize(rawItem)`
  - `rateLimitPolicy()`
  - `mapError(error)`
- Adapter outputs must be normalized into a common `content_items` schema.
- Provider-specific identifiers are preserved in normalized metadata (`provider`, `external_item_id`, canonical URL).
- Errors are mapped into sanitized internal codes/messages before persistence.
- Partial fetch success is valid and must be reported in sync logs.

### Adapter Responsibilities
- Validate member-submitted URLs/usernames/slugs before storage.
- Fetch provider items through compliant APIs/feeds/access methods.
- Normalize media type, title, URLs, timestamps, tags, and excerpt fields.
- Handle pagination/cursors where provider supports it.
- Publish provider capability assumptions and known limits.

### Non-Responsibilities (MVP)
- Scheduled refresh orchestration.
- Real-time/webhook ingestion.
- Media proxying, transformation, or asset storage.

## Failure Modes
- **Contract drift:** adapters return non-normalized shapes and break downstream moderation.
- **Policy violations:** scraping strategy conflicts with provider terms when alternatives exist.
- **Rate-limit saturation:** repeated manual refresh attempts trigger provider throttling.
- **Silent degradation:** adapter errors are swallowed instead of logged with actionable outcomes.

## Change Log
- 2026-04-29: Initial adapter architecture and contract invariants documented for MVP providers.
