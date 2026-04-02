import { ObligationStatus } from "@prisma/client";

import { badRequest, notFound } from "@/lib/api/server/errors";
import {
  mapObligationRowsToDto,
  toObligationCreateData,
} from "@/modules/obligations/mappers";
import { findObligationById, updateObligationRow } from "@/modules/obligations/repository";
import { parseObligationInput } from "@/modules/obligations/validators";

export async function updateObligation(
  userId: string,
  obligationId: string,
  payload: unknown,
) {
  const input = parseObligationInput(payload);
  const existing = await findObligationById(userId, obligationId);

  if (!existing) {
    notFound("Obligation not found.");
  }

  if (existing.status !== ObligationStatus.ACTIVE) {
    badRequest("Only active obligations can be edited.");
  }

  const updated = await updateObligationRow(obligationId, toObligationCreateData(input));
  const [dto] = await mapObligationRowsToDto(userId, [updated]);
  return dto;
}
