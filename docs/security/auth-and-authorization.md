# Authentication and Authorization

## Purpose
Define authentication and RBAC requirements for MVP APIs and admin moderation workflows.

## Audience
- Backend/frontend engineers
- Security reviewers
- QA engineers

## Owner
Role Placeholder: Identity and Access Owner

## Backup Owner
Role Placeholder: Security Owner

## Review Cadence
Monthly, and after any role model or endpoint permission change.

## Source of Truth References
- `docs/api/endpoints-spec.md`
- `docs/security/threat-model.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- Auth provider is Supabase Auth.
- MVP sign-in modes: email magic link and Google sign-in.
- Roles are exactly `member` and `admin`.
- Default role is `member`; admin elevation is explicit and controlled.
- Admin moderation actions are restricted to admin role only.
- Member endpoints enforce ownership and never allow cross-user operations.

## Authentication Requirements
- Protected endpoints require a valid Supabase session/JWT.
- Invalid or missing credentials return `401`.
- Sessions should be short-lived and refresh-token handling delegated to Supabase client/server patterns.

## Authorization Rules
- Public endpoints:
  - No authentication required.
  - Must return only approved and visible content.
- Member endpoints:
  - Require authenticated user.
  - Permit only caller-owned linked accounts/content operations unless caller is admin.
- Admin endpoints:
  - Require authenticated user with `admin` role.
  - Must reject non-admin callers with `403`.

## Moderation Guardrails
- New linked accounts start in `pending_review`.
- New fetched items start in `pending_review`.
- Only admin decisions transition pending entities to `approved` or `rejected`.

## Failure Modes
- Missing ownership checks permit IDOR.
- Role lookup drift between token claims and DB role can cause inconsistent authorization.
- Any fallback path that defaults to allow is release-blocking.

## Change Log
- 2026-04-29: Initial MVP auth and authorization policy created.
