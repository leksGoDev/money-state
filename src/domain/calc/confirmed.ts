import { matchesConfirmedTiming } from "@/domain/period/match";
import { roundMoney } from "@/domain/types/money";
import type { ConfirmedEntry } from "@/domain/types/confirmed";
import type { MonthPeriod } from "@/domain/types/period";

export type ConfirmedTotals = {
  income: number;
  expense: number;
  net: number;
};

export function calculateNet(income: number, expense: number): number {
  return roundMoney(income - expense);
}

export function calculateConfirmedTotals(
  entries: ReadonlyArray<ConfirmedEntry>,
  period: MonthPeriod,
): ConfirmedTotals {
  let income = 0;
  let expense = 0;

  for (const entry of entries) {
    if (!matchesConfirmedTiming(period, entry.timing)) {
      continue;
    }

    if (entry.kind === "income") {
      income += entry.amount;
      continue;
    }

    expense += entry.amount;
  }

  const roundedIncome = roundMoney(income);
  const roundedExpense = roundMoney(expense);

  return {
    income: roundedIncome,
    expense: roundedExpense,
    net: calculateNet(roundedIncome, roundedExpense),
  };
}
