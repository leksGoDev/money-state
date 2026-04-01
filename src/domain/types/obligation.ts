import type { MonthNumber } from "@/domain/types/period";

export const obligationDirectionValues = ["pay", "receive"] as const;
export const obligationStatusValues = ["active", "done", "canceled"] as const;

export type ObligationDirection = (typeof obligationDirectionValues)[number];
export type ObligationStatus = (typeof obligationStatusValues)[number];

export type ObligationEntry = {
  id: string;
  title: string;
  amount: number;
  direction: ObligationDirection;
  status: ObligationStatus;
  activeFromYear: number;
  activeFromMonth: MonthNumber;
  expectedYear?: number | null;
  expectedMonth?: MonthNumber | null;
  resolvedYear?: number | null;
  resolvedMonth?: MonthNumber | null;
};
