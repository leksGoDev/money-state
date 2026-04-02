import { Currency as PrismaCurrency } from "@prisma/client";

import type { Currency } from "@/domain/types/money";
import { fromPrismaCurrency, toPrismaCurrency } from "@/modules/shared/enums";
import { supportedCurrencies } from "@/modules/exchange-rates/constants";
import type { FrankfurterLatestResponse, RatesMap } from "@/modules/exchange-rates/types";

export function rateKey(from: Currency, to: Currency): string {
  return `${from}:${to}`;
}

export function serializeRatesDate(date: Date | null): string | null {
  return date ? date.toISOString().slice(0, 10) : null;
}

export function parseFrankfurterDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

export function mapSnapshotRatesToMap(
  rates: Array<{
    fromCurrency: PrismaCurrency;
    toCurrency: PrismaCurrency;
    rate: unknown;
  }>,
): RatesMap {
  const map: RatesMap = new Map();

  for (const row of rates) {
    map.set(
      rateKey(fromPrismaCurrency(row.fromCurrency), fromPrismaCurrency(row.toCurrency)),
      Number(row.rate),
    );
  }

  return map;
}

export function buildMatrixRatesFromFrankfurter(
  payload: FrankfurterLatestResponse,
) {
  const ratesWithBase: Record<Currency, number> = {
    EUR: 1,
    USD: payload.rates.USD,
    RUB: payload.rates.RUB,
    CNY: payload.rates.CNY,
  };

  return supportedCurrencies.flatMap((fromCurrency) =>
    supportedCurrencies.map((toCurrency) => {
      const fromRate = ratesWithBase[fromCurrency];
      const toRate = ratesWithBase[toCurrency];
      const rate = toRate / fromRate;

      return {
        fromCurrency: toPrismaCurrency(fromCurrency),
        toCurrency: toPrismaCurrency(toCurrency),
        rate,
      };
    }),
  );
}
