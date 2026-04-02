import type { Prisma } from "@prisma/client";

import { matchesConfirmedTiming, periodFromParts } from "@/domain";
import {
  mapConfirmedRowsToListItemDto,
  toConfirmedDomainEntry,
  toPersistenceCurrency,
  toPersistenceTimingType,
} from "@/modules/confirmed/shared";
import { getUserCurrencyContext } from "@/modules/shared/user-currency";
import type { ExpenseDto, ExpenseRow, ListExpensesQuery } from "@/modules/confirmed/expense/types";

export function buildExpensesWhereClause(
  userId: string,
  query: ListExpensesQuery,
): Prisma.ExpenseWhereInput {
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

export function filterExpensesByActivePeriod(
  rows: ReadonlyArray<ExpenseRow>,
  query: ListExpensesQuery,
): ExpenseRow[] {
  if (query.activeInYear == null || query.activeInMonth == null) {
    return [...rows];
  }

  const period = periodFromParts(query.activeInYear, query.activeInMonth);
  return rows.filter((row) =>
    matchesConfirmedTiming(period, toConfirmedDomainEntry(row, "expense").timing),
  );
}

export async function mapExpenseRowsToDto(
  userId: string,
  rows: ReadonlyArray<ExpenseRow>,
): Promise<ExpenseDto[]> {
  const currencyContext = await getUserCurrencyContext(userId);
  return mapConfirmedRowsToListItemDto(rows, {
    baseCurrency: currencyContext.baseCurrency,
    ratesDate: currencyContext.conversion.ratesDate,
    rates: currencyContext.conversion.rates,
  });
}
