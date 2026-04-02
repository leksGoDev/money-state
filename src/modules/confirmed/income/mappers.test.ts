import { describe, expect, it } from "vitest";

import { buildIncomesWhereClause, filterIncomesByActivePeriod } from "@/modules/confirmed/income/mappers";
import type { IncomeRow, ListIncomesQuery } from "@/modules/confirmed/income/types";

function buildConfirmedRow(overrides: Partial<IncomeRow>): IncomeRow {
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

describe("income mappers", () => {
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

    const incomes = filterIncomesByActivePeriod(rows, {
      activeInYear: 2026,
      activeInMonth: 4,
    });

    expect(incomes.map((row) => row.id)).toEqual(["single", "monthly", "yearly"]);
  });

  it("returns unfiltered rows when active period query is missing", () => {
    const rows = [buildConfirmedRow({ id: "a" }), buildConfirmedRow({ id: "b" })];

    const result = filterIncomesByActivePeriod(rows, {} as ListIncomesQuery);
    expect(result).toHaveLength(2);
  });

  it("always scopes where clause by userId", () => {
    const where = buildIncomesWhereClause("user_1", {});
    expect(where.userId).toBe("user_1");
  });
});
