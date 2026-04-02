import { notFound } from "@/lib/api/server/errors";
import { mapIncomeRowsToDto } from "@/modules/confirmed/income/mappers";
import { findIncomeById, updateIncomeRow } from "@/modules/confirmed/income/repository";
import {
  buildConfirmedWriteData,
  parseConfirmedInput,
} from "@/modules/confirmed/shared";

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

  const updated = await updateIncomeRow(incomeId, buildConfirmedWriteData(input));
  const [dto] = await mapIncomeRowsToDto(userId, [updated]);
  return dto;
}
