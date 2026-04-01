import { notFound } from "@/lib/api/errors";
import { mapIncomeRowsToDto } from "@/modules/incomes/mappers";
import { findIncomeById, updateIncomeRow } from "@/modules/incomes/repository";
import {
  buildConfirmedPrismaData,
  parseConfirmedInput,
} from "@/modules/shared/confirmed";

export async function updateIncome(
  userId: string,
  incomeId: string,
  payload: unknown,
) {
  const input = parseConfirmedInput(payload);
  const existing = await findIncomeById(userId, incomeId);

  if (!existing) {
    notFound("Income not found.");
  }

  const updated = await updateIncomeRow(incomeId, buildConfirmedPrismaData(input));
  const [dto] = await mapIncomeRowsToDto(userId, [updated]);
  return dto;
}
