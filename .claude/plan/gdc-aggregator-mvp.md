# GDC Aggregator MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a production-ready MVP for UPHSL Game Developers Club on Vercel + Supabase that aggregates itch.io and Medium content with link-first metadata caching, manual refresh, and admin moderation.

**Architecture:** Use Next.js App Router for UI + route handlers, Supabase Auth for identity, and Supabase Postgres for normalized metadata and moderation state. External provider integration is isolated behind adapter interfaces so only adapter files change when adding providers later. Public pages read only approved records; member/admin dashboards handle linking, refresh, and moderation.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, Supabase (Auth + Postgres), Vitest, Playwright, Zod

---

## Implementation Plan: GDC Aggregator MVP

### Task Type
- [ ] Frontend (→ Gemini)
- [ ] Backend (→ Codex)
- [x] Fullstack (→ Parallel)

### Technical Solution
1. Create a feature-oriented app structure (`features/auth`, `features/providers`, `features/content`, `features/moderation`) and keep route handlers thin.
2. Implement a normalized data model (`users`, `linked_accounts`, `content_items`, `sync_logs`, `moderation_actions`) in Supabase with RLS policies for guest/member/admin boundaries.
3. Build provider adapter contracts and two adapters (`itchio`, `medium`) that return normalized items and provider-safe errors.
4. Implement manual refresh pipeline with optimistic UI feedback, server-side throttling, and moderation-gated publishing.
5. Build public pages first (landing/projects/profile), then member/admin dashboards, then tests and deployment hardening.

### Key Files
| File | Operation | Description |
|------|-----------|-------------|
| `app/page.tsx` | Modify | Landing page |
| `app/projects/page.tsx` | Create | Public projects directory with filters |
| `app/members/[slug]/page.tsx` | Create | Public member profile |
| `app/(dashboard)/member/*` | Create | Member link + refresh UI |
| `app/(dashboard)/admin/*` | Create | Admin moderation UI |
| `app/api/providers/*/route.ts` | Create | Link + refresh routes |
| `app/api/content/route.ts` | Create | Public content query endpoint |
| `lib/supabase/{client,server}.ts` | Create | Supabase clients |
| `lib/providers/{types,itchio,medium}.ts` | Create | Provider adapter contracts + implementations |
| `lib/content/normalize.ts` | Create | Unified content shape mapping |
| `supabase/migrations/*.sql` | Create | Schema + RLS + indexes |
| `tests/unit/**/*.test.ts` | Create | Unit coverage |
| `tests/integration/**/*.test.ts` | Create | API/data flow tests |
| `tests/e2e/**/*.spec.ts` | Create | Core flow E2E |

### Risks and Mitigation
| Risk | Mitigation |
|------|------------|
| Provider feed/API instability | Adapter abstraction, resilient parsers, sanitized fallback errors |
| Refresh abuse / free-tier exhaustion | Per-user+provider rate-limit window and server-side throttle log |
| Accidental public exposure of unapproved data | Default deny in queries (`moderation_status='approved'`) + RLS and integration tests |
| Auth/role drift in dashboard routes | Server-side role guard helper used in all protected route handlers |
| Metadata drift between providers | Single normalized contract + contract tests per adapter |

### Implementation Steps

### Task 1: Foundation and directory scaffolding

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/auth/roles.ts`
- Create: `lib/types/content.ts`
- Test: `tests/unit/lib/auth/roles.test.ts`

- [ ] **Step 1: Write the failing role guard test**
```ts
import { describe, expect, it } from "vitest";
import { canAccessAdmin, canAccessMember } from "@/lib/auth/roles";

