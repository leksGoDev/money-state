import { prisma } from "@/lib/prisma";
import type { ViewRows } from "@/modules/views/types";

export async function loadViewRows(userId: string): Promise<ViewRows> {
  const [incomes, expenses, obligations] = await Promise.all([
    prisma.income.findMany({ where: { userId } }),
    prisma.expense.findMany({ where: { userId } }),
    prisma.obligation.findMany({ where: { userId } }),
  ]);

  return { incomes, expenses, obligations };
}
