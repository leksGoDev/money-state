import type { Expense, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { ExpenseRow } from "@/modules/confirmed/expense/types";
import type { ConfirmedPersistenceWriteData } from "@/modules/confirmed/shared";
import {
  fromPersistenceCurrency,
  fromPersistenceTimingType,
} from "@/modules/confirmed/shared/mappers";

function toExpenseRow(row: Expense): ExpenseRow {
  return {
    id: row.id,
    title: row.title,
    amount: Number(row.amount),
    currency: fromPersistenceCurrency(row.currency),
    timingType: fromPersistenceTimingType(row.timingType),
    singleYear: row.singleYear,
    singleMonth: row.singleMonth,
    monthlyStartYear: row.monthlyStartYear,
    monthlyStartMonth: row.monthlyStartMonth,
    monthlyEndYear: row.monthlyEndYear,
    monthlyEndMonth: row.monthlyEndMonth,
    yearlyMonth: row.yearlyMonth,
    yearlyStartYear: row.yearlyStartYear,
    yearlyEndYear: row.yearlyEndYear,
    categoryId: row.categoryId,
    notes: row.notes,
    sourceObligationId: row.sourceObligationId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function findExpenses(
  where: Prisma.ExpenseWhereInput,
): Promise<ExpenseRow[]> {
  const rows = await prisma.expense.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map(toExpenseRow);
}

export async function findExpenseById(
  userId: string,
  expenseId: string,
): Promise<ExpenseRow | null> {
  const row = await prisma.expense.findFirst({
    where: {
      id: expenseId,
      userId,
    },
  });

  return row ? toExpenseRow(row) : null;
}

export async function createExpenseRow(
  userId: string,
  data: ConfirmedPersistenceWriteData,
): Promise<ExpenseRow> {
  const row = await prisma.expense.create({
    data: {
      ...data,
      userId,
    },
  });

  return toExpenseRow(row);
}

export async function updateExpenseRow(
  expenseId: string,
  data: ConfirmedPersistenceWriteData,
): Promise<ExpenseRow> {
  const row = await prisma.expense.update({
    where: { id: expenseId },
    data,
  });

  return toExpenseRow(row);
}

export async function deleteExpenseRow(expenseId: string): Promise<void> {
  await prisma.expense.delete({
    where: { id: expenseId },
  });
}
