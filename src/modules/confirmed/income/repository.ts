import type { Income, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { IncomeRow } from "@/modules/confirmed/income/types";
import type { ConfirmedPersistenceWriteData } from "@/modules/confirmed/shared";
import {
  fromPersistenceCurrency,
  fromPersistenceTimingType,
} from "@/modules/confirmed/shared/mappers";

function toIncomeRow(row: Income): IncomeRow {
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

export async function findIncomes(
  where: Prisma.IncomeWhereInput,
): Promise<IncomeRow[]> {
  const rows = await prisma.income.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
  });

  return rows.map(toIncomeRow);
}

export async function findIncomeById(
  userId: string,
  incomeId: string,
): Promise<IncomeRow | null> {
  const row = await prisma.income.findFirst({
    where: {
      id: incomeId,
      userId,
    },
  });

  return row ? toIncomeRow(row) : null;
}

export async function createIncomeRow(
  userId: string,
  data: ConfirmedPersistenceWriteData,
): Promise<IncomeRow> {
  const row = await prisma.income.create({
    data: {
      ...data,
      userId,
    },
  });

  return toIncomeRow(row);
}

export async function updateIncomeRow(
  incomeId: string,
  data: ConfirmedPersistenceWriteData,
): Promise<IncomeRow> {
  const row = await prisma.income.update({
    where: { id: incomeId },
    data,
  });

  return toIncomeRow(row);
}

export async function deleteIncomeRow(incomeId: string): Promise<void> {
  await prisma.income.delete({
    where: { id: incomeId },
  });
}
