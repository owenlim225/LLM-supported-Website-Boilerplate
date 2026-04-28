# API Rate Limit Policy

## Purpose
Define request throttling policy for MVP endpoints to protect Vercel execution budgets, Supabase resources, and upstream providers (itch.io and Medium).

## Audience
- Backend engineers
- Frontend engineers
- Moderation/admin operators

## Owner
Role Placeholder: Platform Reliability Owner

## Backup Owner
Role Placeholder: Backend Engineering Lead

## Review Cadence
Monthly, plus post-incident review after rate-limit events.

## Source of Truth References
- `docs/api/endpoints-spec.md`
- `docs/api/error-model.md`
- `docs/security/auth-and-authorization.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- Public read endpoints have light IP-based throttling.
- Authenticated member/admin endpoints use user-based throttling.
- Manual refresh is aggressively rate-limited to control provider/API cost.
- Rate limiting applies before provider calls when possible.
- Limit breaches use `429` and `RATE_LIMITED` from `docs/api/error-model.md`.

## Policy (Initial MVP Baseline)
- `GET /api/public/*`: 120 requests/minute per IP.
- `POST /api/member/linked-accounts`: 10 requests/hour per user.
- `POST /api/member/linked-accounts/{id}/refresh`: 3 requests/hour per linked account, 10 requests/day per user.
- `POST /api/admin/moderation/*`: 120 requests/minute per admin user.
- `GET /api/admin/*`: 300 requests/minute per admin user.

## Headers
Responses SHOULD include:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Failure Modes
- Too strict limits can block legitimate moderation throughput.
- Too loose limits can cause provider throttling or Vercel cost spikes.
- Missing per-user keys can allow abuse via account sharing patterns.

## Change Log
- 2026-04-29: Initial MVP rate-limit policy created.
