import type { MonthNumber } from "@/domain/types/period";

export const confirmedKindValues = ["income", "expense"] as const;
export type ConfirmedKind = (typeof confirmedKindValues)[number];

export type SingleTiming = {
  timingType: "single";
  year: number;
  month: MonthNumber;
};

export type MonthlyTiming = {
  timingType: "monthly";
  startYear: number;
  startMonth: MonthNumber;
  endYear?: number | null;
  endMonth?: MonthNumber | null;
};

export type YearlyTiming = {
  timingType: "yearly";
  month: MonthNumber;
  startYear: number;
  endYear?: number | null;
};

export type ConfirmedTiming = SingleTiming | MonthlyTiming | YearlyTiming;

export type ConfirmedEntry = {
  id: string;
  kind: ConfirmedKind;
  amount: number;
  timing: ConfirmedTiming;
  title?: string;
};
