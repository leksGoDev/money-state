import { comparePeriods, periodFromParts } from "@/domain/period/period";
import type { ConfirmedTiming } from "@/domain/types/confirmed";
import type { ObligationEntry } from "@/domain/types/obligation";
import type { MonthPeriod } from "@/domain/types/period";

function toOptionalPeriod(year?: number | null, month?: number | null): MonthPeriod | null {
  if (year == null || month == null) {
    return null;
  }

  return periodFromParts(year, month);
}

export function matchesConfirmedTiming(
  period: MonthPeriod,
  timing: ConfirmedTiming,
): boolean {
  if (timing.timingType === "single") {
    return period.year === timing.year && period.month === timing.month;
  }

  if (timing.timingType === "monthly") {
    const start = periodFromParts(timing.startYear, timing.startMonth);
    const end = toOptionalPeriod(timing.endYear, timing.endMonth);

    const isAfterStart = comparePeriods(period, start) >= 0;
    const isBeforeEnd = end ? comparePeriods(period, end) <= 0 : true;
    return isAfterStart && isBeforeEnd;
  }

  const yearIsActive =
    period.year >= timing.startYear &&
    (timing.endYear == null || period.year <= timing.endYear);

  return yearIsActive && period.month === timing.month;
}

export function isObligationActiveInPeriod(
  obligation: ObligationEntry,
  period: MonthPeriod,
): boolean {
  const startsAt = periodFromParts(obligation.activeFromYear, obligation.activeFromMonth);
  const startsBeforeOrEqual = comparePeriods(period, startsAt) >= 0;

  if (!startsBeforeOrEqual) {
    return false;
  }

  if (obligation.status === "active") {
    return true;
  }

  const resolvedAt = toOptionalPeriod(obligation.resolvedYear, obligation.resolvedMonth);

  if (!resolvedAt) {
    return false;
  }

  return comparePeriods(period, resolvedAt) < 0;
}

export function isOverdueObligation(
  obligation: ObligationEntry,
  period: MonthPeriod,
): boolean {
  if (
    !isObligationActiveInPeriod(obligation, period) ||
    obligation.expectedYear == null ||
    obligation.expectedMonth == null
  ) {
    return false;
  }

  const expectedAt = periodFromParts(obligation.expectedYear, obligation.expectedMonth);
  return comparePeriods(expectedAt, period) < 0;
}

export function monthDistance(left: MonthPeriod, right: MonthPeriod): number {
  return Math.abs(comparePeriods(left, right));
}
