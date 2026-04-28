# Personas and User Roles

## Purpose
Define who uses the MVP, what they are responsible for, and which actions each role is allowed to perform.

## Audience
- Product designers and feature owners
- Engineers implementing authorization and UI permissions
- Admin and governance maintainers

## Owner
TBD - Product Lead

## Backup Owner
TBD - Community Operations Lead

## Review Cadence
Monthly and whenever role permissions or moderation policy changes.

## Source of Truth References
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`
- `docs/superpowers/specs/2026-04-29-gdc-documentation-system-design.md`

## Key Decisions / Invariants
### Persona: Guest (Public Viewer)
- Goal: browse approved club and member content.
- Permissions: read-only access to landing, projects, and member profile public views.
- Constraints: never sees pending/rejected/hidden content.

### Persona: Member (Contributor)
- Goal: present personal work and club activity through approved linked sources.
- Permissions:
  - authenticate via Supabase Auth (magic link or Google),
  - manage profile basics,
  - submit linked account references for itch.io and Medium,
  - trigger manual refresh on approved linked accounts,
  - hide own approved items from public view.
- Constraints:
  - cannot self-approve links or items,
  - cannot bypass moderation state transitions,
  - cannot access admin queues.

### Persona: Admin (Moderator)
- Goal: protect quality and policy compliance of public content.
- Permissions:
  - review and approve/reject linked accounts,
  - review and approve/reject content items,
  - inspect sync logs and retry failed manual refreshes,
  - manage featured member/content curation controls.
- Constraints:
  - actions must be auditable via moderation records,
  - moderation decisions cannot expose rejected or pending items publicly.

### Role Invariants
- Role model is locked to `member` and `admin` for authenticated users, plus unauthenticated guest behavior.
- Authorization is enforced server-side on protected routes and moderation operations.
- Public queries must return only `approved` and `public`-visible items.

## Failure Modes
- **Privilege escalation:** member accesses admin moderation routes due to missing authorization checks.
- **State leakage:** pending or rejected content appears on public pages.
- **Role ambiguity:** unclear ownership between product and operations causes inconsistent moderation outcomes.

## Change Log
- 2026-04-29: Initial personas and role permissions documented for MVP.
