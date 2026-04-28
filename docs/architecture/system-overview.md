# System Overview

## Purpose
Describe the end-to-end MVP architecture, boundaries, and component responsibilities for the GDC Aggregator.

## Audience
- Engineers implementing app and backend routes
- Product and operations leads validating delivery scope
- Future contributors onboarding to the architecture

## Owner
TBD - Engineering Lead

## Backup Owner
TBD - Technical Product Owner

## Review Cadence
Per release milestone and after any architecture decision record affecting platform, auth, or data boundaries.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/superpowers/specs/2026-04-29-gdc-documentation-system-design.md`
- `docs/architecture/data-model.md`
- `docs/architecture/provider-adapter-architecture.md`

## Key Decisions / Invariants
- Frontend and server routes run in Next.js on Vercel.
- Authentication and relational data store are Supabase Auth and Supabase Postgres.
- The app persists only normalized references and lightweight metadata.
- External media is hotlinked from source providers; binaries are never copied into MVP storage.
- Provider support is limited to itch.io and Medium.
- Content ingestion happens only through manual refresh.
- Public surfaces only render items approved by moderation and not hidden by members.

### Logical Components
1. **Web UI Layer (Next.js):** landing, projects, member profile, and authenticated dashboards.
2. **Application API Layer (Next.js route handlers):** validates requests, enforces role rules, coordinates refresh and moderation actions.
3. **Auth Layer (Supabase Auth):** identity and session management for member/admin roles.
4. **Data Layer (Supabase Postgres):** users, linked accounts, content items, sync logs, moderation actions.
5. **Provider Adapter Layer:** provider-specific validation/fetch/normalize behaviors behind a common interface.
6. **Moderation Workflow Logic:** state transitions controlling visibility and publication safety.

### Runtime Boundaries
- Client-to-server trust boundary at all authenticated routes.
- Server-to-provider boundary requires input validation, rate-limit handling, and sanitized error mapping.
- Server-to-database boundary enforces row-level and role-based authorization policies.

## Failure Modes
- **Provider instability:** upstream API/feed changes produce partial or failed refreshes.
- **Authorization gaps:** incorrect role enforcement exposes moderation actions to members.
- **Visibility regression:** public feed query includes pending/rejected or member-hidden items.
- **Cost overrun risk:** accidental scheduled sync or binary storage increases free-tier resource usage.

## Change Log
- 2026-04-29: Initial MVP system overview documented from locked architecture decisions.
