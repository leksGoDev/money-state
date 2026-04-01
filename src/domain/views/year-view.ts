import { getMonthsOfYear } from "@/domain/period/period";
import { buildMonthViewSummary, type MonthViewSummary } from "@/domain/views/month-view";
import { roundMoney } from "@/domain/types/money";
import type { ConfirmedEntry } from "@/domain/types/confirmed";
import type { ObligationEntry } from "@/domain/types/obligation";

export type YearViewSummary = {
  year: number;
  summary: {
    confirmed: {
      income: number;
      expense: number;
      net: number;
    };
  };
  months: MonthViewSummary[];
};

export function buildYearViewSummary(params: {
  year: number;
  expectedWindow: number;
  confirmedEntries: ReadonlyArray<ConfirmedEntry>;
  obligations: ReadonlyArray<ObligationEntry>;
}): YearViewSummary {
  const months = getMonthsOfYear(params.year).map((period) =>
    buildMonthViewSummary({
      period,
      expectedWindow: params.expectedWindow,
      confirmedEntries: params.confirmedEntries,
      obligations: params.obligations,
    }),
  );

  const summary = months.reduce(
    (accumulator, month) => {
      accumulator.confirmed.income += month.confirmed.income;
      accumulator.confirmed.expense += month.confirmed.expense;
      accumulator.confirmed.net += month.confirmed.net;
      return accumulator;
    },
    {
      confirmed: { income: 0, expense: 0, net: 0 },
    },
  );

  return {
    year: params.year,
    summary: {
      confirmed: {
        income: roundMoney(summary.confirmed.income),
        expense: roundMoney(summary.confirmed.expense),
        net: roundMoney(summary.confirmed.net),
      },
    },
    months,
  };
}
