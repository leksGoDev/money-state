# API.md - MoneyState

## Overview

The API provides access to:

- authentication
- user-scoped financial entities
- obligation lifecycle actions
- aggregated month and year views

The API separates:

- write operations on entities
- read operations on derived views

---

## Authentication and Scope

The application is authenticated and user-scoped.

Rules:

- all business endpoints require an authenticated user
- the current user is resolved from the session
- userId is never passed by the client in business payloads
- all reads and writes are scoped to the current authenticated user
- access to another user's data must not be allowed

Recommended unauthorized behavior:

- 401 when no active session exists
- 404 when an entity does not exist in the current user's scope

---

## Auth Endpoints

Authentication is handled by Auth.js.

Rules:

- Auth.js owns sign-in, sign-out, session, and provider callback flows
- internal Auth.js route details are implementation details, not core business API contracts
- UI may use Auth.js helpers instead of calling low-level auth routes directly

Application-level auth endpoint:

- POST /api/auth/register

Supported sign-in methods:

- email and password
- Google sign-in

The register endpoint is only for credentials-based user creation.
Authenticated session handling is delegated to Auth.js.

First-version auth requirements:

- email verification for credentials users
- password reset flow for credentials users

Register payload:

```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "name": "Alex"
}
```

Register behavior:

- creates a credentials-based user
- creates an authenticated session immediately after successful registration

Account linking rule:

- if a Google account and a credentials account use the same verified email, they should resolve to the same user
- the system should not create duplicate users for the same identity

---

## Entity Resources

### Income

- GET /api/incomes
- POST /api/incomes
- GET /api/incomes/:id
- PATCH /api/incomes/:id
- DELETE /api/incomes/:id

### Expense

- GET /api/expenses
- POST /api/expenses
- GET /api/expenses/:id
- PATCH /api/expenses/:id
- DELETE /api/expenses/:id

### Obligation

- GET /api/obligations
- POST /api/obligations
- GET /api/obligations/:id
- PATCH /api/obligations/:id
- DELETE /api/obligations/:id

### Category

- GET /api/categories
- POST /api/categories
- GET /api/categories/:id
- PATCH /api/categories/:id
- DELETE /api/categories/:id

### Current User

- GET /api/me

### Settings

- GET /api/settings
- PATCH /api/settings

### Current User Response

Recommended shape:

```json
{
  "id": "user_1",
  "email": "user@example.com",
  "name": "Alex",
  "baseCurrency": "EUR",
  "providers": ["credentials", "google"]
}
```

### Settings Response

Current settings scope:

- baseCurrency

Recommended shape:

```json
{
  "baseCurrency": "EUR"
}
```

Patch payload:

```json
{
  "baseCurrency": "USD"
}
```

---

## Confirmed Entity Payloads

Income and Expense use the same payload shape with different endpoints.

Shared fields:

- title
- amount
- currency
- timingType: single | monthly | yearly
- categoryId? (optional)
- notes? (optional)

### Single

Required fields:

- year
- month

### Monthly

Required fields:

- startYear
- startMonth

Optional fields:

- endYear
- endMonth

### Yearly

Required fields:

- month
- startYear

Optional fields:

- endYear

Example:

```json
{
  "title": "Salary",
  "amount": "3500.00",
  "currency": "USD",
  "timingType": "monthly",
  "startYear": 2026,
  "startMonth": 1,
  "endYear": null,
  "endMonth": null,
  "categoryId": null,
  "notes": "Main salary"
}
```

Confirmed entity responses should return normalized DTOs, not raw database rows.

---

## Obligation Payload

Obligation fields:

- title
- amount
- currency
- direction: pay | receive
- activeFromYear
- activeFromMonth
- expectedYear? (optional)
- expectedMonth? (optional)
- categoryId? (optional)
- notes? (optional)

Status is not supplied on create and defaults to active.

Resolved fields are managed only by lifecycle actions.

Example:

```json
{
  "title": "Possible debt repayment",
  "amount": "20000.00",
  "currency": "RUB",
  "direction": "receive",
  "activeFromYear": 2026,
  "activeFromMonth": 4,
  "expectedYear": 2026,
  "expectedMonth": 6,
  "categoryId": null,
  "notes": "He said maybe by summer"
}
```

Obligation responses should also return normalized DTOs.

Editing rule:

- active obligations may be edited
- done and canceled obligations are final and should not be editable through update endpoints

---

## Obligation Lifecycle Endpoints

Business actions:

- POST /api/obligations/:id/resolve
- POST /api/obligations/:id/cancel

### Resolve

Resolve is a single user action with two modes:

- converted
- closed

Request shape:

