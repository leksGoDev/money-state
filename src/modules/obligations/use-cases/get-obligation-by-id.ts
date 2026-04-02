import { notFound } from "@/lib/api/server/errors";
import { mapObligationRowsToDto } from "@/modules/obligations/mappers";
import { findObligationById } from "@/modules/obligations/repository";

export async function getObligationById(userId: string, obligationId: string) {
  const row = await findObligationById(userId, obligationId);

  if (!row) {
    notFound("Obligation not found.");
  }

  const [dto] = await mapObligationRowsToDto(userId, [row]);
  return dto;
}
