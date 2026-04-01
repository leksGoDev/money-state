# UI.md - MoneyState

## Overview

MoneyState is a mobile-first interface centered on a user's financial state.

The UI should feel:

- personal
- clear
- calm
- premium
- slightly editorial rather than corporate

The app is not a bank dashboard and should not look like one.

---

## Visual Direction

Chosen direction:

- Warm Editorial Finance

This means:

- light warm surfaces instead of pure white
- dark graphite text instead of hard black
- calm green accents instead of banking blue
- expressive typography for headings
- clean, readable numerals for money values

---

## Visual Principles

- light theme first
- warm neutral backgrounds
- layered cards and sections
- clear hierarchy around net
- possible and range are secondary but visible
- the interface should feel designed, not templated

Avoid:

- sterile white SaaS layouts
- default-looking shadcn screens
- purple accents
- overly cold finance styling

---

## Color Direction

Suggested palette direction:

- background: warm paper / ivory
- surface: soft cream / off-white
- text: charcoal
- primary accent: deep olive / moss
- warning or uncertainty: muted amber
- borders: warm gray

Color meaning:

- confirmed state uses calm stable tones
- possible state uses softer contextual tones
- overdue state can use muted amber emphasis without alarmism

Exact token values can be finalized during implementation.

---

## Typography

Recommended typography split:

- headings: serif with character
- interface text and numbers: clean sans-serif

Suggested direction:

- heading font: `Instrument Serif` or similar
- UI font: `Manrope` or similar

Typography rules:

- large values should stay highly readable
- money numbers should prioritize clarity over decoration
- serif is used for emphasis and atmosphere, not for dense interface text

---

## Layout Principles

- mobile-first by default
- narrow content width with comfortable vertical rhythm
- one clear primary screen per page
- cards should feel tactile and intentional
- avoid dense grid-heavy layouts on mobile

Desktop behavior:

- keep the same structure
- add breathing room and wider surfaces
- do not turn the UI into a generic admin dashboard

---

## Responsive Targets

Primary mobile design target:

- `390px` width

Supported mobile range:

- minimum supported width: `320px`
- comfortable mobile range: `360px - 430px`

Responsive rules:

- design and compose the primary UI around `390px`
- verify that core flows still work at `320px`
- use larger mobile widths for extra breathing room, not for different information architecture
- tablet and desktop may expand spacing and content width, but should preserve the same main structure

PWA-specific notes:

- respect safe-area insets
- keep bottom navigation comfortable in installed mode
- avoid placing primary actions too close to the screen edges

---

## Main Navigation

Mobile should use bottom navigation with four primary entries:

- Home
- Items
- Obligations
- Settings

Notes:

- Home is the default landing page
- Home contains both Month and Year modes
- navigation labels should stay short

---

## Primary Screens

### Home

Primary screen and main product entry point.

Home should contain two modes:

- Month
- Year

The mode switch belongs on the same screen.

The top of Home should contain:

- current period context
- compact period picker
- Month / Year mode switch

Period picker pattern:

- previous period button
- current period label
- next period button

Default behavior:

- initial period uses the current date

### Home: Month Mode

Month mode should contain:

- current month header and month switcher
- primary net card
- confirmed summary
- possible summary
- range block
- obligation context groups

The screen should read top to bottom as a single coherent financial snapshot.

### Home: Year Mode

Year mode lives inside Home, not as a separate primary navigation section.

The year mode should show:

- year header
- yearly summary
- list of month summaries

Interactions:

- each month summary can open the selected month view

Rules:

- yearly values remain attached to their configured month and are never spread across the year
- top year summary shows confirmed totals only
- possible values and range are shown in month cards, not as one aggregated year-level uncertainty block

### Items

Items is a single screen for confirmed entities.

Items screen groups:

- incomes
- expenses

Expected capabilities:

- tabs or segmented control
- filter and search
- create and edit actions

Current decision:

- keep Income and Expense on one shared screen for now
- they may be split later if the UI grows

### Obligations

Dedicated obligations screen.

Expected capabilities:

- list by state and relevance
- active obligations first
- overdue obligations visually noticeable
- resolve and cancel actions

This screen remains separate from Items because obligations belong to a different financial layer and require different UI behavior.

### Settings

Settings should stay lightweight.

Expected items:

- base currency
- profile
- auth account information
- PWA install hints if needed

Data sources:

- current user data
- settings data

MVP rule:

- use one Settings screen
- do not split Profile and Settings into separate navigation sections in the first version

---

## Page Structure

Recommended page pattern:

- top context block
- primary financial block
- secondary supporting blocks
- entity list or actionable section

Avoid:

- deeply nested dashboards
- too many cards with equal importance
- noisy charts by default

Charts are not required at this stage.

---

## Key UI Blocks

### Net Card

The most important block in the app.

It should be:

- visually strongest on the screen
- readable at a glance
- calm and trustworthy

### Confirmed Summary

Shows:

- total income
- total expense

This block supports the net card but should not compete with it.

### Possible Summary

Shows:

- possible receive
- possible pay

This block should be clearly separated from confirmed values.

### Range Block

Shows:

- min
- max

Range should be contextual and explanatory, not dominant.

### Obligation Groups

Obligations should support the month view with grouped context:

- matched
- overdue
- unscheduled

Matched and overdue items are part of contextual month uncertainty.
Unscheduled items are visible but separate.

---

## Screen Summary

The current frontend structure is:

- `Home`: overview screen with Month and Year modes
- `Items`: confirmed entity management with Income and Expense tabs
- `Obligations`: possible layer management and lifecycle actions
- `Settings`: account and base currency

This should be enough for the initial product version without introducing extra navigation depth.

---

## Form UX

Forms should be simple and mobile-friendly.

Recommended pattern:

- create and edit flows on dedicated pages
- resolve and small confirmations in dialogs, drawers, or bottom sheets

Form rules:

- keep visible inputs minimal
- reveal advanced fields progressively
- timing selection must feel obvious
- obligation expected timing should be clearly optional

---

## shadcn/ui Usage

shadcn/ui is the base UI toolkit, not the final visual identity.

Rules:

- use shadcn primitives as a foundation
- customize tokens and presentation to fit the visual direction
- do not ship default-generated aesthetics without adaptation

---

## Styling Approach

- Tailwind is the primary styling system
- global CSS stays small
- CSS variables define tokens
- repeated patterns become reusable app components
- component variants use `cva`

The goal is to avoid:

- extremely long inline Tailwind strings
- giant global stylesheet systems

---

## States

Every primary screen should account for:

- loading state
- empty state
- error state
- success feedback for mutations

Special cases:

- overdue obligations should remain visible
- approximate currency conversion should be communicated subtly

Empty state direction:

- use friendly copy instead of sterile technical text
- the first no-data screen may use a playful financial illustration
- empty states should encourage creating the first entity, not just explain absence

---

## PWA UX

The app should work well when installed on mobile.

PWA expectations:

- app-like shell feel
- safe area awareness
- bottom navigation comfort
- clean launch experience

Offline-first behavior is not a primary goal for the first version.
