import type { Prisma } from "@prisma/client";

import { isObligationActiveInPeriod, periodFromParts } from "@/domain";
import type { ObligationEntry } from "@/domain/types/obligation";
import { moneyToString, type Currency } from "@/domain/types/money";
import type { MonthNumber } from "@/domain/types/period";
import {
  fromPrismaCurrency,
  fromPrismaObligationDirection,
  fromPrismaObligationStatus,
  toPrismaCurrency,
  toPrismaObligationDirection,
  toPrismaObligationStatus,
} from "@/modules/shared/repository-enums";
import { getUserCurrencyContext } from "@/modules/shared/currency-context";
import type {
  ListObligationsQuery,
  ObligationDto,
  ObligationInput,
  ObligationRow,
} from "@/modules/obligations/types";

export function buildObligationsWhereClause(
  userId: string,
  query: ListObligationsQuery,
): Prisma.ObligationWhereInput {
  return {
    userId,
    title: query.search
      ? {
          contains: query.search,
          mode: "insensitive" as const,
        }
      : undefined,
    status: query.status ? toPrismaObligationStatus(query.status) : undefined,
    direction: query.direction
      ? toPrismaObligationDirection(query.direction)
      : undefined,
    categoryId: query.categoryId,
    currency: query.currency ? toPrismaCurrency(query.currency) : undefined,
    expectedYear: query.expectedYear,
    expectedMonth: query.expectedMonth,
    AND:
      query.hasExpectedPeriod == null
        ? undefined
        : query.hasExpectedPeriod
          ? [{ expectedYear: { not: null } }, { expectedMonth: { not: null } }]
          : [{ OR: [{ expectedYear: null }, { expectedMonth: null }] }],
  };
}

export function filterObligationsByActivePeriod(
  rows: ReadonlyArray<ObligationRow>,
  query: ListObligationsQuery,
): ObligationRow[] {
  if (query.activeInYear == null || query.activeInMonth == null) {
    return [...rows];
  }

  const period = periodFromParts(query.activeInYear, query.activeInMonth);
  return rows.filter((row) =>
    isObligationActiveInPeriod(toObligationDomainEntry(row), period),
  );
}

export async function mapObligationRowsToDto(
  userId: string,
  rows: ReadonlyArray<ObligationRow>,
) {
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

    return toObligationDto({
      row,
      convertedAmount,
      baseCurrency: currencyContext.baseCurrency,
      ratesDate: currencyContext.conversion.ratesDate,
    });
  });
}

export function toObligationDomainEntry(row: ObligationRow): ObligationEntry {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    direction: fromPrismaObligationDirection(row.direction),
    status: fromPrismaObligationStatus(row.status),
    activeFromYear: row.activeFromYear,
    activeFromMonth: row.activeFromMonth as MonthNumber,
    expectedYear: row.expectedYear,
    expectedMonth: row.expectedMonth as MonthNumber | null,
    resolvedYear: row.resolvedYear,
    resolvedMonth: row.resolvedMonth as MonthNumber | null,
  };
}

export function toObligationDto(params: {
  row: ObligationRow;
  convertedAmount: number | null;
  baseCurrency: Currency;
  ratesDate: string | null;
}): ObligationDto {
  return {
    id: params.row.id,
    title: params.row.title,
    amount: moneyToString(Number(params.row.amount)),
    currency: fromPrismaCurrency(params.row.currency),
    convertedAmount:
      params.convertedAmount == null ? null : moneyToString(params.convertedAmount),
    baseCurrency: params.baseCurrency,
    ratesDate: params.ratesDate,
    direction: fromPrismaObligationDirection(params.row.direction),
    status: fromPrismaObligationStatus(params.row.status),
    activeFromYear: params.row.activeFromYear,
    activeFromMonth: params.row.activeFromMonth,
    expectedYear: params.row.expectedYear,
    expectedMonth: params.row.expectedMonth,
    resolvedYear: params.row.resolvedYear,
    resolvedMonth: params.row.resolvedMonth,
    categoryId: params.row.categoryId,
    notes: params.row.notes,
    createdAt: params.row.createdAt.toISOString(),
    updatedAt: params.row.updatedAt.toISOString(),
  };
}

export function toObligationCreateData(input: ObligationInput) {
  return {
    title: input.title,
    amount: input.amount,
    currency: toPrismaCurrency(input.currency),
    direction: toPrismaObligationDirection(input.direction),
    activeFromYear: input.activeFromYear,
    activeFromMonth: input.activeFromMonth,
    expectedYear: input.expectedYear ?? null,
    expectedMonth: input.expectedMonth ?? null,
    categoryId: input.categoryId ?? null,
    notes: input.notes ?? null,
    status: toPrismaObligationStatus("active"),
    resolvedYear: null,
    resolvedMonth: null,
  };
}
