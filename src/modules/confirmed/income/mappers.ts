import type { Prisma } from "@prisma/client";

import { matchesConfirmedTiming, periodFromParts } from "@/domain";
import {
  mapConfirmedRowsToListItemDto,
  toConfirmedDomainEntry,
  toPersistenceCurrency,
  toPersistenceTimingType,
} from "@/modules/confirmed/shared";
import { getUserCurrencyContext } from "@/modules/shared/user-currency";
import type { IncomeDto, IncomeRow, ListIncomesQuery } from "@/modules/confirmed/income/types";

export function buildIncomesWhereClause(
  userId: string,
  query: ListIncomesQuery,
): Prisma.IncomeWhereInput {
  return {
    userId,
    categoryId: query.categoryId,
    currency: query.currency ? toPersistenceCurrency(query.currency) : undefined,
    timingType: query.timingType
      ? toPersistenceTimingType(query.timingType)
      : undefined,
    title: query.search
      ? {
          contains: query.search,
          mode: "insensitive",
        }
      : undefined,
  };
}

export function filterIncomesByActivePeriod(
  rows: ReadonlyArray<IncomeRow>,
  query: ListIncomesQuery,
): IncomeRow[] {
  if (query.activeInYear == null || query.activeInMonth == null) {
    return [...rows];
  }

  const period = periodFromParts(query.activeInYear, query.activeInMonth);
  return rows.filter((row) =>
    matchesConfirmedTiming(period, toConfirmedDomainEntry(row, "income").timing),
  );
}

export async function mapIncomeRowsToDto(
  userId: string,
  rows: ReadonlyArray<IncomeRow>,
): Promise<IncomeDto[]> {
  const currencyContext = await getUserCurrencyContext(userId);
  return mapConfirmedRowsToListItemDto(rows, {
    baseCurrency: currencyContext.baseCurrency,
    ratesDate: currencyContext.conversion.ratesDate,
    rates: currencyContext.conversion.rates,
  });
}
