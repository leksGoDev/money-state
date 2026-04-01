import { notFound } from "@/lib/api/errors";
import { mapIncomeRowsToDto } from "@/modules/incomes/mappers";
import { findIncomeById } from "@/modules/incomes/repository";

export async function getIncomeById(userId: string, incomeId: string) {
  const row = await findIncomeById(userId, incomeId);

  if (!row) {
    notFound("Income not found.");
  }

  const [dto] = await mapIncomeRowsToDto(userId, [row]);
  return dto;
}
