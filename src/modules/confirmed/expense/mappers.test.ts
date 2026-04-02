import { describe, expect, it } from "vitest";

import { buildExpensesWhereClause, filterExpensesByActivePeriod } from "@/modules/confirmed/expense/mappers";
import type { ExpenseRow } from "@/modules/confirmed/expense/types";

function buildConfirmedRow(overrides: Partial<ExpenseRow>): ExpenseRow {
  return {
    id: "row_1",
    title: "Item",
    amount: 100,
    currency: "USD",
    timingType: "single",
    singleYear: 2026,
    singleMonth: 4,
    monthlyStartYear: null,
    monthlyStartMonth: null,
    monthlyEndYear: null,
    monthlyEndMonth: null,
    yearlyMonth: null,
    yearlyStartYear: null,
    yearlyEndYear: null,
    categoryId: null,
    notes: null,
    sourceObligationId: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("expense mappers", () => {
  it("filters active period across single/monthly/yearly timings", () => {
    const rows = [
      buildConfirmedRow({ id: "single", timingType: "single", singleYear: 2026, singleMonth: 4 }),
      buildConfirmedRow({
        id: "monthly",
        timingType: "monthly",
        singleYear: null,
        singleMonth: null,
        monthlyStartYear: 2026,
        monthlyStartMonth: 2,
        monthlyEndYear: 2026,
        monthlyEndMonth: 5,
      }),
      buildConfirmedRow({
        id: "yearly",
        timingType: "yearly",
        singleYear: null,
        singleMonth: null,
        yearlyMonth: 4,
        yearlyStartYear: 2025,
        yearlyEndYear: null,
      }),
    ];

    const expenses = filterExpensesByActivePeriod(rows, {
      activeInYear: 2026,
      activeInMonth: 4,
    });

    expect(expenses.map((row) => row.id)).toEqual(["single", "monthly", "yearly"]);
  });

  it("always scopes where clause by userId", () => {
    const where = buildExpensesWhereClause("user_1", {});
    expect(where.userId).toBe("user_1");
  });
});
