# API Overview

## Purpose
Define the MVP API surface for the GDC Aggregator running on Vercel (Next.js API routes) with Supabase (Auth + Postgres), limited to itch.io and Medium providers.

## Audience
- Backend engineers
- Frontend engineers
- QA engineers
- Product and moderation admins

## Owner
Role Placeholder: API Product Owner

## Backup Owner
Role Placeholder: Backend Engineering Lead

## Review Cadence
Bi-weekly during MVP build, then monthly after launch.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/api/endpoints-spec.md`
- `docs/api/error-model.md`
- `docs/api/rate-limit-policy.md`
- `docs/security/auth-and-authorization.md`

## Key Decisions / Invariants
- Deployment target is Vercel + Supabase only for MVP.
- Provider scope is strictly `itch.io` and `medium`.
- Refresh mode is strictly manual; no cron jobs, webhooks, or background workers.
- All newly fetched content enters moderation before public visibility.
- Public APIs return only admin-approved items.
- API responses use a consistent envelope: `success`, `data`, `error`, `meta`.

## Failure Modes
- Provider API unavailability can block manual refresh for specific accounts.
- Provider schema drift can produce partial ingestion failures.
- Supabase auth outage blocks protected endpoints.
- Misconfigured moderation checks could expose non-approved content (release-blocking risk).

## Change Log
- 2026-04-29: Initial MVP API overview created.
