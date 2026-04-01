# ARCHITECTURE.md - MoneyState

## Overview

MoneyState is a server-first fullstack application built with Next.js App Router.

The architecture is modular and layered:

- App Router for pages and route composition
- domain logic isolated from UI and transport
- Route Handlers for HTTP API
- Prisma + PostgreSQL for persistence
- Auth.js for authentication
- PWA support for installable mobile usage

This project is personal and user-scoped, but the codebase should be organized at production level.

---

## Core Principles

- server-first by default
- mobile-first UI
- business rules live outside React components
- API contracts are explicit
- user data is always scoped by authenticated session
- domain logic is reusable across UI and API
- PWA is installable, but not offline-first by default

---

## Technical Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- Auth.js
- react-hook-form
- zod
- Frankfurter for exchange rates

---

## Rendering Strategy

Reads should be server-first.

Recommended defaults:

- pages and data-heavy views use Server Components
- month view and year view are loaded on the server
- entity lists are loaded on the server
- Client Components are used only for interactivity

Typical Client Component cases:

- forms
- dialogs
- bottom sheets
- dropdowns
- local UI state

---

## Write Strategy

Write operations should go through Route Handlers by default.

Reasons:

- API contracts are already defined in `API.md`
- the backend boundary stays explicit
- validation and auth checks stay centralized
- domain logic is easier to reuse and test

Server Actions may be introduced later for small localized form flows, but they are not the default architecture rule.

For reads inside the same application:

- prefer calling server-side application or module code directly
- avoid making internal HTTP calls to the app's own API from Server Components unless there is a clear boundary reason

---

## Layers

### App Layer

Responsible for:

- routes
- layouts
- page composition
- calling application services and server-side module logic

Main location:

- `src/app`

### UI Layer

Responsible for:

- visual rendering
- reusable UI primitives
- shared app components
- module-specific presentation components

Main locations:

- `src/components/ui`
- `src/components/shared`
- `src/modules/*/components`

### Domain Layer

Responsible for:

- business rules
- calculations
- invariants
- value objects
- domain types

Main location:

- `src/domain`

Examples:

- period matching
- confirmed timing checks
- net calculation
- range calculation
- obligation grouping for month view

### Application Layer

Responsible for:

- use cases
- orchestration
- DTO mapping between domain and persistence

Main location:

- `src/modules/*`

Examples:

- create income
- update expense
- resolve obligation
- get month view
- get year view

### Data / Infrastructure Layer

Responsible for:

- Prisma access
- Auth.js integration
- exchange-rate client and cache
- low-level persistence helpers

Main locations:

- `src/lib`
- `prisma`

---

## Directory Structure

Recommended project structure:

```text
src/
  app/
    api/
    (app)/
  components/
    ui/
    shared/
  domain/
  modules/
    auth/
    incomes/
    expenses/
    obligations/
    categories/
    views/
    exchange-rates/
  lib/
  styles/
prisma/
docs/
AGENTS.md
```

### Folder Roles

- `src/app`: routes, layouts, route handlers, page entry points
- `src/components/ui`: shadcn/ui primitives and minimal wrappers
- `src/components/shared`: shared application components
- `src/domain`: pure business logic and shared domain rules
- `src/modules`: use-case level module code grouped by domain area
- `src/lib`: technical helpers, integrations, and framework utilities
- `src/styles`: styling assets beyond minimal global setup
- `prisma`: schema and migrations

---

## Module Strategy

The codebase uses `modules`, not `features`, as the main organizational unit.

Reason:

- the domain is stable and clearly split into business areas
- modules map well to product areas and API resources
- the structure stays readable as the app grows

Primary modules:

- `auth`
- `incomes`
- `expenses`
- `obligations`
- `categories`
- `views`
- `exchange-rates`

---

## Auth Architecture

Authentication uses Auth.js with:

- credentials
- Google sign-in

Rules:

- session defines current user scope
- business endpoints never accept `userId` from the client
- all user data is filtered by authenticated user on the server

Practical split:

- Auth.js manages session, sign-in, sign-out, and provider flows
- the application owns user registration for credentials auth
- business routes consume authenticated session state, not raw auth provider callbacks

---

## Exchange Rate Architecture

Exchange-rate integration is server-side only.

Rules:

- the client never calls Frankfurter directly
- exchange rates are cached in the system
- cached rates are refreshed daily
- refresh should be triggered by a scheduled daily cron job or equivalent scheduler
- conversions use the latest available cached rates
- if an update fails, the last successful cached rates remain active
- aggregated views should expose the effective rates date used for conversion

This preserves the product goal of approximate, non-real-time conversion without leaking provider concerns into the UI.

---

## PWA Scope

The app should support installable mobile usage.

Current PWA scope:

- manifest
- installable app shell
- icons and theming
- mobile-friendly navigation

Not required by default:

- full offline-first architecture
- complex background sync
- heavy local caching strategy

---

## Dependency Direction

Allowed dependency flow:

- app -> modules -> domain
- app -> modules -> lib
- modules -> domain
- modules -> lib
- components -> domain types only when needed

Not allowed:

- domain depending on React
- domain depending on Next.js
- route handlers containing complex business calculations
- UI components talking directly to Prisma

---
