import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/exchange-rates/repository", () => ({
  findLatestRatesSnapshot: vi.fn(),
}));

import { getConversionContext } from "@/modules/exchange-rates/use-cases/get-conversion-context";
import * as repository from "@/modules/exchange-rates/repository";

const mockRepo = vi.mocked(repository);

describe("getConversionContext", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns empty rates when cache snapshot is absent", async () => {
    mockRepo.findLatestRatesSnapshot.mockResolvedValue(null);

    const context = await getConversionContext("USD");

    expect(context.baseCurrency).toBe("USD");
    expect(context.ratesDate).toBeNull();
    expect(context.rates.size).toBe(0);
  });

  it("maps cached snapshot rates and serialized date", async () => {
    mockRepo.findLatestRatesSnapshot.mockResolvedValue({
      ratesDate: new Date("2026-04-01T00:00:00.000Z"),
      rates: [
        {
          fromCurrency: "EUR",
          toCurrency: "USD",
          rate: "1.2",
        },
      ],
    } as never);

    const context = await getConversionContext("USD");

    expect(context.ratesDate).toBe("2026-04-01");
    expect(context.rates.get("EUR:USD")).toBe(1.2);
  });
});
