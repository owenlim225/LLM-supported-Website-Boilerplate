# Security Review Checklist

## Purpose
Provide a release-gating checklist for MVP security readiness across API, auth, moderation, and data handling controls.

## Audience
- Security reviewers
- Engineering leads
- Release managers
- QA engineers

## Owner
Role Placeholder: Security Owner

## Backup Owner
Role Placeholder: Release Manager

## Review Cadence
Every release candidate; full review monthly.

## Source of Truth References
- `docs/security/threat-model.md`
- `docs/security/auth-and-authorization.md`
- `docs/security/secrets-management.md`
- `docs/security/data-handling-and-privacy.md`
- `docs/api/endpoints-spec.md`
- `docs/api/error-model.md`
- `docs/api/rate-limit-policy.md`

## Key Decisions / Invariants
- This checklist is a release gate, not an optional best-practices list.
- Any failed critical item blocks production release.
- MVP assumptions are fixed: Vercel + Supabase, itch.io + Medium only, manual refresh only, admin moderation required.

## Release Gate Checklist
- [ ] **Architecture scope locked:** no unsupported providers beyond itch.io and Medium.
- [ ] **Manual refresh enforced:** no scheduled/background auto-sync paths enabled.
- [ ] **Moderation enforced:** public endpoints return only approved items.
- [ ] **Auth controls:** all protected endpoints require valid Supabase auth.
- [ ] **RBAC controls:** admin routes reject non-admin callers.
- [ ] **Ownership checks:** member routes prevent cross-user resource actions.
- [ ] **Input validation:** provider links, IDs, and payloads validated server-side.
- [ ] **Rate limits active:** `429` behavior and limits match `docs/api/rate-limit-policy.md`.
- [ ] **Error model compliance:** sanitized errors follow `docs/api/error-model.md`.
- [ ] **Secrets handling:** no hardcoded secrets; env secrets configured and scoped least-privilege.
- [ ] **Logging hygiene:** no tokens, raw secrets, or sensitive internals in logs.
- [ ] **Database safety:** parameterized queries/ORM paths only; no raw unsafe interpolation.
- [ ] **Security tests pass:** unit/integration/e2e security-relevant scenarios pass.
- [ ] **Critical vulnerabilities resolved:** no open critical/high findings at release time.

## Failure Modes
- Treating checklist as informational can allow release with known critical issues.
- Skipping ownership or moderation checks can cause public data exposure.
- Missing rate limits can enable abuse and provider lockouts.

## Change Log
- 2026-04-29: Initial MVP security review checklist with release gate added.
