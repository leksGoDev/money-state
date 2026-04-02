import type { Currency } from "@/domain/types/money";
import { findLatestRatesSnapshot } from "@/modules/exchange-rates/repository";
import { mapSnapshotRatesToMap, serializeRatesDate } from "@/modules/exchange-rates/mappers";
import type { ConversionContext } from "@/modules/exchange-rates/types";

export async function getConversionContext(
  baseCurrency: Currency,
): Promise<ConversionContext> {
  const latestSnapshot = await findLatestRatesSnapshot();
  const rates = latestSnapshot
    ? mapSnapshotRatesToMap(latestSnapshot.rates)
    : new Map<string, number>();

  return {
    baseCurrency,
    ratesDate: serializeRatesDate(latestSnapshot?.ratesDate ?? null),
    approximate: true,
    rates,
  };
}
