import { isObligationActiveInPeriod } from "@/domain/period/match";
import { roundMoney } from "@/domain/types/money";
import type { ObligationEntry } from "@/domain/types/obligation";
import type { MonthPeriod } from "@/domain/types/period";

export type PossibleTotals = {
  receive: number;
  pay: number;
};

export function calculatePossibleTotals(
  obligations: ReadonlyArray<ObligationEntry>,
): PossibleTotals {
  let receive = 0;
  let pay = 0;

  for (const obligation of obligations) {
    if (obligation.direction === "receive") {
      receive += obligation.amount;
      continue;
    }

    pay += obligation.amount;
  }

  return {
    receive: roundMoney(receive),
    pay: roundMoney(pay),
  };
}

export function calculateGlobalPossibleTotals(
  obligations: ReadonlyArray<ObligationEntry>,
  period: MonthPeriod,
): PossibleTotals {
  const active = obligations.filter((entry) =>
    isObligationActiveInPeriod(entry, period),
  );
  return calculatePossibleTotals(active);
}
