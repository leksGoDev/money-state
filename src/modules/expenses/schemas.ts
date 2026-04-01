import { z } from "zod";

export const listExpensesQuerySchema = z.object({
  search: z.string().trim().optional(),
  timingType: z.enum(["single", "monthly", "yearly"]).optional(),
  categoryId: z.string().cuid().optional(),
  currency: z.enum(["USD", "EUR", "RUB", "CNY"]).optional(),
  activeInYear: z.coerce.number().int().optional(),
  activeInMonth: z.coerce.number().int().min(1).max(12).optional(),
});

export function parseListExpensesQuery(input: unknown) {
  return listExpensesQuerySchema.parse(input);
}
