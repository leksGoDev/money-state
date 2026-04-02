import { Currency, type ObligationStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  ObligationRow,
  ObligationWithConversionsRow,
} from "@/modules/obligations/types";

export async function findObligations(
  where: Prisma.ObligationWhereInput,
): Promise<ObligationRow[]> {
  return prisma.obligation.findMany({
    where,
    orderBy: [{ status: "asc" }, { expectedYear: "asc" }, { expectedMonth: "asc" }],
  });
}

export async function findObligationById(
  userId: string,
  obligationId: string,
): Promise<ObligationRow | null> {
  return prisma.obligation.findFirst({
    where: {
      id: obligationId,
      userId,
    },
  });
}

export async function findObligationForResolve(
  tx: Prisma.TransactionClient,
  userId: string,
  obligationId: string,
): Promise<ObligationWithConversionsRow | null> {
  return tx.obligation.findFirst({
    where: {
      id: obligationId,
      userId,
    },
    include: {
      incomeConversion: true,
      expenseConversion: true,
    },
  });
}

export async function createObligationRow(
  userId: string,
  data: Omit<Prisma.ObligationUncheckedCreateInput, "userId">,
): Promise<ObligationRow> {
  return prisma.obligation.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateObligationRow(
  obligationId: string,
  data: Prisma.ObligationUncheckedUpdateInput,
): Promise<ObligationRow> {
  return prisma.obligation.update({
    where: { id: obligationId },
    data,
  });
}

export async function deleteObligationRow(obligationId: string): Promise<void> {
  await prisma.obligation.delete({
    where: { id: obligationId },
  });
}

export async function resolveObligationStatus(
  tx: Prisma.TransactionClient,
  obligationId: string,
  params: {
    status: ObligationStatus;
    resolvedYear: number;
    resolvedMonth: number;
  },
): Promise<ObligationRow> {
  return tx.obligation.update({
    where: { id: obligationId },
    data: {
      status: params.status,
      resolvedYear: params.resolvedYear,
      resolvedMonth: params.resolvedMonth,
    },
  });
}

export async function createIncomeFromObligation(
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    obligationId: string;
    title: string;
    notes: string | null;
    categoryId: string | null;
    amount: Prisma.Decimal;
    currency: Currency;
    resolvedYear: number;
    resolvedMonth: number;
  },
) {
  return tx.income.create({
    data: {
      userId: params.userId,
      title: params.title,
      notes: params.notes,
      categoryId: params.categoryId,
      amount: params.amount,
      currency: params.currency,
      timingType: "SINGLE",
      singleYear: params.resolvedYear,
      singleMonth: params.resolvedMonth,
      sourceObligationId: params.obligationId,
    },
  });
}

export async function createExpenseFromObligation(
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    obligationId: string;
    title: string;
    notes: string | null;
    categoryId: string | null;
    amount: Prisma.Decimal;
    currency: Currency;
    resolvedYear: number;
    resolvedMonth: number;
  },
) {
  return tx.expense.create({
    data: {
      userId: params.userId,
      title: params.title,
      notes: params.notes,
      categoryId: params.categoryId,
      amount: params.amount,
      currency: params.currency,
      timingType: "SINGLE",
      singleYear: params.resolvedYear,
      singleMonth: params.resolvedMonth,
      sourceObligationId: params.obligationId,
    },
  });
}

export async function withObligationsTransaction<T>(
  action: (tx: Prisma.TransactionClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(action);
}
