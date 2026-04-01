import { z } from "zod";

export const listIncomesQuerySchema = z.object({
  search: z.string().trim().optional(),
  timingType: z.enum(["single", "monthly", "yearly"]).optional(),
  categoryId: z.string().cuid().optional(),
  currency: z.enum(["USD", "EUR", "RUB", "CNY"]).optional(),
  activeInYear: z.coerce.number().int().optional(),
  activeInMonth: z.coerce.number().int().min(1).max(12).optional(),
});

export function parseListIncomesQuery(input: unknown) {
  return listIncomesQuerySchema.parse(input);
}
