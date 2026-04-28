# Endpoint Specification (MVP)

## Purpose
Specify API endpoints for the Vercel + Supabase MVP, constrained to itch.io and Medium providers, manual refresh, and admin-moderated publishing.

## Audience
- Backend engineers
- Frontend engineers
- QA engineers
- Admin tool maintainers

## Owner
Role Placeholder: API Product Owner

## Backup Owner
Role Placeholder: Moderation Systems Owner

## Review Cadence
Bi-weekly during MVP implementation; monthly after MVP launch.

## Source of Truth References
- `docs/api/error-model.md`
- `docs/api/rate-limit-policy.md`
- `docs/security/auth-and-authorization.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- Only `itchio` and `medium` are accepted provider identifiers.
- Public APIs return only approved and visible content.
- Member refresh is manual and user-triggered only.
- Every fetched item enters moderation (`pending_review`) before becoming public.
- Error responses follow `docs/api/error-model.md`.
- Rate limiting follows `docs/api/rate-limit-policy.md`.

## Cross-Policy Links
- Error handling contract: [API Error Model](./error-model.md)
- Throttling contract: [API Rate Limit Policy](./rate-limit-policy.md)

## Endpoint Catalog

### Public Endpoints
- `GET /api/public/projects`
  - Description: List approved content items for public browsing.
  - Query: `provider`, `memberId`, `mediaType`, `tag`, `page`, `limit`.
  - Auth: None.
  - Success: `200`.
  - Errors: `400`, `429`, `500`.

- `GET /api/public/members/{memberId}`
  - Description: Return public profile metadata and approved content summary for one member.
  - Auth: None.
  - Success: `200`.
  - Errors: `404`, `429`, `500`.

### Member Endpoints (Authenticated: member/admin)
- `POST /api/member/linked-accounts`
  - Description: Submit a provider account link for moderation.
  - Body: `{ provider, profileUrl | usernameOrSlug }`
  - Constraints: `provider` in `itchio|medium`.
  - Success: `201` (status `pending_review`).
  - Errors: `400`, `401`, `409`, `422`, `429`, `500`.

- `GET /api/member/linked-accounts`
  - Description: List caller-owned linked accounts with moderation status.
  - Success: `200`.
  - Errors: `401`, `429`, `500`.

- `POST /api/member/linked-accounts/{linkedAccountId}/refresh`
  - Description: Trigger manual fetch and normalize for one approved linked account.
  - Constraints: Caller owns account or is admin.
  - Success: `202` with accepted sync job record.
  - Errors: `400`, `401`, `403`, `404`, `409`, `429`, `502`, `503`.

- `PATCH /api/member/content-items/{itemId}/visibility`
  - Description: Toggle visibility (`public`/`hidden_by_member`) for caller-owned approved item.
  - Success: `200`.
  - Errors: `400`, `401`, `403`, `404`, `409`, `429`.

### Admin Endpoints (Authenticated: admin only)
- `GET /api/admin/moderation/linked-accounts`
  - Description: List pending linked accounts for review.
  - Success: `200`.
  - Errors: `401`, `403`, `429`, `500`.

- `POST /api/admin/moderation/linked-accounts/{linkedAccountId}/decision`
  - Description: Approve or reject linked account.
  - Body: `{ action: "approve" | "reject", reason? }`
  - Success: `200`.
  - Errors: `400`, `401`, `403`, `404`, `409`, `429`.

- `GET /api/admin/moderation/content-items`
  - Description: List pending content items for moderation.
  - Success: `200`.
  - Errors: `401`, `403`, `429`, `500`.

- `POST /api/admin/moderation/content-items/{itemId}/decision`
  - Description: Approve or reject content item.
  - Body: `{ action: "approve" | "reject", reason? }`
  - Success: `200`.
  - Errors: `400`, `401`, `403`, `404`, `409`, `429`.

- `GET /api/admin/sync-logs`
  - Description: List refresh attempts and sanitized error summaries.
  - Success: `200`.
  - Errors: `401`, `403`, `429`, `500`.

## Failure Modes
- Authorization bugs can leak admin-only moderation queues.
- Missing ownership checks can allow cross-account refresh or visibility changes.
- Failure to enforce moderation-state checks can expose unapproved content.

## Change Log
- 2026-04-29: Initial MVP endpoint specification created.
