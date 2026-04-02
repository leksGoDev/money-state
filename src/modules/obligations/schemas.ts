import { z } from "zod";

import { currencySchema, monthSchema, yearSchema } from "@/modules/shared/schemas";

export const obligationCreateSchema = z.object({
  title: z.string().trim().min(1).max(140),
  amount: z.coerce.number().positive(),
  currency: currencySchema,
  direction: z.enum(["pay", "receive"]),
  activeFromYear: yearSchema,
  activeFromMonth: monthSchema,
  expectedYear: yearSchema.nullable().optional(),
  expectedMonth: monthSchema.nullable().optional(),
  categoryId: z.string().cuid().nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
});

export const listObligationsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["active", "done", "canceled"]).optional(),
  direction: z.enum(["pay", "receive"]).optional(),
  categoryId: z.string().cuid().optional(),
  currency: currencySchema.optional(),
  hasExpectedPeriod: z.coerce.boolean().optional(),
  expectedYear: yearSchema.optional(),
  expectedMonth: monthSchema.optional(),
  activeInYear: yearSchema.optional(),
  activeInMonth: monthSchema.optional(),
});

export const resolveObligationSchema = z.discriminatedUnion("resolution", [
  z.object({
    resolution: z.literal("closed"),
    resolvedYear: yearSchema,
    resolvedMonth: monthSchema,
  }),
  z.object({
    resolution: z.literal("converted"),
    resolvedYear: yearSchema,
    resolvedMonth: monthSchema,
    confirmed: z.object({
      title: z.string().trim().min(1).max(140).optional(),
      categoryId: z.string().cuid().nullable().optional(),
      notes: z.string().trim().max(2000).nullable().optional(),
    }),
  }),
]);

export const cancelObligationSchema = z.object({
  resolvedYear: yearSchema,
  resolvedMonth: monthSchema,
});
