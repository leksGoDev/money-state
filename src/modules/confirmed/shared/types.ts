import type { ConfirmedTimingType } from "@/domain/types/confirmed";
import type { Currency } from "@/domain/types/money";
import { apiPaths } from "@/lib/routes/api";

export type ConfirmedEndpoint = typeof apiPaths.incomes | typeof apiPaths.expenses;

export type ConfirmedInput = {
  title: string;
  amount: number;
  currency: Currency;
  categoryId?: string | null;
  notes?: string | null;
} & (
  | {
      timingType: "single";
      year: number;
      month: number;
    }
  | {
      timingType: "monthly";
      startYear: number;
      startMonth: number;
      endYear?: number | null;
      endMonth?: number | null;
    }
  | {
      timingType: "yearly";
      month: number;
      startYear: number;
      endYear?: number | null;
    }
);

export type ConfirmedSharedRow = {
  id: string;
  title: string;
  amount: number;
  currency: Currency;
  timingType: ConfirmedTimingType;
  singleYear: number | null;
  singleMonth: number | null;
  monthlyStartYear: number | null;
  monthlyStartMonth: number | null;
  monthlyEndYear: number | null;
  monthlyEndMonth: number | null;
  yearlyMonth: number | null;
  yearlyStartYear: number | null;
  yearlyEndYear: number | null;
  categoryId: string | null;
  notes: string | null;
  sourceObligationId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ConfirmedListItemDto = {
  id: string;
  title: string;
  amount: string;
  currency: Currency;
  convertedAmount: string | null;
  baseCurrency: Currency;
  ratesDate: string | null;
  timingType: ConfirmedTimingType;
  year?: number;
  month?: number;
  startYear?: number;
  startMonth?: number;
  endYear?: number | null;
  endMonth?: number | null;
  categoryId: string | null;
  notes: string | null;
  sourceObligationId: string | null;
  createdAt: string;
  updatedAt: string;
};
