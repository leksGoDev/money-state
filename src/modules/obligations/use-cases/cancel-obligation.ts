import { ObligationStatus } from "@prisma/client";

import { badRequest, notFound } from "@/lib/api/server/errors";
import { mapObligationRowsToDto } from "@/modules/obligations/mappers";
import {
  findObligationById,
  resolveObligationStatus,
  withObligationsTransaction,
} from "@/modules/obligations/repository";
import { parseCancelObligationPayload } from "@/modules/obligations/validators";

export async function cancelObligation(
  userId: string,
  obligationId: string,
  payload: unknown,
) {
  const input = parseCancelObligationPayload(payload);
  const obligation = await findObligationById(userId, obligationId);

  if (!obligation) {
    notFound("Obligation not found.");
  }

  if (obligation.status !== ObligationStatus.ACTIVE) {
    badRequest("Only active obligations can be canceled.");
  }

  const updated = await withObligationsTransaction(async (tx) =>
    resolveObligationStatus(tx, obligationId, {
      status: ObligationStatus.CANCELED,
      resolvedYear: input.resolvedYear,
      resolvedMonth: input.resolvedMonth,
    }),
  );

  const [dto] = await mapObligationRowsToDto(userId, [updated]);
  return dto;
}
