import { notFound } from "@/lib/api/server/errors";
import { mapExpenseRowsToDto } from "@/modules/expenses/mappers";
import { findExpenseById, updateExpenseRow } from "@/modules/expenses/repository";
import {
  buildConfirmedPrismaData,
  parseConfirmedInput,
} from "@/modules/shared/confirmed";

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

  const updated = await updateExpenseRow(expenseId, buildConfirmedPrismaData(input));
  const [dto] = await mapExpenseRowsToDto(userId, [updated]);
  return dto;
}
