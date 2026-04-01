import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { IncomeRow } from "@/modules/incomes/types";

export async function findIncomes(
  where: Prisma.IncomeWhereInput,
): Promise<IncomeRow[]> {
  return prisma.income.findMany({
    where,
    orderBy: {
      updatedAt: "desc",
    },
  });
}

export async function findIncomeById(
  userId: string,
  incomeId: string,
): Promise<IncomeRow | null> {
  return prisma.income.findFirst({
    where: {
      id: incomeId,
      userId,
    },
  });
}

export async function createIncomeRow(
  userId: string,
  data: Omit<Prisma.IncomeUncheckedCreateInput, "userId">,
): Promise<IncomeRow> {
  return prisma.income.create({
    data: {
      ...data,
      userId,
    },
  });
}

export async function updateIncomeRow(
  incomeId: string,
  data: Omit<Prisma.IncomeUncheckedCreateInput, "userId">,
): Promise<IncomeRow> {
  return prisma.income.update({
    where: { id: incomeId },
    data,
  });
}

export async function deleteIncomeRow(incomeId: string): Promise<void> {
  await prisma.income.delete({
    where: { id: incomeId },
  });
}
