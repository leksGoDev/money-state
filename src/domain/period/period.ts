import { monthNumbers, type MonthNumber, type MonthPeriod } from "@/domain/types/period";

export function isValidMonth(value: number): value is MonthNumber {
  return value >= 1 && value <= 12 && Number.isInteger(value);
}

export function assertValidMonth(value: number): asserts value is MonthNumber {
  if (!isValidMonth(value)) {
    throw new Error(`Invalid month ${value}. Expected month in 1..12.`);
  }
}

export function monthPeriodToIndex(period: MonthPeriod): number {
  return period.year * 12 + (period.month - 1);
}

export function comparePeriods(left: MonthPeriod, right: MonthPeriod): number {
  return monthPeriodToIndex(left) - monthPeriodToIndex(right);
}

export function isSamePeriod(left: MonthPeriod, right: MonthPeriod): boolean {
  return left.year === right.year && left.month === right.month;
}

export function isPeriodBefore(left: MonthPeriod, right: MonthPeriod): boolean {
  return comparePeriods(left, right) < 0;
}

export function isPeriodAfter(left: MonthPeriod, right: MonthPeriod): boolean {
  return comparePeriods(left, right) > 0;
}

export function periodFromParts(year: number, month: number): MonthPeriod {
  assertValidMonth(month);

  return {
    year,
    month,
  };
}

export function getMonthsOfYear(year: number): MonthPeriod[] {
  return monthNumbers.map((month) => periodFromParts(year, month));
}
