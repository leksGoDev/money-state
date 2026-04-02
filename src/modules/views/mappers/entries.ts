import type { Expense, Income, Obligation } from "@prisma/client";

import {
  type ConfirmedEntry,
  type Currency,
  type MonthNumber,
  type ObligationEntry,
} from "@/domain";
import { matchesConfirmedTiming, periodFromParts } from "@/domain";
import { convertAmount, type ConversionContext } from "@/modules/exchange-rates";
import { fromPrismaCurrency } from "@/modules/shared/enums";

export function toMonthNumber(value: number): MonthNumber {
  return value as MonthNumber;
}

function toAggregateAmount(params: {
  amount: number;
  currency: Currency;
  conversionContext: ConversionContext;
}): number {
  const converted = convertAmount({
    amount: params.amount,
    fromCurrency: params.currency,
    context: params.conversionContext,
  });

  return converted ?? params.amount;
}

function toConfirmedTiming(
  row: Income | Expense,
  fallbackYear: number,
  fallbackMonth: number,
) {
  if (row.timingType === "SINGLE") {
    return {
      timingType: "single" as const,
      year: row.singleYear ?? fallbackYear,
      month: toMonthNumber(row.singleMonth ?? fallbackMonth),
    };
  }

  if (row.timingType === "MONTHLY") {
    return {
      timingType: "monthly" as const,
      startYear: row.monthlyStartYear ?? fallbackYear,
      startMonth: toMonthNumber(row.monthlyStartMonth ?? fallbackMonth),
      endYear: row.monthlyEndYear,
      endMonth:
        row.monthlyEndMonth == null ? null : toMonthNumber(row.monthlyEndMonth),
    };
  }

  return {
    timingType: "yearly" as const,
    month: toMonthNumber(row.yearlyMonth ?? fallbackMonth),
    startYear: row.yearlyStartYear ?? fallbackYear,
    endYear: row.yearlyEndYear,
  };
}

function toConfirmedEntry(params: {
  row: Income | Expense;
  kind: "income" | "expense";
  fallbackYear: number;
  fallbackMonth: number;
  conversionContext: ConversionContext;
}): ConfirmedEntry {
  return {
    id: params.row.id,
    kind: params.kind,
    amount: toAggregateAmount({
      amount: Number(params.row.amount),
      currency: fromPrismaCurrency(params.row.currency),
      conversionContext: params.conversionContext,
    }),
    timing: toConfirmedTiming(params.row, params.fallbackYear, params.fallbackMonth),
  };
}

function toObligationEntry(
  row: Obligation,
  conversionContext: ConversionContext,
): ObligationEntry {
  return {
    id: row.id,
    title: row.title,
    amount: toAggregateAmount({
      amount: Number(row.amount),
      currency: fromPrismaCurrency(row.currency),
      conversionContext,
    }),
    direction: row.direction === "PAY" ? "pay" : "receive",
    status:
      row.status === "ACTIVE" ? "active" : row.status === "DONE" ? "done" : "canceled",
    activeFromYear: row.activeFromYear,
    activeFromMonth: toMonthNumber(row.activeFromMonth),
    expectedYear: row.expectedYear,
    expectedMonth:
      row.expectedMonth == null ? null : toMonthNumber(row.expectedMonth),
    resolvedYear: row.resolvedYear,
    resolvedMonth:
      row.resolvedMonth == null ? null : toMonthNumber(row.resolvedMonth),
  };
}

export function buildConfirmedEntries(params: {
  incomes: Income[];
  expenses: Expense[];
  fallbackYear: number;
  fallbackMonth: number;
  conversionContext: ConversionContext;
}): ConfirmedEntry[] {
  return [
    ...params.incomes.map((row) =>
      toConfirmedEntry({
        row,
        kind: "income",
        fallbackYear: params.fallbackYear,
        fallbackMonth: params.fallbackMonth,
        conversionContext: params.conversionContext,
      }),
    ),
    ...params.expenses.map((row) =>
      toConfirmedEntry({
        row,
        kind: "expense",
        fallbackYear: params.fallbackYear,
        fallbackMonth: params.fallbackMonth,
        conversionContext: params.conversionContext,
      }),
    ),
  ];
}

export function buildObligationEntries(
  obligations: Obligation[],
  conversionContext: ConversionContext,
): ObligationEntry[] {
  return obligations.map((row) => toObligationEntry(row, conversionContext));
}

export function filterConfirmedByPeriod(
  entries: ReadonlyArray<ConfirmedEntry>,
  params: { year: number; month: number },
): ConfirmedEntry[] {
  const period = periodFromParts(params.year, params.month);
  return entries.filter((entry) => matchesConfirmedTiming(period, entry.timing));
}
