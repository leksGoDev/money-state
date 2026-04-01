# CONVENTIONS.md - MoneyState

## General

The project should stay small, strict, and readable.

Core rules:

- prefer clarity over abstraction
- prefer explicit names over generic helpers
- keep business logic out of UI
- keep utility sprawl under control
- add structure only when it reduces confusion

---

## Code Style

### Backend

- Route Handlers validate input, check auth, and call module logic
- business logic must not live directly in route handlers
- Prisma calls should be concentrated in module or infrastructure code
- domain calculations must stay framework-independent

### Frontend

- Server Components by default
- Client Components only when interactivity is required
- pages compose blocks, not business logic
- large JSX blocks should be split into smaller components

### Styles

- Tailwind is the primary styling tool
- global CSS should stay minimal
- design tokens should live in CSS variables
- repeated class combinations should be wrapped in components or variants

---

## Naming

- use full descriptive names
- prefer domain names over vague technical names
- use singular names for domain entity types
- use plural names for collections and modules only where natural

Examples:

- `resolveObligation`
- `calculateMonthRange`
- `createIncomeSchema`
- `incomeRepository`

Avoid:

- `helpers`
- `misc`
- `commonUtils`
- `dataStuff`

---

## Types

Types should live close to their owning layer.

Rules:

- domain types stay in `src/domain`
- module request/response and input types stay inside the owning module
- component prop types stay next to the component unless reused broadly
- shared technical utility types may live in a small shared location

Do not create a global project-wide `types.ts` bucket.

---

## Utilities

Utilities should be organized by meaning.

Rules:

- business utilities go into `src/domain`
- module-specific helpers go inside the module
- framework and infrastructure helpers go into `src/lib`
- avoid global `utils.ts` and `helpers.ts` dumping grounds

Examples:

- `src/domain/period/...`
- `src/domain/money/...`
- `src/modules/obligations/...`
- `src/lib/cn.ts`
- `src/lib/env.ts`

---

## Validation

- use `zod` for schema validation
- reuse schemas between frontend and backend where practical
- keep validation close to the module that owns the input
- enforce domain constraints at both validation and domain levels when needed

Examples:

- amount must be greater than zero
- month must be in `1..12`
- resolved month is required for resolve and cancel flows

---

## Forms

- use `react-hook-form` for interactive forms
- pair forms with `zod`
- small forms still use the same approach for consistency
- forms should map clearly to API payloads

Main expected forms:

- sign in
- sign up
- create or edit income
- create or edit expense
- create or edit obligation
- resolve obligation
- settings update

---

## Styling Convention

Tailwind should be used in a structured way.

Rules:

- keep `globals.css` small
- define theme variables in CSS custom properties
- use `clsx` and `tailwind-merge` through a shared `cn` helper
- use `class-variance-authority` for component variants
- extract repeated visual patterns into components

Do not:

- write giant `className` strings in page files
- move large styling systems into global CSS
- create premature CSS abstraction layers

Recommended style boundaries:

- `globals.css`: reset, tokens, base theme, app-level defaults
- `components/ui`: primitive variants
- `components/shared`: repeated app blocks
- `modules/*/components`: domain-specific styling

---

## Imports

- prefer absolute imports from `src`
- keep import order clean and stable
- do not create circular dependencies between modules
- domain should not import from app or UI layers

---

## Error Handling

- return consistent API error shapes
- use explicit error codes for business failures
- do not swallow validation or auth errors
- show user-friendly messages in the UI, but keep server errors structured

---

## Git

Commit format:

- `type(domain): message`

Examples:

- `feat(obligations): add resolve endpoint`
- `fix(views): correct month range calculation`
- `docs(domain): clarify overdue obligations`

The exact set of commit types is flexible.
The format matters more than enforcing a rigid catalog.

---
