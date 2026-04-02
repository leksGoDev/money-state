import type { Obligation } from "@prisma/client";

import {
  buildMonthViewSummary,
  buildYearViewSummary,
  moneyToString,
  type ConfirmedEntry,
  type Currency,
  type ObligationEntry,
} from "@/domain";
import { convertAmount, type ConversionContext } from "@/modules/exchange-rates";
import { toObligationDto } from "@/modules/obligations/mappers";
import type { ObligationDto } from "@/modules/obligations/types";
import { fromPrismaCurrency } from "@/modules/shared/enums";
import { toMonthNumber } from "@/modules/views/mappers/entries";

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function buildMonthViewDto(params: {
  year: number;
  month: number;
  expectedWindow: number;
  confirmedEntries: ConfirmedEntry[];
  obligationEntries: ObligationEntry[];
  obligationRows: Obligation[];
  currencyContext: {
    baseCurrency: Currency;
    conversion: ConversionContext;
  };
}) {
  const monthView = buildMonthViewSummary({
    period: {
      year: params.year,
      month: toMonthNumber(params.month),
    },
    expectedWindow: params.expectedWindow,
    confirmedEntries: params.confirmedEntries,
    obligations: params.obligationEntries,
  });

  const obligationDtos = params.obligationRows.map((row) => {
    const convertedAmount = convertAmount({
      amount: Number(row.amount),
      fromCurrency: fromPrismaCurrency(row.currency),
      context: params.currencyContext.conversion,
    });

    return toObligationDto({
      row,
      convertedAmount,
      baseCurrency: params.currencyContext.baseCurrency,
      ratesDate: params.currencyContext.conversion.ratesDate,
    });
  });

  const obligationMap = new Map<string, ObligationDto>(
    obligationDtos.map((item) => [item.id, item]),
  );

  return {
    period: monthView.period,
    currency: {
      baseCurrency: params.currencyContext.baseCurrency,
      ratesDate: params.currencyContext.conversion.ratesDate,
      approximate: true,
    },
    confirmed: {
      income: moneyToString(monthView.confirmed.income),
      expense: moneyToString(monthView.confirmed.expense),
      net: moneyToString(monthView.confirmed.net),
    },
    possible: {
      receive: moneyToString(monthView.possible.receive),
      pay: moneyToString(monthView.possible.pay),
    },
    range: {
      min: moneyToString(monthView.range.min),
      max: moneyToString(monthView.range.max),
    },
    obligations: {
      matched: monthView.obligations.matched
        .map((item) => obligationMap.get(item.id))
        .filter(isDefined),
      overdue: monthView.obligations.overdue
        .map((item) => obligationMap.get(item.id))
        .filter(isDefined),
      unscheduled: monthView.obligations.unscheduled
        .map((item) => obligationMap.get(item.id))
        .filter(isDefined),
    },
  };
}

export function buildYearViewDto(params: {
  year: number;
  expectedWindow: number;
  confirmedEntries: ConfirmedEntry[];
  obligationEntries: ObligationEntry[];
  currencyContext: {
    baseCurrency: Currency;
    conversion: ConversionContext;
  };
}) {
  const yearView = buildYearViewSummary({
    year: params.year,
    expectedWindow: params.expectedWindow,
    confirmedEntries: params.confirmedEntries,
    obligations: params.obligationEntries,
  });

  return {
    year: params.year,
    currency: {
      baseCurrency: params.currencyContext.baseCurrency,
      ratesDate: params.currencyContext.conversion.ratesDate,
      approximate: true,
    },
    summary: {
      confirmed: {
        income: moneyToString(yearView.summary.confirmed.income),
        expense: moneyToString(yearView.summary.confirmed.expense),
        net: moneyToString(yearView.summary.confirmed.net),
      },
    },
    months: yearView.months.map((month) => ({
      period: month.period,
      confirmed: {
        income: moneyToString(month.confirmed.income),
        expense: moneyToString(month.confirmed.expense),
        net: moneyToString(month.confirmed.net),
      },
      possible: {
        receive: moneyToString(month.possible.receive),
        pay: moneyToString(month.possible.pay),
      },
      range: {
        min: moneyToString(month.range.min),
        max: moneyToString(month.range.max),
      },
    })),
  };
}
