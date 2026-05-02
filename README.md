# LLM Supported Website Boilerplate

A **minimal [Next.js](https://nextjs.org) 16** (App Router) starter: one home page, a JSON health route, and optional API rate limiting in `middleware.ts`. The repo also includes **Cursor + Everything Claude Code (ECC)** workflow assets under `.cursor/` (rules, skills, hooks) so you can grow features with a consistent process.

**Third-party:** Design-time agent skills **brainstorming** and **writing-plans** come from [Superpowers](https://github.com/obra/superpowers) (vendored). See [`docs/superpowers/NOTICE.md`](docs/superpowers/NOTICE.md).

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The health endpoint is [http://localhost:3000/api/health](http://localhost:3000/api/health).

## What to do next

- Edit the home page in `app/page.tsx` and site metadata in `app/layout.tsx`.
- Add pages and API routes under `app/`.
- Reuse the JSON response helpers in `lib/http.ts` (`ok` / `fail`) for a consistent API envelope.
- Read `AGENTS.md` for agent orchestration, testing expectations, and Superpowers spec/plan flow.

## Scripts

| Script    | Command        |
| --------- | -------------- |
| Dev       | `npm run dev`  |
| Build     | `npm run build`|
| Start     | `npm run start`|
| Lint      | `npm run lint` |

## Deploy

Deploy anywhere that supports Next.js (for example [Vercel](https://vercel.com)). See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
