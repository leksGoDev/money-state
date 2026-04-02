import { createObligationRow } from "@/modules/obligations/repository";
import {
  mapObligationRowsToDto,
  toObligationCreateData,
} from "@/modules/obligations/mappers";
import { parseObligationInput } from "@/modules/obligations/validators";

export async function createObligation(userId: string, payload: unknown) {
  const input = parseObligationInput(payload);
  const created = await createObligationRow(userId, toObligationCreateData(input));
  const [dto] = await mapObligationRowsToDto(userId, [created]);
  return dto;
}
