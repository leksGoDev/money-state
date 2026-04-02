import { describe, expect, it } from "vitest";

import { convertAmount } from "@/modules/exchange-rates/use-cases/convert-amount";

describe("convertAmount", () => {
  const context = {
    baseCurrency: "USD" as const,
    ratesDate: "2026-04-01",
    approximate: true,
    rates: new Map<string, number>([["EUR:USD", 1.2]]),
  };

  it("returns rounded source amount when currencies match", () => {
    const amount = convertAmount({ amount: 100.126, fromCurrency: "USD", context });
    expect(amount).toBe(100.13);
  });

  it("converts using cached rates when available", () => {
    const amount = convertAmount({ amount: 10, fromCurrency: "EUR", context });
    expect(amount).toBe(12);
  });

  it("returns null when conversion rate is missing", () => {
    const amount = convertAmount({ amount: 10, fromCurrency: "RUB", context });
    expect(amount).toBeNull();
  });
});
