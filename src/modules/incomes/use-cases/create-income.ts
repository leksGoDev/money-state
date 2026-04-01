import { createIncomeRow } from "@/modules/incomes/repository";
import { mapIncomeRowsToDto } from "@/modules/incomes/mappers";
import {
  buildConfirmedPrismaData,
  parseConfirmedInput,
} from "@/modules/shared/confirmed";

export async function createIncome(userId: string, payload: unknown) {
  const input = parseConfirmedInput(payload);
  const created = await createIncomeRow(userId, buildConfirmedPrismaData(input));
  const [dto] = await mapIncomeRowsToDto(userId, [created]);
  return dto;
}
