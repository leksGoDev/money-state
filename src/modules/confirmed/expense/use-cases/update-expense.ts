import { notFound } from "@/lib/api/server/errors";
import { mapExpenseRowsToDto } from "@/modules/confirmed/expense/mappers";
import { findExpenseById, updateExpenseRow } from "@/modules/confirmed/expense/repository";
import {
  buildConfirmedWriteData,
  parseConfirmedInput,
} from "@/modules/confirmed/shared";

export async function updateExpense(
  userId: string,
  expenseId: string,
  payload: unknown,
) {
  const input = parseConfirmedInput(payload);
  const existing = await findExpenseById(userId, expenseId);

  if (!existing) {
    notFound("Expense not found.");
  }

  const updated = await updateExpenseRow(expenseId, buildConfirmedWriteData(input));
  const [dto] = await mapExpenseRowsToDto(userId, [updated]);
  return dto;
}
