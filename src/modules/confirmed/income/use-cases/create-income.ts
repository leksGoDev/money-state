import { createIncomeRow } from "@/modules/confirmed/income/repository";
import { mapIncomeRowsToDto } from "@/modules/confirmed/income/mappers";
import {
  buildConfirmedWriteData,
  parseConfirmedInput,
} from "@/modules/confirmed/shared";

export async function createIncome(userId: string, payload: unknown) {
  const input = parseConfirmedInput(payload);
  const created = await createIncomeRow(userId, buildConfirmedWriteData(input));
  const [dto] = await mapIncomeRowsToDto(userId, [created]);
  return dto;
}
