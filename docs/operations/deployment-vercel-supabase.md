# Deployment Runbook: Vercel + Supabase

## Purpose
Define the production deployment procedure for the GDC Aggregator MVP using Vercel (app/runtime) and Supabase (auth + database), with a repeatable sequence for first-time setup and safe updates.

## Audience
- Developers shipping code to production
- Maintainers handling infrastructure setup and incident recovery

## Owner
TBD - Primary Owner (placeholder)

## Backup Owner
TBD - Backup Owner (placeholder)

## Review Cadence
Monthly and after any change to auth, schema, provider integration, or deployment pipeline.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/operations/environment-config.md`
- Vercel project settings and deployment logs
- Supabase project settings, SQL editor, and auth configuration

## Key Decisions / Invariants
- Next.js app is deployed to Vercel.
- Supabase Auth and Postgres are the system of record for users, roles, linked accounts, content metadata, moderation actions, and sync logs.
- External media binaries are not stored in internal infrastructure (link-first metadata strategy only).
- Only approved content is publicly visible.
- Manual refresh is used for MVP sync operations (no scheduled sync workers).

## Step-by-Step Setup (First-Time)

### 1) Prerequisites
1. Create organization accounts for Vercel and Supabase.
2. Ensure repository access for deployer accounts.
3. Confirm local Node version matches project runtime requirements (`package.json` / `.nvmrc` if present).
4. Prepare required environment variables listed in this document.

### 2) Create Supabase Project
1. In Supabase, create a new project for `gdc-aggregator-mvp`.
2. Record:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_DB_URL` (or pooled connection string if used)
3. Configure Auth providers:
   - Email magic link (enabled)
   - Google OAuth (enabled if required for MVP rollout)
4. Configure redirect URLs:
   - Production callback URL from Vercel domain
   - Preview callback URL pattern (if preview auth is supported)
   - Local development callback URL

### 3) Apply Database Schema
1. Open Supabase SQL Editor (or migration workflow used by repo).
2. Apply schema for:
   - `users`
   - `linked_accounts`
   - `content_items`
   - `sync_logs`
   - `moderation_actions`
3. Enable and verify Row Level Security policies for user/member/admin boundaries.
4. Seed minimal bootstrap admin account/role mapping if required.
5. Validate that public queries only expose approved and visible content.

### 4) Create Vercel Project
1. Import repository into Vercel.
2. Framework preset: Next.js.
3. Set production branch (typically `main`).
4. Confirm install/build settings:
   - Install command from repo default
   - Build command from repo default
   - Output from Next.js default

### 5) Configure Vercel Environment Variables
Set the variables in Vercel for `Production`, `Preview`, and `Development` as applicable.

Required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_URL`
- `NEXT_PUBLIC_APP_URL`
- `SUPABASE_JWT_SECRET` (if explicitly required by server-side verification path)

Recommended / integration-specific:
- `ITCHIO_API_KEY` (only if adapter path needs authenticated access)
- `MEDIUM_INTEGRATION_TOKEN` (only if adapter path needs tokenized access)
- `SYNC_RATE_LIMIT_PER_MINUTE`
- `ADMIN_SEED_EMAIL`

Security note:
- Never expose service-role keys in `NEXT_PUBLIC_*` variables.
- Rotate any leaked key immediately and redeploy.

### 6) Deploy and Verify
1. Trigger initial deployment from production branch.
2. Confirm build succeeds.
3. Run post-deploy smoke checks:
   - Public landing and projects pages load.
   - Auth login flow works (magic link and/or Google).
   - Member can submit a link for moderation.
   - Admin can approve/reject links and content.
   - Public pages show only approved items.

### 7) Configure Domain and Auth Callback Finalization
1. Attach production domain in Vercel.
2. Update `NEXT_PUBLIC_APP_URL`.
3. Update Supabase auth redirect/callback URLs to final domain.
4. Redeploy to ensure runtime config consistency.

### 8) Release Validation Gate
Before marking release complete:
1. Run test suite and verify target coverage (>=80%).
2. Confirm no env var drift between Vercel environments.
3. Verify moderation and visibility invariants on production data.
4. Document any rollout caveats in decision logs.

## Failure Modes
- **Env mismatch across environments**: Preview works, production fails auth or provider calls.
- **Supabase key misconfiguration**: Auth succeeds but server-side protected actions fail.
- **RLS policy regressions**: Unauthorized read/write or valid actions blocked.
- **Callback URL mismatch**: Login loop or redirect errors.
- **Provider limit/rate errors**: Manual refresh fails partially; sync logs should capture actionable error metadata.
- **Unreviewed content leak risk**: Query logic must enforce approved/public filter invariant.

## Change Log
- 2026-04-29: Created initial deployment runbook for GDC Aggregator MVP (Vercel + Supabase).
