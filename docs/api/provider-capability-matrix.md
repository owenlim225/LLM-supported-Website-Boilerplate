# Provider Capability Matrix (MVP)

## Purpose
Capture supported behaviors and constraints for MVP providers (`itchio`, `medium`) used by adapter and moderation flows.

## Audience
- Backend engineers
- Product owners
- QA engineers
- Moderation/admin operators

## Owner
Role Placeholder: Provider Integrations Owner

## Backup Owner
Role Placeholder: Backend Engineering Lead

## Review Cadence
Monthly and before any provider behavior change release.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/api/endpoints-spec.md`
- `docs/api/error-model.md`
- `docs/api/rate-limit-policy.md`

## Key Decisions / Invariants
- MVP provider list is locked to itch.io and Medium.
- Adapter contract is stable: validate link, fetch items, normalize items, map errors.
- Sync remains manual-only for both providers.
- All provider-derived items require admin moderation before public listing.

## Capability Matrix

| Capability | itch.io | Medium |
|---|---|---|
| MVP status | Supported | Supported |
| Account linking mode | Manual link / username-based | Manual link / username-publication slug |
| OAuth required in MVP | No | No |
| Manual refresh | Yes | Yes |
| Scheduled refresh | No | No |
| Primary media types | game | article, event |
| Normalized fields available | title, canonical URL, thumbnail (if present), tags, publish date | title, canonical URL, thumbnail (if present), tags, publish date |
| Moderation required | Yes | Yes |
| Public visibility gate | Approved items only | Approved items only |

## Notes
- Preview thumbnails are metadata references and hotlinked from source; no binaries are persisted.
- Availability and schema of source payloads can vary; adapter normalization must tolerate partial fields.

## Failure Modes
- Provider response format changes can break normalization.
- Provider-side throttling can delay refresh completion.
- Incomplete metadata can reduce search/filter quality.

## Change Log
- 2026-04-29: Initial MVP provider capability matrix created.
