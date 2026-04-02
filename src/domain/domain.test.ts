import { describe, expect, it } from "vitest";

import {
  buildMonthViewSummary,
  buildYearViewSummary,
  calculateConfirmedTotals,
  calculateRange,
  isObligationActiveInPeriod,
  matchesConfirmedTiming,
  periodFromParts,
} from "@/domain";

describe("domain timing rules", () => {
  it("matches yearly items only in configured month", () => {
    const timing = {
      timingType: "yearly" as const,
      month: 4 as const,
      startYear: 2026,
    };

    expect(matchesConfirmedTiming({ year: 2026, month: 4 }, timing)).toBe(true);
    expect(matchesConfirmedTiming({ year: 2026, month: 5 }, timing)).toBe(false);
  });

  it("treats obligations inactive starting from resolved month", () => {
    const obligation = {
      id: "o1",
      title: "Loan",
      amount: 100,
      direction: "pay" as const,
      status: "done" as const,
      activeFromYear: 2026,
      activeFromMonth: 1 as const,
      resolvedYear: 2026,
      resolvedMonth: 4 as const,
    };

    expect(isObligationActiveInPeriod(obligation, { year: 2026, month: 3 })).toBe(
      true,
    );
    expect(isObligationActiveInPeriod(obligation, { year: 2026, month: 4 })).toBe(
      false,
    );
  });

  it("matches monthly timing on both boundaries", () => {
    const timing = {
      timingType: "monthly" as const,
      startYear: 2026,
      startMonth: 2 as const,
      endYear: 2026,
      endMonth: 5 as const,
    };

    expect(matchesConfirmedTiming({ year: 2026, month: 1 }, timing)).toBe(false);
    expect(matchesConfirmedTiming({ year: 2026, month: 2 }, timing)).toBe(true);
    expect(matchesConfirmedTiming({ year: 2026, month: 5 }, timing)).toBe(true);
    expect(matchesConfirmedTiming({ year: 2026, month: 6 }, timing)).toBe(false);
  });

  it("throws for invalid month values", () => {
    expect(() => periodFromParts(2026, 0)).toThrow("Expected month in 1..12");
    expect(() => periodFromParts(2026, 13)).toThrow("Expected month in 1..12");
  });
});

describe("financial layer separation", () => {
  it("keeps net independent from obligations", () => {
    const confirmedTotals = calculateConfirmedTotals(
      [
        {
          id: "i1",
          kind: "income",
          amount: 1000,
          timing: { timingType: "single", year: 2026, month: 4 },
        },
        {
          id: "e1",
          kind: "expense",
          amount: 400,
          timing: { timingType: "single", year: 2026, month: 4 },
        },
      ],
      { year: 2026, month: 4 },
    );

    const range = calculateRange(confirmedTotals.net, 300, 700);

    expect(confirmedTotals.net).toBe(600);
    expect(range.min).toBe(300);
    expect(range.max).toBe(1300);
  });
});

describe("month view obligation grouping", () => {
  it("groups matched overdue and unscheduled correctly", () => {
    const summary = buildMonthViewSummary({
      period: { year: 2026, month: 4 },
      expectedWindow: 1,
      confirmedEntries: [],
      obligations: [
        {
          id: "matched",
          title: "Matched",
          amount: 120,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 4,
        },
        {
          id: "overdue",
          title: "Overdue",
          amount: 80,
          direction: "receive",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 3,
        },
        {
          id: "unscheduled",
          title: "Unscheduled",
          amount: 50,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
        },
      ],
    });

    expect(summary.obligations.matched).toHaveLength(1);
    expect(summary.obligations.overdue).toHaveLength(1);
    expect(summary.obligations.unscheduled).toHaveLength(1);
    expect(summary.possible.pay).toBe(120);
    expect(summary.possible.receive).toBe(80);
  });

  it("keeps expectedWindow zero strictly on selected month", () => {
    const summary = buildMonthViewSummary({
      period: { year: 2026, month: 4 },
      expectedWindow: 0,
      confirmedEntries: [],
      obligations: [
        {
          id: "same-month",
          title: "Same month",
          amount: 100,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 4,
        },
        {
          id: "next-month",
          title: "Next month",
          amount: 100,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 5,
        },
      ],
    });

    expect(summary.obligations.matched.map((item) => item.id)).toEqual(["same-month"]);
    expect(summary.obligations.overdue).toHaveLength(0);
    expect(summary.obligations.unscheduled).toHaveLength(0);
  });
});

describe("year view summary", () => {
  it("contains only confirmed totals in top-level summary", () => {
    const yearView = buildYearViewSummary({
      year: 2026,
      expectedWindow: 1,
      confirmedEntries: [
        {
          id: "income-single",
          kind: "income",
          amount: 1000,
          timing: { timingType: "single", year: 2026, month: 1 },
        },
        {
          id: "expense-single",
          kind: "expense",
          amount: 400,
          timing: { timingType: "single", year: 2026, month: 1 },
        },
      ],
      obligations: [
        {
          id: "ob-1",
          title: "Potential payment",
          amount: 700,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 6,
        },
      ],
    });

    expect(yearView.summary.confirmed.income).toBe(1000);
    expect(yearView.summary.confirmed.expense).toBe(400);
    expect(yearView.summary.confirmed.net).toBe(600);
  });
});
