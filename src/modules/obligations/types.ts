import type { Obligation, Prisma } from "@prisma/client";
import type { z } from "zod";

import type { Currency } from "@/domain/types/money";
import type {
  ObligationDirection,
  ObligationStatus,
} from "@/domain/types/obligation";
import type {
  obligationCreateSchema,
  cancelObligationSchema,
  listObligationsQuerySchema,
  resolveObligationSchema,
} from "@/modules/obligations/schemas";

export type ObligationInput = z.infer<typeof obligationCreateSchema>;
export type ListObligationsQuery = z.infer<typeof listObligationsQuerySchema>;
export type ResolveObligationInput = z.infer<typeof resolveObligationSchema>;
export type CancelObligationInput = z.infer<typeof cancelObligationSchema>;
export type ObligationRow = Obligation;
export type ObligationWithConversionsRow = Prisma.ObligationGetPayload<{
  include: {
    incomeConversion: true;
    expenseConversion: true;
  };
}>;

export type ObligationDto = {
  id: string;
  title: string;
  amount: string;
  currency: Currency;
  convertedAmount: string | null;
  baseCurrency: Currency;
  ratesDate: string | null;
  direction: ObligationDirection;
  status: ObligationStatus;
  activeFromYear: number;
  activeFromMonth: number;
  expectedYear: number | null;
  expectedMonth: number | null;
  resolvedYear: number | null;
  resolvedMonth: number | null;
  categoryId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
