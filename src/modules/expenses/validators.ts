import { listExpensesQuerySchema } from "@/modules/expenses/schemas";

export function parseListExpensesQuery(input: unknown) {
  return listExpensesQuerySchema.parse(input);
}
