# MoneyState

MoneyState is a mobile-first financial modeling application focused on a user's financial state.

It is not a transaction tracker and not a banking app.

The product models:

- confirmed income
- confirmed expenses
- uncertain obligations

## Core Idea

MoneyState shows a financial snapshot built from two separate layers:

- Confirmed: `income`, `expense`, `net`
- Possible: `obligations`

Formula:

- `net = income - expense`
- `min = net - possiblePay`
- `max = net + possibleReceive`

Important:

- obligations never affect `net` directly
- range is shown separately
- there is no transaction history

## Time Model

The app works with:

- year
- month

No day-level precision is used.

Confirmed items support:

- `single`
- `monthly`
- `yearly`

Obligations are uncertain events with lifecycle state and optional expected timing.

## Main Product Rules

- `Income` and `Expense` are confirmed values
- `Obligation` belongs to the possible layer
- `expected` timing for obligations is approximate, not a deadline
- overdue obligations remain visible while active
- year view top summary shows confirmed totals only
- possible values and range stay contextual at the month level inside year view

## User Experience

MoneyState is designed as:

- mobile-first
- installable as a PWA
- focused on clarity over accounting complexity

Primary navigation:

- `Home`
- `Items`
- `Obligations`
- `Settings`

UI direction:

- Warm Editorial Finance

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Auth.js
- react-hook-form
- zod
- Frankfurter exchange rates

## Authentication

Supported methods:

- email and password
- Google sign-in

First-version auth requirements:

- email verification
- password reset

## Currency

Supported currencies:

- USD
- EUR
- RUB
- CNY

Rules:

- each item keeps original amount and currency
- summaries use the user's base currency
- conversion uses the latest cached rate
- values are approximate
- base currency is also the default currency for new items

## Architecture Direction

The project uses a modular, server-first structure:

- `src/app` for routes and route handlers
- `src/modules` for application logic
- `src/domain` for business rules
- `src/components` for UI
- `src/lib` for infrastructure helpers

Write operations go through Route Handlers by default.

## Documentation

Project docs live in [`docs/`](./docs):

- [`PRODUCT.md`](./docs/PRODUCT.md)
- [`DOMAIN.md`](./docs/DOMAIN.md)
- [`API.md`](./docs/API.md)
- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md)
- [`CONVENTIONS.md`](./docs/CONVENTIONS.md)
- [`UI.md`](./docs/UI.md)

AI workflow notes live in [`AGENTS.md`](./AGENTS.md).

## Status

The project is currently in specification and architecture setup stage.
