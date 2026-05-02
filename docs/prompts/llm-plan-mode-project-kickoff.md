# LLM instruction: Plan-mode project discovery

**Purpose:** When an assistant reads this file (or you paste it into a chat), it must **not** implement anything yet. It enters **Plan Mode** behavior: clarify intent, surface constraints, and produce a shared picture of what the project is about—by **asking you** structured questions and reflecting answers back.

**How to use:** Open this file in your IDE, `@`-mention it in Cursor (or paste its contents), and say: *Run the kickoff in this document.*

---

## Operating rules for the assistant

1. **Plan Mode only** — No code edits, no dependency installs, no refactors, no “quick prototypes,” unless the user explicitly overrides this in the same message.
2. **User is the source of truth** — Prefer questions over assumptions. If the repo has clues (README, existing specs), use them as *hypotheses* to validate with the user, not as final answers.
3. **One conversation arc** — Start broad, then narrow. Do not dump a fifty-question form in one message; use **2–4 short rounds** of follow-ups.
4. **Visible structure** — After each round, give a **brief synthesis** (“Here is what I understand so far…”) and list **only the gaps** you still need.
5. **End with a decision checkpoint** — Finish with a concise **Project snapshot** the user can approve or correct, plus optional **next step** (e.g. draft spec path, risks, open questions).

---

## Discovery agenda (what to cover)

Walk through the topics below. Skip sections that are clearly irrelevant after the first round, but **do not skip problem definition and success criteria**.

### 1. Problem and outcome

- What problem are you solving, for whom, and why now?
- What does **success** look like in 1–2 sentences (user-visible or business outcome)?
- What is **explicitly out of scope** for the first slice?

### 2. Users and context

- Primary user(s): role, skill level, environment (web/mobile/internal).
- Main **jobs to be done** (tasks they need to complete).
- Accessibility, locale, or compliance needs if any.

### 3. Scope of the first delivery

- Smallest useful **MVP** or **phase 1** — concrete behaviors or screens.
- **Non-goals** for phase 1 (to prevent scope creep).
- Dependencies on people, data, APIs, or approvals.

### 4. Quality bar

- Performance, reliability, security, or privacy expectations.
- What would count as **unacceptable** (e.g. data leaks, wrong legal region)?

### 5. Technical constraints (only if relevant)

- Stack preferences, hosting, existing systems to integrate with.
- Timeline or budget bands that affect scope (rough is fine).

### 6. Risks and unknowns

- Biggest **unknowns** or assumptions that could invalidate the plan.
- What evidence would reduce uncertainty (spike, user interview, API doc review)?

---

## Question style (required)

- Prefer **specific, answerable** questions over vague ones.
- Offer **examples** when helpful (“e.g. public marketing site vs authenticated dashboard”).
- When the repo suggests an answer, phrase as: *“I see X in the repo—is that still accurate?”*

---

## Deliverable template (what you produce for the user)

When discovery is “good enough” for phase 1 (or the user says to stop), output:

1. **Project snapshot** — Problem, target users, MVP scope, success metrics, out-of-scope, main risks.
2. **Open questions** — Ranked; **must-fix before build** vs **can defer**.
3. **Recommended next step** — One sentence (e.g. “Capture this in `docs/...` spec” or “Validate API X with a spike”).

Do not start implementation until the user **confirms** the snapshot or says to proceed despite open questions.

---

## Optional: tie-in to this repository

If this repo uses a spec/plan workflow, the assistant may **suggest** where a written spec should live (for example under `docs/superpowers/specs/`) after the user approves the snapshot. It still must not write that spec unless the user asks.
