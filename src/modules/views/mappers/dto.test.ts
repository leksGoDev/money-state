import { ObligationDirection, ObligationStatus, Prisma, type Obligation } from "@prisma/client";
import { describe, expect, it } from "vitest";

import { buildMonthViewDto, buildYearViewDto } from "@/modules/views/mappers/dto";

function buildObligationRow(overrides: Partial<Obligation> = {}): Obligation {
  return {
    id: "ob_1",
    title: "Potential payment",
    amount: new Prisma.Decimal(300),
    currency: "USD",
    direction: ObligationDirection.PAY,
    status: ObligationStatus.ACTIVE,
    activeFromYear: 2026,
    activeFromMonth: 1,
    expectedYear: 2026,
    expectedMonth: 4,
    resolvedYear: null,
    resolvedMonth: null,
    categoryId: null,
    notes: null,
    userId: "user_1",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("view DTO mappers", () => {
  const currencyContext = {
    baseCurrency: "USD" as const,
    conversion: {
      baseCurrency: "USD" as const,
      ratesDate: "2026-04-01",
      approximate: true,
      rates: new Map<string, number>(),
    },
  };

  it("keeps year top summary confirmed-only and leaves possible/range in months", () => {
    const dto = buildYearViewDto({
      year: 2026,
      expectedWindow: 1,
      currencyContext,
      confirmedEntries: [
        {
          id: "income_1",
          kind: "income",
          amount: 1000,
          timing: { timingType: "single", year: 2026, month: 1 },
        },
      ],
      obligationEntries: [
        {
          id: "ob_1",
          title: "Potential payment",
          amount: 300,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 1,
          resolvedYear: null,
          resolvedMonth: null,
        },
      ],
    });

    expect(dto.summary.confirmed.net).toBe("1000.00");
    expect("possible" in dto.summary).toBe(false);
    expect(dto.months[0].possible.pay).toBe("300.00");
  });

  it("keeps net independent from obligations in month dto", () => {
    const dto = buildMonthViewDto({
      year: 2026,
      month: 4,
      expectedWindow: 1,
      currencyContext,
      confirmedEntries: [
        {
          id: "income_1",
          kind: "income",
          amount: 1000,
          timing: { timingType: "single", year: 2026, month: 4 },
        },
        {
          id: "expense_1",
          kind: "expense",
          amount: 400,
          timing: { timingType: "single", year: 2026, month: 4 },
        },
      ],
      obligationEntries: [
        {
          id: "ob_1",
          title: "Potential payment",
          amount: 300,
          direction: "pay",
          status: "active",
          activeFromYear: 2026,
          activeFromMonth: 1,
          expectedYear: 2026,
          expectedMonth: 4,
          resolvedYear: null,
          resolvedMonth: null,
        },
      ],
      obligationRows: [buildObligationRow()],
    });

    expect(dto.confirmed.net).toBe("600.00");
    expect(dto.possible.pay).toBe("300.00");
    expect(dto.range.min).toBe("300.00");
    expect(dto.obligations.matched).toHaveLength(1);
  });
});
