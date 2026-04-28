# Data Handling and Privacy

## Purpose
Define MVP data classification, storage boundaries, privacy principles, and retention guidance for the GDC Aggregator.

## Audience
- Backend/frontend engineers
- Product owners
- Security and compliance reviewers

## Owner
Role Placeholder: Data Protection Owner

## Backup Owner
Role Placeholder: Security Owner

## Review Cadence
Quarterly, and before collecting any new data category.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/security/threat-model.md`
- `docs/security/secrets-management.md`
- `docs/api/endpoints-spec.md`

## Key Decisions / Invariants
- MVP is link-first and metadata-first.
- No binary media assets are copied or stored in project-controlled storage.
- Provider data is limited to minimal metadata needed for display/filter/moderation.
- Public APIs only expose admin-approved content.
- Errors and logs are sanitized to avoid sensitive leakage.

## Data Categories
- Account and role data:
  - User ID, email, display name, role.
- Linked account data:
  - Provider name, external handle/slug, profile URL, moderation status.
- Content metadata:
  - Title, canonical URL, optional thumbnail URL, tags, publish timestamp, excerpt.
- Operational telemetry:
  - Sync logs, moderation actions, sanitized error codes/messages.

## Handling Rules
- Validate and sanitize external URLs and user inputs.
- Store only fields required for product behavior.
- Avoid storing raw provider payloads unless temporarily needed for debugging and explicitly redacted.
- Restrict admin-only data access via RBAC.

## Privacy Considerations
- User profile data shown publicly is only data intentionally surfaced by product rules.
- Member-controlled visibility toggle applies after admin approval.
- Content shown publicly should always reference original provider URL.

## Failure Modes
- Accidental storage of excessive provider payload fields.
- Exposure of internal moderation notes to public endpoints.
- Insufficient log redaction leading to privacy leakage.

## Change Log
- 2026-04-29: Initial MVP data handling and privacy policy created.
