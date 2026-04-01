# DOMAIN.md - MoneyState

## Domain Overview

MoneyState models a financial state using two layers:

- confirmed: Income and Expense
- possible: Obligation

Confirmed items define net.
Obligations define uncertainty and affect range only.

There is no transaction history.

---

## Core Entities

### Income

Confirmed incoming money.

### Expense

Confirmed outgoing money.

### Obligation

Uncertain financial event that may result in paying or receiving money.

---

## Shared Rules

All financial entities have:

- id
- title
- amount
- currency
- categoryId? (optional)
- notes? (optional)
- createdAt
- updatedAt

General invariants:

- amount > 0
- currency is one of: USD, EUR, RUB, CNY

---

## User Boundary

The system is scoped to an authenticated user.

### User

Represents the owner of financial data and settings.

Core fields:

- id
- email
- name? (optional)
- baseCurrency

Rules:

- each Income belongs to one User
- each Expense belongs to one User
- each Obligation belongs to one User
- each Category belongs to one User
- all reads and writes are scoped by the current authenticated user

### Authentication Identity

The system supports multiple sign-in methods for the same user.

Supported providers:

- credentials
- google

Authentication data may be represented separately from the main User profile.

User-facing provider information may be derived from linked authentication identities rather than stored as a core user field.

---

## Confirmed Entities

Income and Expense are confirmed entities.

Shared confirmed fields:

- type: income | expense
- timingType: single | monthly | yearly

### Single Timing

Fields:

- year
- month

Meaning:

- applies to one exact month

### Monthly Timing

Fields:

- startYear
- startMonth
- endYear? (optional)
- endMonth? (optional)

Meaning:

- applies every month from start
- applies until end if end is set

### Yearly Timing

Fields:

- month
- startYear
- endYear? (optional)

Meaning:

- applies once per year
- always in the same month
- is never spread across other months

---

## Confirmed Timing Rules

A confirmed item applies to a selected period if:

- single: selected year/month exactly matches the item year/month
- monthly: selected period is on or after start and on or before optional end
- yearly: selected month matches the item month and selected year is within the active year range

Confirmed items affect:

- income total
- expense total
- net

Formula:

- net = income - expense

---

## Obligation

Obligation belongs to the possible layer.

Fields:

- direction: pay | receive
- status: active | done | canceled
- activeFromYear
- activeFromMonth
- resolvedYear? (optional)
- resolvedMonth? (optional)
- expectedYear? (optional)
- expectedMonth? (optional)

### Obligation Meaning

- activeFrom defines when the obligation starts existing in the model
- resolvedYear/resolvedMonth define when the obligation stops being active
- expectedYear/expectedMonth are only an approximate timing hint

Important:

- expected timing is optional
- expected timing does not make the obligation confirmed
- expected timing is not an expiration date

---

## Obligation Lifecycle

Allowed statuses:

- active
- done
- canceled

Lifecycle transitions:

- active -> done
- active -> canceled

Reverse transitions are not supported.

If status is:

- active: resolvedYear/resolvedMonth must be empty
- done or canceled: resolvedYear/resolvedMonth must be recorded

For month-level calculations, an obligation is treated as inactive starting from its resolved month.

### Overdue State

Overdue is a derived presentation state, not a stored lifecycle status.

An obligation is overdue when:

- status = active
- expectedYear/expectedMonth are set
- the selected period is later than the expected period

Rules:

- overdue obligations remain active
- overdue obligations remain visible
- overdue obligations may still affect possible values in contextual views
- an obligation disappears only after done or canceled

---

## Obligation Conversion Rules

When an obligation is marked as done:

- it stops affecting possible values
- it may optionally create a confirmed single item in the resolved month

Conversion mapping:

- done + receive -> Income
- done + pay -> Expense

Additional rules:

- conversion is user-controlled
- conversion can happen only once
- a converted obligation should keep a link to the created confirmed item
- done and canceled obligations are final states and must not be edited except for deletion if the product allows deletion

---

## Possible Layer

Possible values are derived from active obligations.

There are two useful contexts for possible calculations.

### Global Possible

Derived values:

- possibleReceive = sum(active receive obligations)
- possiblePay = sum(active pay obligations)

This context is useful for general obligation overviews.

### Month Context Possible

For a selected month, possible values are contextual:

- matched obligations may affect month possible values
- overdue obligations may affect month possible values
- unscheduled obligations remain visible but do not affect month range by default

Range:

- min = net - possiblePay
- max = net + possibleReceive

Important:

- obligations never affect net directly
- range is always derived and shown separately from net

---

## Time and Context

The system uses year + month only.

There is no day-level precision.

Time behaves differently by layer:

- confirmed items use strict timing rules
- obligations use lifecycle timing and may optionally have expected timing

This preserves the difference between exact modeled values and uncertainty.

---

## Data Access Model

Financial data exists in two forms.

### Entity Collections

- Income
- Expense
- Obligation

Each collection can be listed and filtered independently.

### Derived Views

Computed views include:

- month view
- year view
- confirmed values
- possible values
- range

---

## Currency Model

The user has a base currency.

Each item stores:

- original amount
- original currency

Conversion rules:

- aggregates are calculated in base currency
- original amount is preserved
- converted value is derived
- conversion uses the latest cached exchange rate
- converted values are approximate
- baseCurrency is also the default currency for creating new financial items

If the base currency changes, values are recalculated for display.

---

## Exchange Rates

- source: Frankfurter
- stored in the system cache
- updated daily
- not real-time

Historical exchange-rate snapshots are not stored.

---

## Categories

Fields:

- id
- name

Rules:

- optional
- user-defined
- not restricted by entity type
- used for filtering and grouping
- if a category is deleted, linked entities keep working with `categoryId = null`

---

## Invariants

- obligations never affect confirmed net
- range is derived from possible values
- no transaction history exists
- time precision is month-based only
- month must be in 1..12
- yearly items happen in one month per year only
