import type { Currency } from "@/domain/types/money";
import {
  buildMatrixRatesFromFrankfurter,
  parseFrankfurterDate,
} from "@/modules/exchange-rates/mappers";
import { upsertRatesSnapshot } from "@/modules/exchange-rates/repository";
import { buildFrankfurterLatestUrl } from "@/modules/exchange-rates/endpoints";
import { ratesSourceBaseCurrency } from "@/modules/exchange-rates/constants";
import type { FrankfurterLatestResponse } from "@/modules/exchange-rates/types";

export async function refreshLatestExchangeRates(): Promise<{
  ratesDate: string;
  baseCurrency: Currency;
  count: number;
}> {
  const response = await fetch(buildFrankfurterLatestUrl(), {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Frankfurter request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as FrankfurterLatestResponse;
  const ratesDate = parseFrankfurterDate(payload.date);
  const rates = buildMatrixRatesFromFrankfurter(payload);

  await upsertRatesSnapshot({
    ratesDate,
    rates,
  });

  return {
    ratesDate: payload.date,
    baseCurrency: ratesSourceBaseCurrency,
    count: rates.length,
  };
}
