import { notFound } from "@/lib/api/errors";
import { deleteExpenseRow, findExpenseById } from "@/modules/expenses/repository";

export async function deleteExpense(userId: string, expenseId: string) {
  const existing = await findExpenseById(userId, expenseId);

  if (!existing) {
    notFound("Expense not found.");
  }

  await deleteExpenseRow(expenseId);
  return { success: true };
}
