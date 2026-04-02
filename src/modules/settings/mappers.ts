import type { Currency as PrismaCurrency } from "@prisma/client";

import { fromPrismaCurrency } from "@/modules/shared/repository-enums";
import type { SettingsDto } from "@/modules/settings/types";

export function toSettingsDto(row: { baseCurrency: PrismaCurrency }): SettingsDto {
  return {
    baseCurrency: fromPrismaCurrency(row.baseCurrency),
  };
}
