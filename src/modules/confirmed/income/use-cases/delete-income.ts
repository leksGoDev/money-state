import { notFound } from "@/lib/api/server/errors";
import { deleteIncomeRow, findIncomeById } from "@/modules/confirmed/income/repository";

export async function deleteIncome(userId: string, incomeId: string) {
  const existing = await findIncomeById(userId, incomeId);

  if (!existing) {
    notFound("Income not found.");
  }

  await deleteIncomeRow(incomeId);
  return { success: true };
}
