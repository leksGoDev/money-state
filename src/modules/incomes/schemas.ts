import { z } from "zod";

import { currencySchema, monthSchema, yearSchema } from "@/modules/shared/schemas";

export const listIncomesQuerySchema = z.object({
  search: z.string().trim().optional(),
  timingType: z.enum(["single", "monthly", "yearly"]).optional(),
  categoryId: z.string().cuid().optional(),
  currency: currencySchema.optional(),
  activeInYear: z.coerce.number().pipe(yearSchema).optional(),
  activeInMonth: z.coerce.number().pipe(monthSchema).optional(),
});