```json
{
  "resolution": "converted",
  "resolvedYear": 2026,
  "resolvedMonth": 4,
  "confirmed": {
    "title": "Debt repaid",
    "categoryId": "cat_1",
    "notes": "Converted from obligation"
  }
}
```

Or:

```json
{
  "resolution": "closed",
  "resolvedYear": 2026,
  "resolvedMonth": 4
}
```

Rules:

- only active obligations can be resolved
- resolve sets status to done
- resolvedYear/resolvedMonth are required
- converted creates a confirmed single item in the resolved month
- conversion uses the original obligation amount, currency, and direction
- converted obligation should keep a link to the created confirmed item
- conversion can happen only once

### Cancel

Request shape:

```json
{
  "resolvedYear": 2026,
  "resolvedMonth": 4
}
```

Rules:

- only active obligations can be canceled
- cancel sets status to canceled
- canceled obligations do not create confirmed items

---

## List Query Parameters

Entity lists should support server-side query features.

Common parameters:

- page
- limit
- sortBy
- sortOrder
- search

### Income and Expense Filters

- timingType
- categoryId
- currency
- activeInYear
- activeInMonth

### Obligation Filters

- status
- direction
- categoryId
- currency
- hasExpectedPeriod
- expectedYear
- expectedMonth
- activeInYear
- activeInMonth

---

## Aggregated Views

Read-only derived endpoints:

- GET /api/views/month
- GET /api/views/year

These endpoints return aggregated financial state in the user's base currency.

All converted values are approximate and use the latest cached exchange rate.

---

## Currency Conversion Flow

Currency conversion is server-side only.

Rules:

- the client never calls Frankfurter directly
- the server reads from the latest cached exchange rates
- rates are refreshed daily
- rate refresh should run through a scheduled daily cron job or equivalent server scheduler
- if refresh fails, the last cached rates remain in use until a newer successful update is available
- aggregated responses should include the date of the cached rates used for conversion

This keeps conversion explicit, cached, and approximate by design.

---

## Entity Response Shape

Entity endpoints should return normalized application DTOs.

Recommended money fields:

- id
- amount
- currency
- convertedAmount
- baseCurrency
- createdAt
- updatedAt

Optional contextual field:

- ratesDate

This allows UI lists and forms to render original and converted values consistently without exposing raw persistence structure.

---

## Month View

Request parameters:

- year
- month
- expectedWindow? (optional, default = 1)

Month view returns:

- confirmed totals
- possible totals
- range
- obligation groups for contextual display

Obligation groups:

- matched: active obligations with expected period inside the selected month window
- overdue: active obligations with expected period earlier than the selected period
- unscheduled: active obligations without expected period

Recommended range behavior:

- matched obligations affect month possible totals
- overdue obligations affect month possible totals
- unscheduled obligations are returned separately and do not affect month range by default

Example response shape:

```json
{
  "period": {
    "year": 2026,
    "month": 4
  },
  "currency": {
    "baseCurrency": "USD",
    "ratesDate": "2026-04-01",
    "approximate": true
  },
  "confirmed": {
    "income": "5000.00",
    "expense": "2200.00",
    "net": "2800.00"
  },
  "possible": {
    "receive": "700.00",
    "pay": "300.00"
  },
  "range": {
    "min": "2500.00",
    "max": "3500.00"
  },
  "obligations": {
    "matched": [],
    "overdue": [],
    "unscheduled": []
  }
}
```

---

## Year View

Request parameters:

- year
- expectedWindow? (optional, default = 1)

Year view returns:

- year summary
- month summaries for all 12 months

Rules:

- yearly confirmed items contribute only to their configured month
- yearly values are never spread across months
- year summary contains confirmed totals only
- possible values and range remain inside month summaries only

Example response shape:

```json
{
  "year": 2026,
  "currency": {
    "baseCurrency": "USD",
    "ratesDate": "2026-04-01",
    "approximate": true
  },
  "summary": {
    "income": "60000.00",
    "expense": "31000.00",
    "net": "29000.00"
  },
  "months": []
}
```

---

## Currency in Responses

All entity responses should include:

- original amount
- original currency
- converted amount in base currency

Recommended response fields:

- amount
- currency
- convertedAmount
- baseCurrency

Aggregated views are returned in base currency.

---

## Pagination Shape

List endpoints should return:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 57
  }
}
```

---

## Error Shape

Recommended error response:

```json
{
  "error": {
    "code": "OBLIGATION_NOT_ACTIVE",
    "message": "Only active obligations can be resolved."
  }
}
```

---

## Calculation Rules

- net = income - expense
- month-view possibleReceive = sum(active matched and overdue receive obligations)
- month-view possiblePay = sum(active matched and overdue pay obligations)
- min = net - possiblePay
- max = net + possibleReceive

Important:

- obligations never affect net directly
- unscheduled obligations are shown separately by default
