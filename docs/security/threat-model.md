# Threat Model (MVP)

## Purpose
Document top security threats and mitigations for the Vercel + Supabase MVP with manual refresh, admin moderation, and provider integrations limited to itch.io and Medium.

## Audience
- Security reviewers
- Backend/frontend engineers
- Product and operations stakeholders

## Owner
Role Placeholder: Security Owner

## Backup Owner
Role Placeholder: Engineering Manager

## Review Cadence
Monthly, and before each production release.

## Source of Truth References
- `docs/security/auth-and-authorization.md`
- `docs/security/secrets-management.md`
- `docs/security/data-handling-and-privacy.md`
- `docs/api/endpoints-spec.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- RBAC is mandatory: member and admin roles have strictly separated privileges.
- Public surfaces expose approved content only.
- External provider data is treated as untrusted input.
- No media binaries are stored; metadata and links only.
- Secrets are managed via Vercel/Supabase secure env storage.

## Threats and Mitigations
- Unauthorized admin action:
  - Mitigate with Supabase-backed role checks on every admin route.
- IDOR / cross-user data access:
  - Mitigate with strict ownership checks for member endpoints.
- Injection and malformed input:
  - Mitigate with schema validation, canonical URL validation, and parameterized DB operations.
- Abuse of manual refresh endpoint:
  - Mitigate with per-user and per-linked-account rate limits.
- Sensitive error leakage:
  - Mitigate with sanitized error messages and stable error codes.
- Supply-chain/provider instability:
  - Mitigate with adapter isolation and controlled failure mapping.

## Failure Modes
- Missing role guard on a single endpoint enables privilege escalation.
- Incorrect moderation-state filter can expose pending/rejected content publicly.
- Logging raw provider payloads can accidentally store sensitive data.

## Change Log
- 2026-04-29: Initial MVP threat model created.
