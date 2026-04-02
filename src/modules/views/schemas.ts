import { z } from "zod";

import { monthSchema, yearSchema } from "@/modules/shared/schemas";

export const monthViewQuerySchema = z.object({
  year: yearSchema,
  month: monthSchema,
  expectedWindow: z.coerce.number().int().min(0).max(6).default(1),
});

export const yearViewQuerySchema = z.object({
  year: yearSchema,
  expectedWindow: z.coerce.number().int().min(0).max(6).default(1),
});
