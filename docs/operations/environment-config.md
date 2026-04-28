# Environment Configuration

## Purpose
Define all runtime environment variables, ownership expectations, and configuration invariants for local development, preview, and production deployments of the GDC Aggregator MVP.

## Audience
- Developers running the app locally
- Maintainers configuring Vercel and Supabase environments

## Owner
TBD - Primary Owner (placeholder)

## Backup Owner
TBD - Backup Owner (placeholder)

## Review Cadence
Monthly and immediately after provider integration/auth/schema changes.

## Source of Truth References
- `docs/operations/deployment-vercel-supabase.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- Vercel Environment Variables dashboard
- Supabase project settings

## Key Decisions / Invariants
- Client-safe keys only use the `NEXT_PUBLIC_*` prefix.
- Secrets never live in source control and are only set in managed environment stores.
- Environment values are aligned across local, preview, and production unless intentionally overridden.
- Production invariants (approved-only visibility, auth/role enforcement) must hold regardless of environment.

## Environment Matrix

| Variable | Local | Preview | Production | Required | Notes |
|---|---|---|---|---|---|
| `NODE_ENV` | `development` | `production` | `production` | Yes | Runtime mode |
| `NEXT_PUBLIC_APP_URL` | Yes | Yes | Yes | Yes | Base URL per environment |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Yes | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Yes | Yes | Public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Yes | Yes | Yes | Server-only secret |
| `SUPABASE_DB_URL` | Optional | Optional | Optional | If direct DB access used | Prefer pooled URL |
| `SUPABASE_JWT_SECRET` | Optional | Optional | Optional | If server verifies JWT manually | Keep server-only |
| `ITCHIO_API_KEY` | Optional | Optional | Optional | Provider-dependent | Only if required by adapter |
| `MEDIUM_INTEGRATION_TOKEN` | Optional | Optional | Optional | Provider-dependent | Only if required by adapter |
| `SYNC_RATE_LIMIT_PER_MINUTE` | Yes | Yes | Yes | Recommended | Throttle manual refresh endpoint |
| `ADMIN_SEED_EMAIL` | Optional | Optional | Optional | Recommended | Bootstrap admin access |

## Local Development Setup
1. Create `.env.local` from project env template (if available) or add required variables manually.
2. Set `NEXT_PUBLIC_APP_URL` to local app URL.
3. Use development Supabase project credentials (never production secrets locally unless explicitly approved).
4. Start app and validate:
   - Auth flow
   - Member dashboard access
   - Admin moderation path (if local role seed exists)

## Preview/Production Setup
1. Set variables in Vercel by environment scope.
2. Confirm no missing required variable before deploy.
3. Ensure `NEXT_PUBLIC_APP_URL` matches actual domain for each environment.
4. Ensure Supabase auth redirects/callback URLs match environment domains.

## Secret Handling Rules
- Do not commit `.env*` files containing secrets.
- Do not log full secret values in app logs or CI logs.
- Rotate keys immediately if accidental exposure is suspected.
- Prefer key names that make scope obvious (public vs server-only).

## Failure Modes
- **Missing required variable**: Build-time or runtime failure in API routes/auth bootstrap.
- **Public/server key confusion**: Secret exposure risk or authorization failures.
- **Domain/callback mismatch**: Login redirect errors.
- **Preview/prod drift**: Hard-to-reproduce bugs due to inconsistent env values.

## Change Log
- 2026-04-29: Created initial environment configuration baseline for MVP deployment and local development.
