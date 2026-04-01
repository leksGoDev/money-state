import { calculateConfirmedTotals } from "@/domain/calc/confirmed";
import { calculatePossibleTotals } from "@/domain/calc/possible";
import { calculateRange } from "@/domain/calc/range";
import { groupObligationsForMonth } from "@/domain/obligations/group";
import type { ConfirmedEntry } from "@/domain/types/confirmed";
import type { ObligationEntry } from "@/domain/types/obligation";
import type { MonthPeriod } from "@/domain/types/period";

export type MonthViewSummary = {
  period: MonthPeriod;
  confirmed: {
    income: number;
    expense: number;
    net: number;
  };
  possible: {
    receive: number;
    pay: number;
  };
  range: {
    min: number;
    max: number;
  };
  obligations: {
    matched: ObligationEntry[];
    overdue: ObligationEntry[];
    unscheduled: ObligationEntry[];
  };
};

export function buildMonthViewSummary(params: {
  period: MonthPeriod;
  expectedWindow: number;
  confirmedEntries: ReadonlyArray<ConfirmedEntry>;
  obligations: ReadonlyArray<ObligationEntry>;
}): MonthViewSummary {
  const { period, expectedWindow, confirmedEntries, obligations } = params;
  const confirmed = calculateConfirmedTotals(confirmedEntries, period);
  const grouped = groupObligationsForMonth(obligations, period, expectedWindow);
  const possibleContributors = [...grouped.matched, ...grouped.overdue];
  const possible = calculatePossibleTotals(possibleContributors);
  const range = calculateRange(confirmed.net, possible.pay, possible.receive);

  return {
    period,
    confirmed,
    possible,
    range,
    obligations: grouped,
  };
}
