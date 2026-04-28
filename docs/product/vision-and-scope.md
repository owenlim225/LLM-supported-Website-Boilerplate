# Vision and Scope

## Purpose
Define the MVP vision, value boundaries, and delivery limits for the GDC Aggregator so product and engineering decisions stay aligned.

## Audience
- Product and engineering contributors
- Admin moderators and operations coordinators
- Club leadership reviewing MVP progress

## Owner
TBD - Product Lead

## Backup Owner
TBD - Project Coordinator

## Review Cadence
Per release milestone and at least monthly during active MVP development.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/superpowers/specs/2026-04-29-gdc-documentation-system-design.md`

## Key Decisions / Invariants
- The MVP is a public-facing portfolio and activity site for the UPHSL Game Developers Club.
- Core goals are discoverability of member output, recognition of contributions, and low operational cost.
- Architecture is locked to Next.js on Vercel with Supabase Auth and Supabase Postgres.
- Data strategy is link-first with minimal metadata cache; no binary media storage.
- Initial providers are limited to itch.io and Medium.
- Sync is manual refresh only; no scheduled or webhook sync in MVP.
- Public visibility requires admin moderation approval for linked accounts and content items.
- Scope excludes Behance/DeviantArt implementation, advanced analytics, recommendation systems, and asset proxying.

## Failure Modes
- **Scope creep:** non-MVP features (additional providers, automation, analytics) delay core delivery.
- **Vision drift:** teams optimize for technical completeness over student-org visibility and moderation safety.
- **Constraint violations:** storing media binaries or enabling unmoderated publishing breaks cost and governance assumptions.
- **Roadmap confusion:** deferred items are treated as release blockers despite being explicitly out of MVP.

## Change Log
- 2026-04-29: Initial MVP vision-and-scope baseline created from approved design specs.
