import { assertValidMonth } from "@/domain";
import type { ConfirmedEntry, ConfirmedTiming } from "@/domain/types/confirmed";
import type { MonthNumber } from "@/domain/types/period";
import type { ConfirmedSharedRow } from "@/modules/confirmed/shared/types";

function requireYear(value: number | null, field: string): number {
  if (value == null) {
    throw new Error(`Invalid confirmed row: missing ${field}.`);
  }

  return value;
}

function requireMonth(value: number | null, field: string): MonthNumber {
  if (value == null) {
    throw new Error(`Invalid confirmed row: missing ${field}.`);
  }

  assertValidMonth(value);
  return value;
}

function rowToTiming(row: ConfirmedSharedRow): ConfirmedTiming {
  const timingType = row.timingType;

  if (timingType === "single") {
    return {
      timingType: "single",
      year: requireYear(row.singleYear, "singleYear"),
      month: requireMonth(row.singleMonth, "singleMonth"),
    };
  }

  if (timingType === "monthly") {
    const endMonth = row.monthlyEndMonth;

    if (endMonth != null) {
      assertValidMonth(endMonth);
    }

    return {
      timingType: "monthly",
      startYear: requireYear(row.monthlyStartYear, "monthlyStartYear"),
      startMonth: requireMonth(row.monthlyStartMonth, "monthlyStartMonth"),
      endYear: row.monthlyEndYear,
      endMonth,
    };
  }

  return {
    timingType: "yearly",
    month: requireMonth(row.yearlyMonth, "yearlyMonth"),
    startYear: requireYear(row.yearlyStartYear, "yearlyStartYear"),
    endYear: row.yearlyEndYear,
  };
}

export function toConfirmedDomainEntry(
  row: ConfirmedSharedRow,
  kind: "income" | "expense",
): ConfirmedEntry {
  return {
    id: row.id,
    kind,
    amount: row.amount,
    timing: rowToTiming(row),
    title: row.title,
  };
}
