import { Currency, Prisma, TimingType, type Income } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buildConfirmedEntries } from "@/modules/views/mappers/entries";

function buildIncomeRow(overrides: Partial<Income> = {}): Income {
  return {
    id: "income_1",
    userId: "user_1",
    title: "Income",
    amount: new Prisma.Decimal(100),
    currency: Currency.USD,
    categoryId: null,
    notes: null,
    timingType: TimingType.SINGLE,
    singleYear: 2026,
    singleMonth: 4,
    monthlyStartYear: null,
    monthlyStartMonth: null,
    monthlyEndYear: null,
    monthlyEndMonth: null,
    yearlyMonth: null,
    yearlyStartYear: null,
    yearlyEndYear: null,
    sourceObligationId: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("buildConfirmedEntries", () => {
  it("throws when exchange rate is missing for aggregate currency conversion", () => {
    const context = {
      baseCurrency: "EUR" as const,
      ratesDate: "2026-04-01",
      approximate: true,
      rates: new Map<string, number>(),
    };

    expect(() =>
      buildConfirmedEntries({
        incomes: [buildIncomeRow({ currency: Currency.USD })],
        expenses: [],
        fallbackYear: 2026,
        fallbackMonth: 4,
        conversionContext: context,
      }),
    ).toThrowError("Missing exchange rate for USD->EUR.");
  });

  it("uses converted amount instead of raw amount in aggregates", () => {
    const context = {
      baseCurrency: "EUR" as const,
      ratesDate: "2026-04-01",
      approximate: true,
      rates: new Map<string, number>([["USD:EUR", 2]]),
    };

    const entries = buildConfirmedEntries({
      incomes: [buildIncomeRow({ currency: Currency.USD })],
      expenses: [],
      fallbackYear: 2026,
      fallbackMonth: 4,
      conversionContext: context,
    });

    expect(entries[0]?.amount).toBe(200);
  });
});
