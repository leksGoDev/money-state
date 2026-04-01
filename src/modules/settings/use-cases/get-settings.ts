import { notFound } from "@/lib/api/errors";
import { findUserSettingsRow } from "@/modules/settings/repository";
import { toSettingsDto } from "@/modules/settings/mappers";

export async function getSettings(userId: string) {
  const row = await findUserSettingsRow(userId);

  if (!row) {
    notFound("User not found.");
  }

  return toSettingsDto(row);
}
