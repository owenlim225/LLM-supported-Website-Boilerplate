# GDC Aggregator MVP Design

Date: 2026-04-28  
Status: Approved for planning  
Owners: UPHSL Game Developers Club

## 1) Objective

Build a production-ready MVP website for a university student-led game development organization that:

- promotes member work,
- documents organization activity,
- recognizes member contributions,
- and minimizes internal data storage by aggregating external platform content.

The product should be low-cost, deployable on free tiers, and structured for future scale.

## 2) Product Goals and Non-Goals

### Goals

- Provide a public-facing website with a strong org identity and discoverable member output.
- Let members create accounts and link external content profiles.
- Aggregate content from external sources into a unified, filterable experience.
- Keep storage link-first: persist minimal metadata only, never binary assets.
- Require admin moderation before linked content is publicly visible.

### Non-Goals (MVP)

- No full-content mirroring/copying of external media.
- No automatic scheduled background sync.
- No real-time/webhook sync.
- No Phase 2+ providers (Behance/DeviantArt/ArtStation) in this MVP.
- No advanced analytics dashboard beyond operational basics.

## 3) Locked Architecture Decisions

### Deployment and Platform

- Frontend and server routes: Next.js on Vercel.
- Authentication and database: Supabase Auth + Supabase Postgres.
- Environment strategy: Vercel and Supabase managed secrets.

### Data Strategy

- Approach selected: Link-First + Minimal Metadata Cache.
- Store only normalized external references and lightweight metadata.
- Do not store media binaries (images/videos/audio) internally.
- Use direct hotlink previews from source platforms.

### MVP Providers

- Games: itch.io
- Blogs/articles/events: Medium

### Sync and Moderation

- Sync mode: manual refresh only.
- Moderation mode: admin approval required before public visibility.

## 4) User Roles

- Guest: views approved public content.
- Member: manages own profile, links accounts, requests refresh, controls personal visibility options.
- Admin: reviews links, reviews items, approves/rejects visibility, retries failed sync attempts.

## 5) Product Surface

### Public Pages

1. Landing page
   - org intro, mission/vision, highlights, featured members/projects, join/login CTA.
2. Projects page
   - unified feed sections (games, articles/events), filter/sort by member/platform/media type/tags.
3. Member profile page
   - member profile information, connected platform badges, approved aggregated content.

### Private Member Pages

- Account settings/profile edit.
- Link external account flow (itch.io, Medium).
- Refresh content action per linked account.
- Visibility toggles for approved items (show/hide).

### Private Admin Pages

- Linked account moderation queue (approve/reject).
- Content moderation queue (approve/reject).
- Sync log/error view with manual retry.
- Featured content/member controls.

## 6) System Components

### A. Web App (Next.js)

- Renders public pages and authenticated dashboard routes.
- Calls internal API routes for linking, refresh, moderation, and querying normalized content.

### B. Auth Layer (Supabase Auth)

- Email magic link and Google sign-in.
- Session and identity management for member/admin roles.

### C. Data Layer (Supabase Postgres)

- Stores user accounts, linked provider metadata, normalized content references, moderation states, and sync logs.

### D. Provider Adapter Layer

Each provider implements a shared contract:

- `validateLink(input)`
- `fetchItems(accountRef, cursor?)`
- `normalize(rawItem)`
- `rateLimitPolicy()`
- `mapError(error)`

This adapter boundary isolates provider-specific behavior and supports future expansion.

### E. Moderation Workflow Engine (App Logic)

- Governs state transitions for links and items (pending, approved, rejected, hidden).
- Enforces that only approved items are public.

## 7) Data Model (MVP)

## `users`

- id
- email
- display_name
- role (`member` | `admin`)
- created_at
- updated_at

## `linked_accounts`

- id
- user_id
- provider (`itchio` | `medium`)
- external_account_id (nullable based on provider response)
- external_username_or_slug
- profile_url
- auth_mode (`oauth` | `manual_link`)
- token_encrypted (nullable)
- refresh_token_encrypted (nullable)
- link_status (`pending_review` | `approved` | `rejected`)
- reviewed_by (nullable)
- reviewed_at (nullable)
- created_at
- updated_at

## `content_items`

- id
- user_id
- linked_account_id
- provider
- external_item_id
- media_type (`game` | `article` | `event` | `other`)
- title
- canonical_url
- thumbnail_url (nullable)
- published_at (nullable)
- tags (array/text)
- excerpt (nullable, short summary only)
- moderation_status (`pending_review` | `approved` | `rejected`)
- visibility (`public` | `hidden_by_member`)
- fetched_at
- created_at
- updated_at

