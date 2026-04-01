import type { Prisma } from "@prisma/client";

import { matchesConfirmedTiming, periodFromParts } from "@/domain";
import { fromPrismaCurrency, toPrismaCurrency } from "@/modules/shared/enums";
import {
  toConfirmedDomainEntry,
  toConfirmedListItemDto,
} from "@/modules/shared/confirmed";
import { getUserCurrencyContext } from "@/modules/shared/user-currency";
import type { IncomeDto, IncomeRow, ListIncomesQuery } from "@/modules/incomes/types";

export function buildIncomesWhereClause(
  userId: string,
  query: ListIncomesQuery,
): Prisma.IncomeWhereInput {
  return {
    userId,
    categoryId: query.categoryId,
    currency: query.currency ? toPrismaCurrency(query.currency) : undefined,
    timingType: query.timingType ? (query.timingType.toUpperCase() as never) : undefined,
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

  return rows.map((row) => {
    const rate = currencyContext.conversion.rates.get(
      `${fromPrismaCurrency(row.currency)}:${currencyContext.baseCurrency}`,
    );

    const convertedAmount =
      row.currency === currencyContext.baseCurrency
        ? Number(row.amount)
        : rate == null
          ? null
          : Number(row.amount) * rate;

    return toConfirmedListItemDto({
      row,
      convertedAmount,
      baseCurrency: currencyContext.baseCurrency,
      ratesDate: currencyContext.conversion.ratesDate,
    });
  });
}
