import { createExpenseRow } from "@/modules/expenses/repository";
import { mapExpenseRowsToDto } from "@/modules/expenses/mappers";
import {
  buildConfirmedPrismaData,
  parseConfirmedInput,
} from "@/modules/shared/confirmed";

export async function createExpense(userId: string, payload: unknown) {
  const input = parseConfirmedInput(payload);
  const created = await createExpenseRow(userId, buildConfirmedPrismaData(input));
  const [dto] = await mapExpenseRowsToDto(userId, [created]);
  return dto;
}
