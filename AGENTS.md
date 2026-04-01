# AGENTS.md - MoneyState

## Purpose

This file is the entry point for AI agents working in the repository.

Before making meaningful changes, read these documents:

- `docs/PRODUCT.md`
- `docs/DOMAIN.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`
- `docs/CONVENTIONS.md`
- `docs/UI.md`

---

## Project Shape

MoneyState is:

- a financial state modeling app
- not a transaction tracker
- built with Next.js App Router
- server-first by default
- mobile-first
- installable as a PWA

Key domain rule:

- confirmed values and possible values must stay separate

Never collapse obligations into confirmed net calculations.

---

## Working Rules

- use `src/` as the main source root
- organize code by `modules`
- keep business logic out of UI components
- keep domain logic out of route handlers when it grows beyond transport concerns
- prefer Route Handlers for writes and explicit API behavior
- use Server Components by default
- use Client Components only when interactivity is needed

---

## Styling Rules

- use Tailwind in a disciplined way
- keep `globals.css` small
- use CSS variables for tokens
- avoid giant inline utility chains in page files
- use shared components and variants for repeated visual patterns
- do not leave default shadcn styling uncustomized where product-facing visuals matter

---

## Architecture Safety

Do not change these without explicit discussion:

- core domain meaning
- financial formulas
- obligation lifecycle rules
- architecture direction
- API contract direction
- major doc structure

If implementation reveals a conflict, stop and surface it clearly.

---

## Dependency Rules

Do not introduce new dependencies without a clear reason.

Prefer existing stack decisions:

- Auth.js for auth
- Prisma for persistence
- zod for validation
- react-hook-form for forms
- shadcn/ui for primitives

---

## Documentation Rules

- do not casually rewrite docs
- update docs when behavior materially changes
- ask before making major documentation or architecture changes

---

## Git

Commit messages should follow:

- `type(domain): message`

Examples:

- `feat(incomes): add create route`
- `fix(domain): correct yearly matching`
- `docs(ui): define month view blocks`

---

## Decision Priority

When in doubt, prioritize:

1. domain correctness
2. clarity of structure
3. UX clarity
4. implementation simplicity
5. speed
