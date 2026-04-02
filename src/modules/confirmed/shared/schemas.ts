import { z } from "zod";

import { currencyValues } from "@/domain/types/money";
import { monthSchema, yearSchema } from "@/modules/shared/schemas";

export const confirmedEntityCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(140),
    amount: z.coerce.number().positive(),
    currency: z.enum(currencyValues),
    categoryId: z.string().cuid().nullable().optional(),
    notes: z.string().trim().max(2000).nullable().optional(),
  })
  .and(
    z.discriminatedUnion("timingType", [
      z.object({
        timingType: z.literal("single"),
        year: yearSchema,
        month: monthSchema,
      }),
      z.object({
        timingType: z.literal("monthly"),
        startYear: yearSchema,
        startMonth: monthSchema,
        endYear: yearSchema.nullable().optional(),
        endMonth: monthSchema.nullable().optional(),
      }),
      z.object({
        timingType: z.literal("yearly"),
        month: monthSchema,
        startYear: yearSchema,
        endYear: yearSchema.nullable().optional(),
      }),
    ]),
  );
