import { z } from "zod";

import { confirmedTimingTypeValues } from "@/domain/types/confirmed";
import { currencySchema, monthSchema, yearSchema } from "@/modules/shared/schemas";

export const listExpensesQuerySchema = z.object({
  search: z.string().trim().optional(),
  timingType: z.enum(confirmedTimingTypeValues).optional(),
  categoryId: z.string().cuid().optional(),
  currency: currencySchema.optional(),
  activeInYear: z.coerce.number().pipe(yearSchema).optional(),
  activeInMonth: z.coerce.number().pipe(monthSchema).optional(),
});
