import { notFound } from "@/lib/api/server/errors";
import { mapExpenseRowsToDto } from "@/modules/confirmed/expense/mappers";
import { findExpenseById } from "@/modules/confirmed/expense/repository";

export async function getExpenseById(userId: string, expenseId: string) {
  const row = await findExpenseById(userId, expenseId);

  if (!row) {
    notFound("Expense not found.");
  }

  const [dto] = await mapExpenseRowsToDto(userId, [row]);
  return dto;
}
