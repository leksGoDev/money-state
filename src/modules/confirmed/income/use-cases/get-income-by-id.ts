import { notFound } from "@/lib/api/server/errors";
import { mapIncomeRowsToDto } from "@/modules/confirmed/income/mappers";
import { findIncomeById } from "@/modules/confirmed/income/repository";

export async function getIncomeById(userId: string, incomeId: string) {
  const row = await findIncomeById(userId, incomeId);

  if (!row) {
    notFound("Income not found.");
  }

  const [dto] = await mapIncomeRowsToDto(userId, [row]);
  return dto;
}
