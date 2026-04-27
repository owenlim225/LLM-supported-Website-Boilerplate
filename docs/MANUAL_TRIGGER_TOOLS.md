# Manual Trigger Tools (Cursor + ECC + Superpowers)

Use this as your quick reference for things you trigger manually.

## 1) Slash Commands (`/` in Agent Chat)

These are the main manual triggers. Type `/` in chat, pick a command, then add your request.

### Core workflow (memorize first)

| Trigger | Purpose | Example |
|---|---|---|
| `/brainstorm` | Start Superpowers discovery flow (questions -> spec -> approval) | `/brainstorm Build a ranking dashboard for tournaments` |
| `/plan` | Build implementation plan and wait for your confirmation | `/plan Add Discord OAuth and role mapping` |
| `/tdd` | Force test-first implementation flow | `/tdd Add validation for registration form` |
| `/code-review` | Review local changes or PR | `/code-review` or `/code-review https://github.com/org/repo/pull/12` |
| `/build-fix` | Diagnose and fix build/type errors | `/build-fix` |
| `/verify` | Run verification workflow before shipping | `/verify` |
| `/e2e` | Generate/run E2E testing workflow | `/e2e` |
| `/test-coverage` | Analyze and improve coverage | `/test-coverage` |
| `/quality-gate` | Run release-quality checks | `/quality-gate` |
| `/review-pr` | PR-focused review workflow | `/review-pr 42` |

### Planning/Execution orchestration

| Trigger | Purpose | Example |
|---|---|---|
| `/orchestrate` | Coordinate multi-agent execution | `/orchestrate Implement feature X in parallel` |
| `/multi-plan` | Multi-model planning | `/multi-plan Build billing + alerts` |
| `/multi-execute` | Multi-model implementation execution | `/multi-execute docs + backend + tests` |
| `/multi-backend` | Backend-focused multi workflow | `/multi-backend Add leaderboard API` |
| `/multi-frontend` | Frontend-focused multi workflow | `/multi-frontend Build admin UI` |
| `/multi-workflow` | End-to-end multi workflow | `/multi-workflow Ship v1 profile page` |
| `/loop-start` | Start controlled autonomous loop | `/loop-start Resolve lint backlog` |
| `/loop-status` | Check loop progress | `/loop-status` |

### Language/framework-specific helpers

| Trigger | Purpose | Example |
|---|---|---|
| `/go-review`, `/go-test`, `/go-build` | Go-specific review/TDD/build | `/go-review` |
| `/python-review` | Python-focused review | `/python-review` |
| `/cpp-review`, `/cpp-test`, `/cpp-build` | C++ review/testing/build | `/cpp-build` |
| `/kotlin-review`, `/kotlin-test`, `/kotlin-build` | Kotlin review/testing/build | `/kotlin-review` |
| `/rust-review`, `/rust-test`, `/rust-build` | Rust review/testing/build | `/rust-build` |
| `/flutter-review`, `/flutter-test`, `/flutter-build` | Flutter review/testing/build | `/flutter-test` |
| `/gradle-build` | Java/Kotlin Gradle build flow | `/gradle-build` |

### Docs, maintenance, and utility

| Trigger | Purpose | Example |
|---|---|---|
| `/update-docs` | Update docs from current code reality | `/update-docs` |
| `/update-codemaps` | Refresh code map/navigation docs | `/update-codemaps` |
| `/docs` | Documentation-focused action | `/docs Write setup section for MCP` |
| `/setup-pm` | Configure package manager preferences | `/setup-pm pnpm` |
| `/sessions`, `/save-session`, `/resume-session` | Session management | `/sessions` |
| `/context-budget` | Context/token budgeting guidance | `/context-budget` |
| `/prompt-optimize` | Improve prompt clarity/cost | `/prompt-optimize` |
| `/harness-audit` | Audit harness quality/readiness | `/harness-audit` |
| `/model-route` | Route work to suitable model | `/model-route` |
| `/skill-create`, `/skill-health`, `/agent-sort`, `/rules-distill` | Workflow meta tooling | `/skill-health` |

### Instinct/learning workflows

| Trigger | Purpose | Example |
|---|---|---|
| `/learn`, `/learn-eval` | Capture session learnings | `/learn-eval` |
| `/instinct-status` | Show learned instincts | `/instinct-status` |
| `/instinct-import`, `/instinct-export` | Import/export instincts | `/instinct-export` |
| `/evolve`, `/promote`, `/projects`, `/prune` | Evolve/manage instinct sets | `/evolve` |

### Specialized workflows available

`/aside`, `/checkpoint`, `/claw`, `/devfleet`, `/eval`, `/feature-dev`, `/gan-build`, `/gan-design`, `/hookify`, `/hookify-configure`, `/hookify-help`, `/hookify-list`, `/jira`, `/pm2`, `/prp-commit`, `/prp-implement`, `/prp-plan`, `/prp-pr`, `/prp-prd`, `/refactor-clean`, `/santa-loop`.

Use these when you specifically want that named workflow.

---

## 2) Explicit Agent Trigger (manual)

You can manually force an agent in plain language.

| Manual prompt | Purpose | Example |
|---|---|---|
| "Use planner agent" | Detailed planning before code | "Use planner agent to map rollout steps for auth" |
| "Use code-reviewer agent" | Quality/security review of changes | "Use code-reviewer agent on my current diff" |
| "Use tdd-guide agent" | Strict RED-GREEN-REFACTOR path | "Use tdd-guide agent to fix this bug" |
| "Use build-error-resolver agent" | Build/type error triage | "Use build-error-resolver for this TS error" |
| "Use security-reviewer agent" | Security-focused pass | "Use security-reviewer on auth routes" |

Notes:
- Agent files are under `.cursor/agents/`.
- You only need to call this explicitly when you want strict control; otherwise routing can be automatic.

---

## 3) Explicit Skill Trigger (manual)

In Cursor, there is no dedicated `Skill` tool command like Claude Code. Manual trigger is a prompt instruction.

| Manual prompt | Purpose | Example |
|---|---|---|
| "Follow `.cursor/skills/brainstorming/SKILL.md`" | Force question-first discovery and spec | "Follow `.cursor/skills/brainstorming/SKILL.md` for this feature" |
| "Follow `.cursor/skills/writing-plans/SKILL.md`" | Force implementation plan document | "Follow `.cursor/skills/writing-plans/SKILL.md` after spec approval" |
| "Follow `.cursor/skills/tdd-workflow/SKILL.md`" | Force maintained TDD workflow | "Follow `.cursor/skills/tdd-workflow/SKILL.md` while implementing" |

---

## 4) Mode Trigger (manual)

When you want behavior control, request a mode directly.

| Trigger | Purpose | Example |
|---|---|---|
| "Switch to Plan mode" | Design/analysis without coding | "Switch to Plan mode and give me options" |
| "Switch to Agent mode" | Execute implementation | "Switch to Agent mode and implement approved plan" |

---

## Quick recommendation

For most feature work, run this sequence:

1. `/brainstorm`
2. `/plan` (or writing-plans skill after approved spec)
3. `/tdd`
4. `/code-review`
5. `/verify`

