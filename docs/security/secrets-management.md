# Secrets Management

## Purpose
Define how secrets are stored, accessed, rotated, and audited for the MVP deployment on Vercel + Supabase.

## Audience
- Backend engineers
- DevOps/platform maintainers
- Security reviewers

## Owner
Role Placeholder: Platform Security Owner

## Backup Owner
Role Placeholder: DevOps Lead

## Review Cadence
Quarterly, and immediately after any suspected secret exposure.

## Source of Truth References
- `docs/security/threat-model.md`
- `docs/security/security-review-checklist.md`
- `docs/api/error-model.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- Secrets are never committed to source control.
- Secrets are stored only in Vercel and Supabase managed secret stores.
- Local development uses `.env.local` excluded from git.
- Provider tokens, if used in future phases, must be encrypted at rest before DB persistence.
- API errors and logs must not expose secret values.

## Secret Classes
- Runtime infrastructure secrets:
  - Supabase service keys
  - Supabase JWT/public config values (public keys handled separately)
- Application secrets:
  - Encryption key material (if token encryption is enabled)
  - Any provider integration credentials introduced beyond manual-link mode

## Operational Practices
- Principle of least privilege for all secret scopes.
- Rotate secrets on schedule and on any exposure suspicion.
- Restrict secret visibility to maintainers with operational need.
- Validate required secrets at startup and fail fast on missing critical values.

## Failure Modes
- Secret leakage in logs, CI output, or error payloads.
- Over-privileged service key used in broad runtime contexts.
- Missing secret rotation after access changes.

## Change Log
- 2026-04-29: Initial MVP secrets management document created.
