import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ExpenseRow } from "@/modules/expenses/types";

export async function findExpenses(
  where: Prisma.ExpenseWhereInput,
): Promise<ExpenseRow[]> {
  return prisma.expense.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function findExpenseById(
  userId: string,
  expenseId: string,
): Promise<ExpenseRow | null> {
  return prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });
}

export async function createExpenseRow(
  userId: string,
  data: Omit<Prisma.ExpenseUncheckedCreateInput, "userId">,
): Promise<ExpenseRow> {
  return prisma.expense.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateExpenseRow(
  expenseId: string,
  data: Omit<Prisma.ExpenseUncheckedCreateInput, "userId">,
): Promise<ExpenseRow> {
  return prisma.expense.update({
    where: { id: expenseId },
    data,
  });
}

export async function deleteExpenseRow(expenseId: string): Promise<void> {
  await prisma.expense.delete({
    where: { id: expenseId },
  });
}
