import { notFound } from "@/lib/api/server/errors";
import { toPrismaCurrency } from "@/modules/shared/enums";
import {
  findUserSettingsRow,
  updateUserBaseCurrencyRow,
} from "@/modules/settings/repository";
import { settingsPatchSchema } from "@/modules/settings/schemas";
import { toSettingsDto } from "@/modules/settings/mappers";

export async function updateSettings(userId: string, payload: unknown) {
  const input = settingsPatchSchema.parse(payload);
  const existing = await findUserSettingsRow(userId);

  if (!existing) {
    notFound("User not found.");
  }

  const updated = await updateUserBaseCurrencyRow(
    userId,
    toPrismaCurrency(input.baseCurrency),
  );
  return toSettingsDto(updated);
}
