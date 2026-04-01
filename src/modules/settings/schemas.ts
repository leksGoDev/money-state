import { z } from "zod";

import { currencyValues } from "@/domain/types/money";

export const settingsPatchSchema = z.object({
  baseCurrency: z.enum(currencyValues),
});