describe("roles", () => {
  it("allows admin into admin pages", () => {
    expect(canAccessAdmin("admin")).toBe(true);
  });
  it("blocks members from admin pages", () => {
    expect(canAccessAdmin("member")).toBe(false);
  });
  it("allows member/admin into member pages", () => {
    expect(canAccessMember("member")).toBe(true);
    expect(canAccessMember("admin")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest tests/unit/lib/auth/roles.test.ts`
Expected: FAIL (`Cannot find module '@/lib/auth/roles'`)

- [ ] **Step 3: Write minimal implementation**
```ts
export type AppRole = "guest" | "member" | "admin";
export const canAccessAdmin = (role: AppRole) => role === "admin";
export const canAccessMember = (role: AppRole) =>
  role === "member" || role === "admin";
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npx vitest tests/unit/lib/auth/roles.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "chore: scaffold auth role guards and supabase libs"`

### Task 2: Supabase schema + RLS baseline

**Files:**
- Create: `supabase/migrations/20260428_001_core_schema.sql`
- Create: `supabase/migrations/20260428_002_rls_policies.sql`
- Test: `tests/integration/db/schema-smoke.test.ts`

- [ ] **Step 1: Write failing integration test for required tables**
```ts
it("has required MVP tables", async () => {
  const required = ["users", "linked_accounts", "content_items", "sync_logs", "moderation_actions"];
  const found = await listPublicTables(); // helper in test setup
  required.forEach((table) => expect(found).toContain(table));
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest tests/integration/db/schema-smoke.test.ts`
Expected: FAIL (missing tables)

- [ ] **Step 3: Add schema + policy SQL**
```sql
create table users (
  id uuid primary key,
  email text unique not null,
  display_name text not null,
  role text not null check (role in ('member','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table linked_accounts (
  id uuid primary key,
  user_id uuid not null references users(id),
  provider text not null check (provider in ('itchio','medium')),
  external_username_or_slug text not null,
  profile_url text not null,
  link_status text not null check (link_status in ('pending_review','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table content_items (
  id uuid primary key,
  user_id uuid not null references users(id),
  linked_account_id uuid not null references linked_accounts(id),
  provider text not null,
  external_item_id text not null,
  media_type text not null,
  title text not null,
  canonical_url text not null,
  thumbnail_url text,
  moderation_status text not null check (moderation_status in ('pending_review','approved','rejected')),
  visibility text not null check (visibility in ('public','hidden_by_member')),
  published_at timestamptz,
  fetched_at timestamptz not null default now()
);
alter table linked_accounts enable row level security;
alter table content_items enable row level security;
create policy "public approved items only"
  on content_items for select
  using (moderation_status='approved' and visibility='public');
```

- [ ] **Step 4: Apply migration and re-run test**
Run: `supabase db reset && npx vitest tests/integration/db/schema-smoke.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add supabase schema and rls baseline"`

### Task 3: Provider adapter contract and normalizer

**Files:**
- Create: `lib/providers/types.ts`
- Create: `lib/content/normalize.ts`
- Test: `tests/unit/lib/providers/normalize.test.ts`

- [ ] **Step 1: Write failing contract test**
```ts
it("normalizes provider items to ContentItemDraft", () => {
  const draft = normalizeProviderItem("itchio", rawGameFixture);
  expect(draft.provider).toBe("itchio");
  expect(draft.canonicalUrl).toMatch(/^https?:\/\//);
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest tests/unit/lib/providers/normalize.test.ts`
Expected: FAIL (`normalizeProviderItem is not defined`)

- [ ] **Step 3: Implement minimal contract + normalizer**
```ts
export type ProviderName = "itchio" | "medium";
export interface ProviderAdapter {
  validateLink(input: string): { ok: boolean; normalized: string };
  fetchItems(input: { profileUrl: string; cursor?: string }): Promise<{ items: unknown[]; nextCursor?: string }>;
  normalize(raw: unknown): ContentItemDraft | null;
}
```

- [ ] **Step 4: Re-run normalization test**
Run: `npx vitest tests/unit/lib/providers/normalize.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add provider adapter contract and normalizer"`

### Task 4: itch.io and Medium adapters

**Files:**
- Create: `lib/providers/itchio.ts`
- Create: `lib/providers/medium.ts`
- Test: `tests/unit/lib/providers/itchio.test.ts`
- Test: `tests/unit/lib/providers/medium.test.ts`

- [ ] **Step 1: Write failing adapter tests**
```ts
it("maps itch.io item to game media type", async () => {
  const raw = { id: "g-1", title: "My Game", url: "https://user.itch.io/my-game" };
  const item = itchioAdapter.normalize(raw);
  expect(item?.mediaType).toBe("game");
});
it("maps medium post to article media type", async () => {
  const raw = { guid: "p-1", title: "Event Recap", link: "https://medium.com/@org/post" };
  const item = mediumAdapter.normalize(raw);
  expect(item?.mediaType).toBe("article");
});
```

- [ ] **Step 2: Run tests to verify fail**
Run: `npx vitest tests/unit/lib/providers/itchio.test.ts tests/unit/lib/providers/medium.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement adapters with safe parsing**
```ts
export const itchioAdapter: ProviderAdapter = { validateLink, fetchItems, normalize };
export const mediumAdapter: ProviderAdapter = { validateLink, fetchItems, normalize };
```

- [ ] **Step 4: Re-run adapter tests**
Run: `npx vitest tests/unit/lib/providers/itchio.test.ts tests/unit/lib/providers/medium.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: implement itchio and medium provider adapters"`

### Task 5: Link account API + moderation gate

**Files:**
- Create: `app/api/providers/link/route.ts`
- Create: `lib/content/link-service.ts`
- Test: `tests/integration/api/link-account.test.ts`

- [ ] **Step 1: Write failing link submission test**
```ts
it("creates linked account as pending_review", async () => {
  const res = await postAsMember("/api/providers/link", payload);
  expect(res.status).toBe(201);
  expect(res.body.linkStatus).toBe("pending_review");
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npx vitest tests/integration/api/link-account.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement minimal route + service**
```ts
// validate provider + profile url, insert linked_accounts row with pending_review
return NextResponse.json({ linkStatus: "pending_review" }, { status: 201 });
```

- [ ] **Step 4: Re-run link integration test**
Run: `npx vitest tests/integration/api/link-account.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add account linking endpoint with pending moderation"`

### Task 6: Manual refresh pipeline and throttling

**Files:**
- Create: `app/api/providers/refresh/route.ts`
- Create: `lib/content/refresh-service.ts`
- Test: `tests/integration/api/manual-refresh.test.ts`

- [ ] **Step 1: Write failing refresh flow test**
```ts
it("fetches items for approved account and stores pending_review items", async () => {
  const res = await postAsMember("/api/providers/refresh", { linkedAccountId });
  expect(res.status).toBe(202);
  expect(res.body.inserted).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run test to verify fail**
Run: `npx vitest tests/integration/api/manual-refresh.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement refresh service**
```ts
guardApprovedLinkedAccount();
guardRefreshThrottle(userId, provider);
const fetched = await adapter.fetchItems(...);
const drafts = fetched.items.map(adapter.normalize).filter(Boolean);
upsertContentItemsAsPendingReview(drafts);
insertSyncLog({ status: "success" | "partial_success" | "failed" });
```

- [ ] **Step 4: Re-run refresh integration test**
Run: `npx vitest tests/integration/api/manual-refresh.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add manual provider refresh pipeline with throttling"`

### Task 7: Public read APIs and filters

**Files:**
- Create: `app/api/content/route.ts`
- Create: `lib/content/query-service.ts`
- Test: `tests/integration/api/public-content.test.ts`

- [ ] **Step 1: Write failing filter test**
```ts
it("returns only approved public items and supports filters", async () => {
  const res = await get("/api/content?provider=itchio&mediaType=game");
  expect(res.status).toBe(200);
  expect(res.body.items.every((x) => x.moderationStatus === "approved")).toBe(true);
});
```

- [ ] **Step 2: Run test to verify fail**
Run: `npx vitest tests/integration/api/public-content.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement query endpoint**
```ts
const query = db
  .from("content_items")
  .select("*")
  .eq("moderation_status", "approved")
  .eq("visibility", "public")
  .order("published_at", { ascending: false })
  .range(offset, offset + limit - 1);
if (provider) query.eq("provider", provider);
if (mediaType) query.eq("media_type", mediaType);
if (memberId) query.eq("user_id", memberId);
```

- [ ] **Step 4: Re-run public content API test**
Run: `npx vitest tests/integration/api/public-content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add public content API with approved-only filters"`

### Task 8: Public pages (landing, projects, profile)

**Files:**
- Modify: `app/page.tsx`
- Create: `app/projects/page.tsx`
- Create: `app/members/[slug]/page.tsx`
- Test: `tests/e2e/public-pages.spec.ts`

- [ ] **Step 1: Write failing E2E test for public discoverability**
```ts
test("guest can browse landing, projects, and member profile", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /UPHSL/i })).toBeVisible();
  await page.goto("/projects");
  await expect(page.getByRole("combobox", { name: /platform/i })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify fail**
Run: `npx playwright test tests/e2e/public-pages.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement the three pages with API-backed data**
```tsx
// app/projects/page.tsx: query /api/content, render filter controls + cards
// app/members/[slug]/page.tsx: show member profile + approved items only
```

- [ ] **Step 4: Re-run E2E test**
Run: `npx playwright test tests/e2e/public-pages.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: build landing projects and member profile pages"`

### Task 9: Member and admin dashboards

**Files:**
- Create: `app/(dashboard)/member/links/page.tsx`
- Create: `app/(dashboard)/member/content/page.tsx`
- Create: `app/(dashboard)/admin/links/page.tsx`
- Create: `app/(dashboard)/admin/content/page.tsx`
- Create: `app/api/admin/moderation/route.ts`
- Test: `tests/e2e/moderation-flow.spec.ts`

- [ ] **Step 1: Write failing moderation E2E test**
```ts
test("admin approves link and item before public display", async ({ page }) => {
  // member submits link -> admin approves -> member refreshes -> admin approves item
  // guest sees item on /projects
});
```

- [ ] **Step 2: Run test to verify fail**
Run: `npx playwright test tests/e2e/moderation-flow.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement dashboard pages + moderation API**
```ts
// moderation transition guard:
// pending_review -> approved|rejected
// approved + member toggle -> hidden_by_member
```

- [ ] **Step 4: Re-run moderation E2E**
Run: `npx playwright test tests/e2e/moderation-flow.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**
Run: `git commit -m "feat: add member and admin dashboards with moderation actions"`

### Task 10: Hardening, docs, and deployment

**Files:**
- Create: `docs/deployment/vercel-supabase.md`
- Create: `.env.example`
- Modify: `README.md`
- Test: `tests/integration/security/authorization.test.ts`

- [ ] **Step 1: Write failing authz integration test**
```ts
it("blocks non-admin access to moderation endpoints", async () => {
  const res = await postAsMember("/api/admin/moderation", body);
  expect(res.status).toBe(403);
});
```

- [ ] **Step 2: Run test to verify fail**
Run: `npx vitest tests/integration/security/authorization.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement final guards + docs**
```md
# Vercel + Supabase Deployment
1. Create Supabase project
2. Apply migrations
3. Set Vercel env vars
4. Deploy and smoke test
```

- [ ] **Step 4: Run full verification**
Run: `npm run lint && npx vitest && npx playwright test`
Expected: all pass, coverage >= 80%

- [ ] **Step 5: Commit**
Run: `git commit -m "chore: harden authz and add vercel-supabase deployment docs"`

### SESSION_ID (for /ccg:execute use)
- CODEX_SESSION: `bdbbed2f-9fc4-45df-8225-b1dbe47a8cba`
- GEMINI_SESSION: `unavailable-in-this-harness`
- FRONTEND_ALT_SESSION: `606c206a-664f-4f7d-8032-986ab7973f85`