## `sync_logs`

- id
- linked_account_id
- triggered_by_user_id
- trigger_mode (`manual`)
- status (`success` | `partial_success` | `failed`)
- items_fetched
- items_normalized
- error_code (nullable)
- error_message (nullable, sanitized)
- created_at

## `moderation_actions`

- id
- target_type (`linked_account` | `content_item`)
- target_id
- action (`approve` | `reject` | `feature` | `unfeature`)
- reason (nullable)
- acted_by_user_id
- created_at

## 8) Key Flows

### Member Onboarding and Linking

1. Member signs in/up via Supabase Auth.
2. Member submits external account link (URL or username/slug).
3. Link enters `pending_review`.
4. Admin approves/rejects.
5. On approval, member can use refresh action.

### Content Refresh

1. Member clicks refresh for an approved linked account.
2. Adapter fetches provider items.
3. Items are normalized and upserted as `pending_review`.
4. Sync result logged in `sync_logs`.

### Content Moderation and Publishing

1. Admin reviews pending content items.
2. Approved items appear on public pages.
3. Rejected items remain non-public.
4. Member may hide approved items from profile/projects view.

## 9) API and Integration Constraints

### Integration Policy

- Prefer official APIs, feeds, or provider-approved public access methods.
- Avoid brittle scraping unless no compliant alternative exists and legal/policy checks pass.
- Maintain provider capability notes in implementation docs.

### Provider Feasibility and Risks (MVP+Roadmap)

- itch.io: medium-high feasibility; risk includes endpoint variability and rate limits.
- Medium: medium feasibility; risk includes feed format differences between publication and user sources.
- Behance (future): medium-low feasibility due to API access friction and policy changes.
- DeviantArt (future): medium feasibility with OAuth scope complexity.

### Error Handling

- Partial fetch success allowed.
- Failures surfaced to member/admin dashboards with actionable messages.
- Errors sanitized to avoid leaking secrets/provider-sensitive internals.

## 10) Security and Compliance Requirements

- Secrets only via environment variables and managed secret stores.
- Encrypt provider tokens at rest when present.
- Enforce role-based authorization on all protected operations.
- Validate all external account inputs and URLs.
- Public endpoints return approved/public items only.
- Add refresh endpoint throttling/rate limiting.
- Keep audit trail for moderation actions.

## 11) Performance and Cost Constraints

- Designed for free-tier usage on Vercel + Supabase.
- Manual refresh only to avoid scheduled compute load.
- Pagination required for project/profile feeds.
- Direct media hotlinks avoid storage and bandwidth duplication.
- Metadata-only persistence reduces DB/storage footprint.

## 12) Testing Strategy (Target >=80% Coverage)

### Unit

- Provider normalization functions.
- Moderation state transition logic.
- Role checks and validation functions.

### Integration

- Link submission + moderation approval flow.
- Refresh flow with mocked provider responses.
- Public feed query only returning approved items.

### E2E

- Member signup/login, link account, request refresh.
- Admin approval path for links and items.
- Guest sees approved content on landing/projects/profile.

## 13) Implementation Phases

1. Foundations
   - Supabase project setup, schema, auth wiring, role model.
2. Public product shell
   - Landing, projects, member profile pages and query APIs.
3. Linking and adapters
   - Link flows + adapter interface + itch.io and Medium adapters.
4. Moderation controls
   - Admin queues and approval/rejection actions.
5. Hardening and release
   - Error handling, observability basics, test coverage, deployment documentation.

## 14) Out of Scope for This Spec

- Behance/DeviantArt provider implementation.
- Scheduled sync workers.
- Advanced recommendation/ranking systems.
- Data warehouse or analytics pipelines.
- Asset proxying/caching infrastructure.

## 15) Acceptance Criteria

- Members can authenticate, link itch.io/Medium accounts, and request manual refresh.
- Admin can approve/reject links and items.
- Public pages display only approved items.
- Projects page supports filtering by member, platform, media type, and tags.
- System stores only minimal metadata references and no media binaries.
- App deploys successfully to Vercel with Supabase backend on free-tier-friendly settings.

## 16) Open Items (Explicitly Deferred)

- Exact provider API/endpoint details per platform, captured during implementation planning.
- Threshold values for refresh rate limiting and moderation queue SLAs.
- Future provider onboarding checklist template for Behance/DeviantArt phase.
