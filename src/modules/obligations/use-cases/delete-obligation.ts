import { notFound } from "@/lib/api/server/errors";
import { deleteObligationRow, findObligationById } from "@/modules/obligations/repository";

export async function deleteObligation(userId: string, obligationId: string) {
  const existing = await findObligationById(userId, obligationId);

  if (!existing) {
    notFound("Obligation not found.");
  }

  await deleteObligationRow(obligationId);
  return { success: true };
}
