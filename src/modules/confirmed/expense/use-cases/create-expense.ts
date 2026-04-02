import { createExpenseRow } from "@/modules/confirmed/expense/repository";
import { mapExpenseRowsToDto } from "@/modules/confirmed/expense/mappers";
import {
  buildConfirmedWriteData,
  parseConfirmedInput,
} from "@/modules/confirmed/shared";

export async function createExpense(userId: string, payload: unknown) {
  const input = parseConfirmedInput(payload);
  const created = await createExpenseRow(userId, buildConfirmedWriteData(input));
  const [dto] = await mapExpenseRowsToDto(userId, [created]);
  return dto;
}
