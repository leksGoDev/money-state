# PRODUCT.md - MoneyState

## Overview

MoneyState is a mobile-first financial modeling application that helps users understand their financial state without tracking transactions.

The product focuses on:

- confirmed income and expenses
- uncertain obligations
- month-based financial snapshots
- clear separation between confirmed and possible values

The product is not a transaction tracker and does not require logging every purchase.

---

## Core Concept

The system models financial state using three item types:

- Income: confirmed incoming money
- Expense: confirmed outgoing money
- Obligation: uncertain financial event that may result in paying or receiving money

There is no transaction history.

---

## Financial Layers

### Confirmed Layer

Represents the exact modeled state for confirmed items:

- income
- expense
- net = income - expense

### Possible Layer

Represents uncertainty and is shown separately from net:

- obligations to receive
- obligations to pay

### Range

Range is derived from active obligations and is shown as context:

- min = net - possiblePay
- max = net + possibleReceive

Obligations never change net directly.

---

## Time Model

The system operates on:

- year
- month

There is no day-level precision.

---

## Confirmed Timing

Confirmed items use strict month-based timing.

- single: one exact month and year
- monthly: repeats every month from start until optional end
- yearly: repeats once per year in one specific month

Important:

- yearly items are not spread across months
- yearly means one payment or one income in one specific month each year

---

## Obligation Model

Obligations are uncertain events. They are not confirmed financial facts.

Each obligation has:

- direction: pay | receive
- status: active | done | canceled
- lifecycle period: when the obligation exists in the system
- optional expected month/year: approximate timing hint, not a strict confirmed date

Important:

- an obligation may exist without an exact execution month
- expected month/year is optional and only helps with planning and contextual display
- expected month/year is not an expiration rule
- if expected timing passes and the obligation is still active, it remains visible as overdue uncertainty

---

## Obligation Resolution

When an obligation is resolved:

- done means the obligation was fulfilled
- canceled means the obligation is no longer relevant

When an obligation is marked as done:

- it stops affecting possible values
- it may optionally create a confirmed item

Conversion rules:

- done + receive -> Income
- done + pay -> Expense

The conversion is user-controlled.

---

## Views

The system provides two access modes.

### Aggregated View

Users can view a summarized financial state for a selected month or year.

This includes:

- confirmed values: income, expense, net
- possible values: receive, pay
- range: min and max

Year-view rule:

- the top year summary includes confirmed totals only
- possible values and range stay contextual at the month level inside the year view

### Entity View

Users can view entity lists for:

- Income
- Expense
- Obligation

Each list supports:

- listing
- filtering
- editing
- deleting

---

## Currency

The system supports a user-selected base currency.

Supported currencies:

- USD
- EUR
- RUB
- CNY

Rules:

- each item stores its original amount and currency
- converted value is shown alongside the original value
- summaries use base currency
- conversion uses the latest cached exchange rate
- converted values are approximate
- base currency is the default currency when creating new items

If the user changes base currency, values are re-converted for display.

---

## Authentication

The application is user-scoped and requires authentication.

Supported sign-in methods:

- email and password
- Google sign-in

First-version auth requirements:

- email verification for credentials users
- password reset for credentials users

Rules:

- each user sees only their own financial data
- all financial items, categories, and settings belong to one user
- the current user's session defines the active data scope

---

## Categories

Categories are optional labels used for grouping and filtering.

- user-defined
- not required
- not restricted by entity type

---

## Notes

Items may include optional notes for context.

Notes do not affect calculations.

---

## UX Principles

The product prioritizes:

- mobile-first design
- minimal input
- net as the primary number
- possible values shown separately
- range shown as supporting context

---

## Product Philosophy

The application focuses on:

- financial structure instead of transaction history
- clarity over accounting complexity
- modeling over tracking
- practical personal finance planning with uncertainty
