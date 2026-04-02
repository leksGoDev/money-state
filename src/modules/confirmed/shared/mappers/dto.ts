import { moneyToString, type Currency } from "@/domain/types/money";
import type {
  ConfirmedListItemDto,
  ConfirmedSharedRow,
} from "@/modules/confirmed/shared/types";

type CurrencyConversionContext = {
  baseCurrency: Currency;
  ratesDate: string | null;
  rates: ReadonlyMap<string, number>;
};

export function toConfirmedListItemDto(params: {
  row: ConfirmedSharedRow;
  convertedAmount: number | null;
  baseCurrency: Currency;
  ratesDate: string | null;
}): ConfirmedListItemDto {
  const timingType = params.row.timingType;

  return {
    id: params.row.id,
    title: params.row.title,
    amount: moneyToString(params.row.amount),
    currency: params.row.currency,
    convertedAmount:
      params.convertedAmount == null ? null : moneyToString(params.convertedAmount),
    baseCurrency: params.baseCurrency,
    ratesDate: params.ratesDate,
    timingType,
    year: timingType === "single" ? params.row.singleYear ?? undefined : undefined,
    month:
      timingType === "single" || timingType === "yearly"
        ? params.row.singleMonth ?? params.row.yearlyMonth ?? undefined
        : undefined,
    startYear:
      timingType === "monthly" || timingType === "yearly"
        ? params.row.monthlyStartYear ?? params.row.yearlyStartYear ?? undefined
        : undefined,
    startMonth:
      timingType === "monthly" ? params.row.monthlyStartMonth ?? undefined : undefined,
    endYear:
      timingType === "monthly"
        ? params.row.monthlyEndYear
        : timingType === "yearly"
          ? params.row.yearlyEndYear
          : undefined,
    endMonth: timingType === "monthly" ? params.row.monthlyEndMonth : undefined,
    categoryId: params.row.categoryId,
    notes: params.row.notes,
    sourceObligationId: params.row.sourceObligationId,
    createdAt: params.row.createdAt.toISOString(),
    updatedAt: params.row.updatedAt.toISOString(),
  };
}

export function mapConfirmedRowsToListItemDto(
  rows: ReadonlyArray<ConfirmedSharedRow>,
  conversion: CurrencyConversionContext,
): ConfirmedListItemDto[] {
  return rows.map((row) => {
    const rate = conversion.rates.get(`${row.currency}:${conversion.baseCurrency}`);
    const convertedAmount =
      row.currency === conversion.baseCurrency
        ? row.amount
        : rate == null
          ? null
          : row.amount * rate;

    return toConfirmedListItemDto({
      row,
      convertedAmount,
      baseCurrency: conversion.baseCurrency,
      ratesDate: conversion.ratesDate,
    });
  });
}
