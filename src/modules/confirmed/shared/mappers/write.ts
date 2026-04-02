import type {
  Currency as PrismaCurrency,
  TimingType as PrismaTimingType,
} from "@prisma/client";

import type { ConfirmedInput } from "@/modules/confirmed/shared/types";
import {
  toPersistenceCurrency,
  toPersistenceTimingType,
} from "@/modules/confirmed/shared/mappers/enums";

export type ConfirmedPersistenceWriteData = {
  title: string;
  amount: number;
  currency: PrismaCurrency;
  categoryId: string | null;
  notes: string | null;
  timingType: PrismaTimingType;
  singleYear: number | null;
  singleMonth: number | null;
  monthlyStartYear: number | null;
  monthlyStartMonth: number | null;
  monthlyEndYear: number | null;
  monthlyEndMonth: number | null;
  yearlyMonth: number | null;
  yearlyStartYear: number | null;
  yearlyEndYear: number | null;
};

export function buildConfirmedWriteData(
  input: ConfirmedInput,
): ConfirmedPersistenceWriteData {
  const common: ConfirmedPersistenceWriteData = {
    title: input.title,
    amount: input.amount,
    currency: toPersistenceCurrency(input.currency),
    categoryId: input.categoryId ?? null,
    notes: input.notes ?? null,
    timingType: toPersistenceTimingType(input.timingType),
    singleYear: null,
    singleMonth: null,
    monthlyStartYear: null,
    monthlyStartMonth: null,
    monthlyEndYear: null,
    monthlyEndMonth: null,
    yearlyMonth: null,
    yearlyStartYear: null,
    yearlyEndYear: null,
  };

  if (input.timingType === "single") {
    return {
      ...common,
      singleYear: input.year,
      singleMonth: input.month,
    };
  }

  if (input.timingType === "monthly") {
    return {
      ...common,
      monthlyStartYear: input.startYear,
      monthlyStartMonth: input.startMonth,
      monthlyEndYear: input.endYear ?? null,
      monthlyEndMonth: input.endMonth ?? null,
    };
  }

  return {
    ...common,
    yearlyMonth: input.month,
    yearlyStartYear: input.startYear,
    yearlyEndYear: input.endYear ?? null,
  };
}
